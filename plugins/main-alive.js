const { cmd } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "alive",
    alias: ["status", "online", "a"],
    desc: "Check if bot is alive in a fancy lovish style 🌹",
    category: "main",
    react: "💖",
    filename: __filename
},
async (conn, mek, m, { from, sender }) => {
    try {
        const ramUsed = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const ramTotal = (os.totalmem() / 1024 / 1024).toFixed(2);

        const fancyStatus = `
╔═══❖•ೋ° °ೋ•❖═══╗
    💖🌹  *${config.BOT_NAME} IS ALIVE*  🌹💖
╚═══❖•ೋ° °ೋ•❖═══╝

✨ Hey Beautiful Soul, @${sender.split('@')[0]} ✨  
I’m not just alive… I’m glowing with love & energy just for you 💕  

╭──────❀ STATUS ❀──────╮
🌹 *Owner:* ${config.OWNER_NAME}  
⚡ *Version:* 4.0.0  
📝 *Prefix:* [${config.PREFIX}]  
📳 *Mode:* ${config.MODE}  
💾 *RAM:* ${ramUsed}MB / ${ramTotal}MB  
🖥️ *Host:* ${os.hostname()}  
⌛ *Uptime:* ${runtime(process.uptime())}  
╰──────────────────────╯

💌 Every uptime second = a heartbeat for you  
🔥 Every spark of energy = my love for you  
🌹 Forever yours, *${config.BOT_NAME}* 💖
`;

        await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/t6dg4j.jpg' },
            caption: fancyStatus,
            mentions: [sender]
        }, { quoted: mek });

    } catch (e) {
        console.error("Alive Error:", e);
        await conn.sendMessage(from, { text: `❌ Oops love, error: ${e.message}` }, { quoted: mek });
    }
});