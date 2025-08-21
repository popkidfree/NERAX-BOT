const config = require('../config');
const { cmd } = require('../command');

function isEnabled(value) {
    return value && value.toString().toLowerCase() === "true";
}

cmd({
    pattern: "env",
    alias: ["config", "settings", "botinfo"],
    desc: "💖 View all bot configuration variables (Owner Only)",
    category: "system",
    react: "🌹",
    filename: __filename
}, 
async (conn, mek, m, { from, reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("🚫 *Owner Only!* You don’t have permission to view this lovish panel 💔");
        }

        const envSettings = `
╭─────────────◆
│ 💎✨ *${config.BOT_NAME} LOVISH PANEL* ✨💎
│
│ 🌹 *Owner Info*
│    ❤️ Name: ${config.OWNER_NAME}
│    📞 Number: ${config.OWNER_NUMBER}
│
│ 💕 *Bot Info*
│    🤖 Name: ${config.BOT_NAME}
│    🔑 Prefix: ${config.PREFIX}
│    🎭 Mode: ${config.MODE.toUpperCase()}
│
│ 💫 *Core Settings*
│    🔓 Public Mode: ${isEnabled(config.PUBLIC_MODE) ? "💚 On" : "💔 Off"}
│    🌐 Always Online: ${isEnabled(config.ALWAYS_ONLINE) ? "💚" : "💔"}
│    👀 Read Msgs: ${isEnabled(config.READ_MESSAGE) ? "💚" : "💔"}
│    📩 Read Cmds: ${isEnabled(config.READ_CMD) ? "💚" : "💔"}
│
│ 💝 *Automation*
│    💬 Auto Reply: ${isEnabled(config.AUTO_REPLY) ? "💚" : "💔"}
│    😍 Auto React: ${isEnabled(config.AUTO_REACT) ? "💚" : "💔"}
│    🎭 Custom React: ${isEnabled(config.CUSTOM_REACT) ? "💚" : "💔"}
│    ✨ React Emojis: ${config.CUSTOM_REACT_EMOJIS}
│    🌟 Auto Sticker: ${isEnabled(config.AUTO_STICKER) ? "💚" : "💔"}
│
│ 💌 *Status Settings*
│    👁️‍🗨️ Seen: ${isEnabled(config.AUTO_STATUS_SEEN) ? "💚" : "💔"}
│    📝 Reply: ${isEnabled(config.AUTO_STATUS_REPLY) ? "💚" : "💔"}
│    💖 React: ${isEnabled(config.AUTO_STATUS_REACT) ? "💚" : "💔"}
│    💌 Msg: ${config.AUTO_STATUS_MSG}
│
│ 🛡️ *Security*
│    🔗 Anti-Link: ${isEnabled(config.ANTI_LINK) ? "💚" : "💔"}
│    🚫 Anti-Bad: ${isEnabled(config.ANTI_BAD) ? "💚" : "💔"}
│    👀 Anti-VV: ${isEnabled(config.ANTI_VV) ? "💚" : "💔"}
│    ❌ Delete Links: ${isEnabled(config.DELETE_LINKS) ? "💚" : "💔"}
│
│ 🎨 *Media*
│    🖼️ Alive Img: ${config.ALIVE_IMG}
│    🖼️ Menu Img: ${config.MENU_IMAGE_URL}
│    💬 Alive Msg: ${config.LIVE_MSG}
│    🎭 Sticker Pack: ${config.STICKER_NAME}
│
│ ⏳ *Miscellaneous*
│    ⌨️ Typing: ${isEnabled(config.AUTO_TYPING) ? "💚" : "💔"}
│    🎙️ Recording: ${isEnabled(config.AUTO_RECORDING) ? "💚" : "💔"}
│    🗂️ Anti-Del Path: ${config.ANTI_DEL_PATH}
│    👨‍💻 Dev: ${config.DEV}
│
╰─────────────◆
🌹 *${config.DESCRIPTION}* 🌹
✨ Crafted with Love ❤️
`;

        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: envSettings,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (error) {
        console.error('Env command error:', error);
        reply(`❌ Oops, something broke: ${error.message}`);
    }
});