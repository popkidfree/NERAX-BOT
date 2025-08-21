const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');
const os = require("os");

/**
 * ⏱️ Advanced Uptime Command
 * Shows detailed system & bot runtime stats
 * in a clean premium-styled card.
 */

cmd({
  pattern: "uptime",
  alias: ["runtime", "up"],
  desc: "Show bot uptime with system statistics",
  category: "main",
  react: "⏱️",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // ⏳ Bot uptime
    const uptime = runtime(process.uptime());
    const startTime = new Date(Date.now() - process.uptime() * 1000);

    // 💻 System stats
    const totalMem = (os.totalmem() / 1024 / 1024 / 1024).toFixed(2);
    const freeMem = (os.freemem() / 1024 / 1024 / 1024).toFixed(2);
    const usedMem = (totalMem - freeMem).toFixed(2);
    const cpuLoad = os.loadavg()[0].toFixed(2);

    const nodeVer = process.version;
    const platform = os.platform();

    // 🎨 Stylish response
    const styledUptime = 
`┏━━━━━━━━━━━━━━━━━━━┓
┃   ⚡ ${config.BOT_NAME || "MY-BOT"} STATUS ⚡
┗━━━━━━━━━━━━━━━━━━━┛

⏱️ *Uptime:* ${uptime}
📅 *Started On:* ${startTime.toLocaleString()}
🛠️ *Version:* 4.0.0

💻 *System Info*
├ RAM: ${usedMem} GB / ${totalMem} GB
├ CPU Load: ${cpuLoad}%
├ Node.js: ${nodeVer}
└ OS: ${platform.toUpperCase()}

${config.DESCRIPTION || ""}
> 👑 Powered by ${config.OWNER_NAME || "BOT OWNER"}`;

    // 📤 Send styled message
    await conn.sendMessage(from, { 
      text: styledUptime,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363388320701164@newsletter',
          newsletterName: config.OWNER_NAME || 'JesterTechX',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("❌ Uptime Error:", e);
    reply(`❌ Error: ${e.message}`);
  }
});