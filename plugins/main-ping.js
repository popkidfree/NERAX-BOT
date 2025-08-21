const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    use: '.ping',
    desc: "Check bot's response time in futuristic tech style ⚡",
    category: "main",
    react: "🚀",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        const start = Date.now();

        // Cyber emojis
        const cyberIcons = ['⚡', '💻', '🚀', '🌐', '🛰️', '🔮', '🧠', '🎯', '🔋', '⏱️'];
        const icon = cyberIcons[Math.floor(Math.random() * cyberIcons.length)];

        await conn.sendMessage(from, { react: { text: icon, key: mek.key } });

        const responseTime = Date.now() - start;

        const fancyPing = `
┌───────────────────◉
│   ⚡ SYSTEM STATUS ⚡
├───────────────────◉
│ 📡 *Bot:* ${config.BOT_NAME}
│ 👨‍💻 *Owner:* ${config.OWNER_NAME}
│ ⏱️ *Speed:* ${responseTime} ms ${icon}
│ 💾 *Prefix:* [${config.PREFIX}]
├───────────────────◉
│ 🛰️ Response: Online & Optimized
└───────────────────◉
> ${config.DESCRIPTION}
`;

        await conn.sendMessage(from, {
            text: fancyPing,
            contextInfo: { mentionedJid: [sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("Ping Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});


// PING2 - Futuristic Loading
cmd({
    pattern: "ping2",
    desc: "Check bot's response time with futuristic loading 🛰️",
    category: "main",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const startTime = Date.now();
        const { key } = await conn.sendMessage(from, { text: '🛰️ *System Initializing...*' });
        const ping = Date.now() - startTime;

        const stages = [
            '⚡ Booting System 《 ▭▭▭▭▭▭▭▭▭▭ 》0%',
            '💻 Calibrating Modules 《 ▬▭▭▭▭▭▭▭▭▭ 》10%',
            '🔋 Optimizing Memory 《 ▬▬▭▭▭▭▭▭▭▭ 》20%',
            '🌐 Syncing Data 《 ▬▬▬▭▭▭▭▭▭▭ 》30%',
            '🚀 Powering Core 《 ▬▬▬▬▭▭▭▭▭▭ 》40%',
            '🛰️ Linking Servers 《 ▬▬▬▬▬▭▭▭▭▭ 》50%',
            '🔮 Activating AI 《 ▬▬▬▬▬▬▭▭▭▭ 》60%',
            '🎯 Stabilizing Signal 《 ▬▬▬▬▬▬▬▭▭▭ 》70%',
            '🧠 Neural Uplink 《 ▬▬▬▬▬▬▬▬▭▭ 》80%',
            '⚡ Full Power 《 ▬▬▬▬▬▬▬▬▬▭ 》90%',
            `✅ *Response Time:* ${ping}ms ⚡`,
        ];

        for (let stage of stages) {
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: key,
                        type: 14,
                        editedMessage: { conversation: stage },
                    },
                },
                {}
            );
        }
    } catch (e) {
        console.error("Ping2 Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});