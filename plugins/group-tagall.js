const { cmd } = require('../command')

cmd({
    pattern: "tagall",
    react: "📢",
    alias: ["gc_tagall", "alltag"],
    desc: "💌 Elegantly tag all group members",
    category: "group",
    use: ".tagall [message]",
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, groupAdmins, command, body }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in *groups*.");

        const botOwner = conn.user.id.split(":")[0];
        const senderJid = senderNumber + "@s.whatsapp.net";

        if (!groupAdmins.includes(senderJid) && senderNumber !== botOwner) {
            return reply("⛔ Only *Group Admins* or *Bot Owner* can use this command.");
        }

        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("❌ Failed to fetch group info.");

        let groupName = groupInfo.subject || "Unknown Group";
        let totalMembers = participants?.length || 0;
        if (totalMembers === 0) return reply("❌ No members found.");

        // 🌹 Elegant emojis
        let emojis = ['🌹','💎','🎀','✨','🌸','🌐','🦋','🎶','❤️','💫','🥀','🔥','👑','🎉','🌷'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Extract custom message
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "💌 *Attention, Lovely People!* 🌹";

        // 🌟 Stylish tag message
        let teks = `
╔═══❖•ೋ° °ೋ•❖═══╗
      ${randomEmoji} *Group Broadcast* ${randomEmoji}
╚═══❖•ೋ° °ೋ•❖═══╝

💎 *Group*: ${groupName}
👥 *Members*: ${totalMembers}
💌 *Message*: ${message}

┌───🌹 *Special Mentions* 🌹───┐
`;

        for (let mem of participants) {
            if (!mem.id) continue;
            teks += `✨ @${mem.id.split('@')[0]}\n`;
        }

        teks += `└──────━★━──────┘\n💖 *Powered with Love by Popkid* 💖`;

        await conn.sendMessage(
            from,
            { text: teks, mentions: participants.map(a => a.id) },
            { quoted: mek }
        );

    } catch (e) {
        console.error("TagAll Error:", e);
        reply(`❌ Oops! Something went wrong:\n${e.message || e}`);
    }
});