const { cmd } = require('../command');
const { getBuffer, fetchJson } = require('../lib/functions');

cmd({
    pattern: "person",
    react: "👤",
    alias: ["userinfo", "profile"],
    desc: "Get complete user profile information",
    category: "utility",
    use: '.person [@tag or reply]',
    filename: __filename
},
async (conn, mek, m, { from, sender, isGroup, reply, quoted, participants }) => {
    try {
        let userJid = quoted?.sender || 
                     mek.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || 
                     sender;

        const [user] = await conn.onWhatsApp(userJid).catch(() => []);
        if (!user?.exists) return reply("❌ User not found on WhatsApp");

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(userJid, 'image');
        } catch {
            ppUrl = 'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png';
        }

        let userName = userJid.split('@')[0];
        try {
            if (isGroup) {
                const member = participants.find(p => p.id === userJid);
                if (member?.notify) userName = member.notify;
            }
            if (userName === userJid.split('@')[0] && conn.contactDB) {
                const contact = await conn.contactDB.get(userJid).catch(() => null);
                if (contact?.name) userName = contact.name;
            }
            if (userName === userJid.split('@')[0]) {
                const presence = await conn.presenceSubscribe(userJid).catch(() => null);
                if (presence?.pushname) userName = presence.pushname;
            }
        } catch (e) {
            console.log("Name fetch error:", e);
        }

        let bio = {};
        try {
            const statusData = await conn.fetchStatus(userJid).catch(() => null);
            if (statusData?.status) {
                bio = {
                    text: statusData.status,
                    type: "Personal",
                    updated: statusData.setAt ? new Date(statusData.setAt * 1000) : null
                };
            } else {
                const businessProfile = await conn.getBusinessProfile(userJid).catch(() => null);
                if (businessProfile?.description) {
                    bio = {
                        text: businessProfile.description,
                        type: "Business",
                        updated: null
                    };
                }
            }
        } catch (e) {
            console.log("Bio fetch error:", e);
        }

        let groupRole = "";
        if (isGroup) {
            const participant = participants.find(p => p.id === userJid);
            groupRole = participant?.admin ? "👑 Royal Admin" : "👥 Noble Member";
        }

        const formattedBio = bio.text ? 
            `💬 ${bio.text}\n   └─ 📌 ${bio.type} Bio${bio.updated ? ` | 🕒 ${bio.updated.toLocaleString()}` : ''}` : 
            "⚠️ No bio available";

        const userInfo = `
💠━━━━━━━━━━━━━━━━━💠
      👑 *ROYAL USER PROFILE* 👑
💠━━━━━━━━━━━━━━━━━💠

🔱 *Name*      : ${userName}
💎 *Number*    : ${userJid.replace(/@.+/, '')}
🏛 *Type*      : ${user.isBusiness ? "💼 Business" : user.isEnterprise ? "🏢 Enterprise" : "👤 Personal"}

📜 *About / Bio*
${formattedBio}

⚔️ *Account Info*
✅ Registered : ${user.isUser ? "Yes" : "No"}
🛡 Verified   : ${user.verifiedName ? "✅ Verified" : "❌ Not Verified"}
${isGroup ? `👥 Group Role : ${groupRole}` : ""}

👑━━━〔 🌍 POPKID ┃ MD 〕━━━👑
        `.trim();

        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: userInfo,
            mentions: [userJid]
        }, { quoted: mek });

    } catch (e) {
        console.error("Person command error:", e);
        reply(`❌ Error: ${e.message || "Failed to fetch profile"}`);
    }
});