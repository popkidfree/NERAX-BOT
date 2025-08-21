const { cmd } = require('../command')

cmd({
    pattern: "ginfo",
    alias: ["groupinfo", "grpinfo"],
    desc: "🌹 Fetch stylish group information",
    category: "group",
    react: "👥",
    use: ".ginfo",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isDev, isBotAdmins, reply, participants }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in *groups*.");
        if (!isAdmins && !isDev) return reply("⛔ Only *Group Admins* or *Bot Dev* can use this.");
        if (!isBotAdmins) return reply("❌ I need *admin rights* to fetch group details.");

        const metadata = await conn.groupMetadata(from);

        // Fetch DP with fallback
        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(from, "image");
        } catch {
            ppUrl = "https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png";
        }

        const groupAdmins = participants.filter(p => p.admin);
        const owner = metadata.owner || groupAdmins[0]?.id || "unknown";
        const listAdmin = groupAdmins.map((v, i) => `✨ ${i + 1}. @${v.id.split("@")[0]}`).join("\n");

        // Lovish Group Card
        const gdata = `
╭━━━💎 *GROUP LUXURY CARD* 💎━━━╮
│
│ 🌹 *Name*: ${metadata.subject}
│ 🆔 *ID*: ${metadata.id}
│ 👥 *Members*: ${metadata.size}
│ 👑 *Owner*: @${owner.split('@')[0]}
│
│ 📝 *Description*: 
│ ${metadata.desc?.toString() || "— No description set —"}
│
│ 🛡️ *Admins* (${groupAdmins.length}):
│ ${listAdmin || "— None —"}
│
╰━━━━━━━━━━━━━━━━━━━━━━━╯
💖 *Powered with Elegance by Popkid* 💖
`;

        await conn.sendMessage(
            from,
            {
                image: { url: ppUrl },
                caption: gdata,
                mentions: groupAdmins.map(v => v.id).concat([owner])
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("GroupInfo Error:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});