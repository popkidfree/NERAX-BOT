const config = require('../config')
const { cmd, commands } = require('../command')
const { runtime } = require('../lib/functions')

cmd({
    pattern: "list",
    alias: ["listcmd", "commands", "menu"],
    desc: "🌸 Show all available commands with style",
    category: "menu",
    react: "📜",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        // Count total commands & aliases
        const totalCommands = Object.keys(commands).length
        let aliasCount = 0
        Object.values(commands).forEach(cmd => {
            if (cmd.alias) aliasCount += cmd.alias.length
        })

        // Get unique categories
        const categories = [...new Set(Object.values(commands).map(c => c.category))]

        // 🌹 Fancy Menu Header
        let menuText = `
╔═══❖•ೋ° °ೋ•❖═══╗
   🌹 *${config.BOT_NAME} MENU* 🌹
╚═══❖•ೋ° °ೋ•❖═══╝

🤖 *Bot Name*: ${config.BOT_NAME}
👑 *Owner*: ${config.OWNER_NAME}
⚙️ *Prefix*: [${config.PREFIX}]
🕒 *Uptime*: ${runtime(process.uptime())}
📦 *Version*: 4.0.0
🌐 *Platform*: Heroku

📊 *Bot Stats*:
• 📜 Commands: ${totalCommands}
• 🔄 Aliases: ${aliasCount}
• 🗂 Categories: ${categories.length}

─────────────────────
`

        // Organize by categories
        const categorized = {}
        categories.forEach(cat => {
            categorized[cat] = Object.values(commands).filter(c => c.category === cat)
        })

        // 🌸 Stylish Category Listing
        for (const [category, cmds] of Object.entries(categorized)) {
            menuText += `\n💎 ───『 *${category.toUpperCase()}* 』─── 💎\n`
            cmds.forEach(c => {
                menuText += `
🌹 *Command*: .${c.pattern}
💫 *Desc*: ${c.desc || 'No description available'}
${c.alias?.length ? `✨ *Aliases*: ${c.alias.map(a => `.${a}`).join(', ')}` : ''}
${c.use ? `💡 *Usage*: ${c.use}` : ''}`
            })
            menuText += `\n─────────────────────\n`
        }

        // 🌷 Footer Note
        menuText += `
💌 *Note*: Use ${config.PREFIX}help <command> for details.
> ${config.DESCRIPTION}
`

        // Send with Menu Image
        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/7zfdcq.jpg' },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        )

    } catch (e) {
        console.error('Command List Error:', e)
        reply(`❌ Error generating menu: ${e.message}`)
    }
})