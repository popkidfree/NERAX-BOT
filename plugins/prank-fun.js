const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Displays a dynamic and playful 'Hacking' animation (for fun only).",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { from, senderNumber, reply }) => {
    try {
        // Dynamically get bot owner number
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("⛔ Only the bot owner can use this command.");
        }

        const steps = [
            `
╔═━━───── • ─────━━═╗
      💻  𝙃𝘼𝘾𝙆 𝙎𝙀𝙌𝙐𝙀𝙉𝘾𝙀
╚═━━───── • ─────━━═╝

🔍 *Initializing hacking tools...* 🛠️
🌐 *Connecting to remote servers...*
            `,
            '```[██████░░░░░░░░░░░░] 10%``` ⏳',
            '```[██████████░░░░░░░░] 30%``` ⏳',
            '```[██████████████░░░░] 50%``` ⏳',
            '```[██████████████████] 70%``` ⏳',
            '```[██████████████████████] 90%``` ⏳',
            '```[████████████████████████] 100%``` ✅',
            `
🔒 *System Breach: Successful!* 🔓
🚀 *Command Execution: Complete!* 🎯
📡 *Transmitting data...*
🤫 *Ensuring stealth...*
🏁 *Finalizing operations...*
            `,
            `
╔═━━───── • ─────━━═╗
   ☣  𝙉𝙀𝙍𝘼𝙓 𝙃𝘼𝘾𝙆 𝘾𝙊𝙈𝙋𝙇𝙀𝙏𝙀
╚═━━───── • ─────━━═╝

⚠️ *Disclaimer*: For *fun/demo* only.  
⚠️ *Reminder*: Always practice ethical hacking.
            `
        ];

        for (const step of steps) {
            await conn.sendMessage(from, { text: step }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 1000)); // delay per step
        }

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});