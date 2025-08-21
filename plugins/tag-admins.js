const config = require('../config')
const { cmd } = require('../command')
const { getGroupAdmins } = require('../lib/functions')

cmd({
    pattern: "tagadmins",
    react: "👑",
    alias: ["gc_tagadmins"],
    desc: "To Tag all Admins of the Group",
    category: "group",
    use: '.tagadmins [message]',
    filename: __filename
},
async (conn, mek, m, { from, participants, reply, isGroup, senderNumber, command, args, body }) => {
    try {
        if (!isGroup) return reply("🚫 *This command can only be used in groups!*");

        // Fetch group metadata
        let groupInfo = await conn.groupMetadata(from).catch(() => null);
        if (!groupInfo) return reply("⚠️ Failed to fetch group information.");

        let groupName = groupInfo.subject || "Unknown Group";
        let admins = await getGroupAdmins(participants);
        let totalAdmins = admins ? admins.length : 0;
        if (totalAdmins === 0) return reply("⚠️ No admins found in this group.");

        let emojis = ['👑','⚡','🌟','✨','🎖️','💎','🔱','🛡️','🚀','🏆'];
        let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

        // Extract message
        let message = body.slice(body.indexOf(command) + command.length).trim();
        if (!message) message = "⚡ Attention All Admins ⚡";

        // FANCY BOXED STYLE MESSAGE
        let teks = `
╔════════════════════════╗
       👑 *ADMIN ALERT* 👑
╚════════════════════════╝

╔━─━─━─━─━─━─━─━─━─━╗
┃ 📌 *Group*   : ${groupName}
┃ 👥 *Admins*  : ${totalAdmins}
┃ 📝 *Message* : ${message}
╚━─━─━─━─━─━─━─━─━─━╝

╔═══〔 *ADMIN MENTIONS* 〕═══╗
${admins.map(a => `┃ ${randomEmoji} @${a.split('@')[0]}`).join('\n')}
╚═══════════════════════════╝

★彡 *POPKID ┃ MD BOT* 彡★
        `;

        await conn.sendMessage(from, { text: teks, mentions: admins }, { quoted: mek });

    } catch (e) {
        console.error("TagAdmins Error:", e);
        reply(`❌ *Error Occurred !!*\n\n${e.message || e}`);
    }
});