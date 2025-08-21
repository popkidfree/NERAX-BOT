const fs = require("fs");
const path = require("path");
const axios = require("axios");
const config = require("../config");
const { cmd } = require("../command");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

// ================= PRIVACY MENU ================= //
cmd({
    pattern: "privacy",
    alias: ["privacymenu"],
    desc: "Privacy settings menu",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const privacyMenu = `╭━━〔 *Privacy Settings* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• blocklist - View blocked users
┃◈┃• getbio - Get user's bio
┃◈┃• setppall - Set profile pic privacy
┃◈┃• setonline - Set online privacy
┃◈┃• setpp - Change bot's profile pic
┃◈┃• setmyname - Change bot's name
┃◈┃• updatebio - Change bot's bio
┃◈┃• groupsprivacy - Set group add privacy
┃◈┃• getprivacy - View current privacy settings
┃◈┃• getpp - Get user's profile picture
┃◈┃
┃◈┃*Privacy Options:*
┃◈┃ all | contacts | contact_blacklist | none
┃◈┃ (online: all | match_last_seen)
┃◈└───────────┈⊷
╰──────────────┈⊷
*Note:* Most commands are owner-only.`;

        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/3y5w8z.jpg" },
                caption: privacyMenu,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );
    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= BLOCKLIST ================= //
cmd({
    pattern: "blocklist",
    desc: "View blocked users",
    category: "privacy",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("🚫 You are not the owner!");

    try {
        const blocked = await conn.fetchBlocklist();
        if (!blocked.length) return reply("📋 No users are blocked.");

        const list = blocked.map(u => `🚧 ${u.split("@")[0]}`).join("\n");
        reply(`📋 Blocked Users (${blocked.length}):\n\n${list}`);
    } catch (e) {
        console.error(e);
        reply(`❌ Failed to fetch block list: ${e.message}`);
    }
});

// ================= GET BIO ================= //
cmd({
    pattern: "getbio",
    desc: "Fetch user bio",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { args, reply }) => {
    try {
        const jid = args[0] || mek.key.remoteJid;
        const about = await conn.fetchStatus?.(jid);
        reply(about?.status ? `📝 Bio:\n\n${about.status}` : "⚠️ No bio found.");
    } catch (e) {
        reply("⚠️ Error fetching bio.");
    }
});

// ================= PROFILE PIC PRIVACY ================= //
cmd({
    pattern: "setppall",
    desc: "Set profile pic privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    const value = args[0] || "all";
    const valid = ["all", "contacts", "contact_blacklist", "none"];
    if (!valid.includes(value)) return reply("⚠️ Invalid option.");

    try {
        await conn.updateProfilePicturePrivacy(value);
        reply(`✅ Profile picture privacy set to: ${value}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= ONLINE PRIVACY ================= //
cmd({
    pattern: "setonline",
    desc: "Set online privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    const value = args[0] || "all";
    const valid = ["all", "match_last_seen"];
    if (!valid.includes(value)) return reply("⚠️ Invalid option.");

    try {
        await conn.updateOnlinePrivacy(value);
        reply(`✅ Online privacy set to: ${value}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= SET BOT PROFILE PIC ================= //
cmd({
    pattern: "setpp",
    desc: "Change bot profile picture",
    category: "privacy",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { isOwner, quoted, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    if (!quoted?.message?.imageMessage) return reply("⚠️ Reply to an image.");

    try {
        const stream = await downloadContentFromMessage(quoted.message.imageMessage, "image");
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        await conn.updateProfilePicture(conn.user.id, { url: `file://${mediaPath}` });
        reply("✅ Profile picture updated.");
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= UPDATE BOT NAME ================= //
cmd({
    pattern: "setmyname",
    desc: "Set bot display name",
    category: "privacy",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    const name = args.join(" ");
    if (!name) return reply("⚠️ Provide a name.");

    try {
        await conn.updateProfileName(name);
        reply(`✅ Display name updated: ${name}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= UPDATE BIO ================= //
cmd({
    pattern: "updatebio",
    desc: "Set bot bio",
    category: "privacy",
    react: "✍️",
    filename: __filename
}, async (conn, mek, m, { isOwner, q, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    if (!q) return reply("⚠️ Provide bio text.");
    if (q.length > 139) return reply("⚠️ Bio too long (max 139 chars).");

    try {
        await conn.updateProfileStatus(q);
        reply("✅ Bio updated.");
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= GROUP ADD PRIVACY ================= //
cmd({
    pattern: "groupsprivacy",
    desc: "Set who can add bot to groups",
    category: "privacy",
    react: "👥",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    const value = args[0] || "all";
    const valid = ["all", "contacts", "contact_blacklist", "none"];
    if (!valid.includes(value)) return reply("⚠️ Invalid option.");

    try {
        await conn.updateGroupsAddPrivacy(value);
        reply(`✅ Group add privacy set to: ${value}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= GET PRIVACY SETTINGS ================= //
cmd({
    pattern: "getprivacy",
    desc: "View current privacy settings",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("🚫 Owner only.");
    try {
        const settings = await conn.fetchPrivacySettings?.(true);
        if (!settings) return reply("⚠️ Could not fetch privacy settings.");

        const info = `
╭───「 𝙿𝚁𝙸𝚅𝙰𝙲𝚈 」───◆
│ ∘ Read Receipts: ${settings.readreceipts}
│ ∘ Profile Picture: ${settings.profile}
│ ∘ Status: ${settings.status}
│ ∘ Online: ${settings.online}
│ ∘ Last Seen: ${settings.last}
│ ∘ Group Add: ${settings.groupadd}
│ ∘ Call Privacy: ${settings.calladd}
╰────────────────────`;
        reply(info);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// ================= GET PROFILE PIC ================= //
cmd({
    pattern: "getpp",
    desc: "Get profile picture of tagged/replied user",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { quoted, sender, reply }) => {
    try {
        const target = quoted ? quoted.sender : sender;
        if (!target) return reply("⚠️ Reply to a user to fetch profile picture.");

        const pic = await conn.profilePictureUrl(target, "image").catch(() => null);
        if (!pic) return reply("⚠️ No profile picture found.");

        await conn.sendMessage(m.chat, {
            image: { url: pic },
            caption: "🖼️ User Profile Picture"
        });
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});