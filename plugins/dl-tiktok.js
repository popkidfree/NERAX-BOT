const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "🎵 Download TikTok videos without watermark",
    category: "downloader",
    react: "💞",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("💌 Please provide a TikTok video link, love.\n\n💡 Example: `.tiktok https://www.tiktok.com/...`");
        if (!q.includes("tiktok.com")) return reply("💔 Invalid TikTok link, sweetheart. Please try again with a valid one.");

        await reply(`
┌─「 💖 𝗧𝗶𝗸𝗧𝗼𝗸 𝗟𝗼𝘃𝗲𝗹𝘆 𝗗𝗼𝘄𝗻𝗹𝗼𝗮𝗱𝗲𝗿 🎵 」
│ ⏳ Downloading your video, darling...
│ 💌 Please wait patiently 💕
└─────────────────────────────
`);

        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${q}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            return reply("💔 Sorry love, I couldn’t fetch that TikTok video. Please try again later 💌");
        }

        const { title, like, comment, share, author, meta } = data.data;
        const videoUrl = meta.media.find(v => v.type === "video").org;

        const caption = `
🎶 *TikTok Video Downloaded with Love* 🎶  

👤 *User*: ${author.nickname} (@${author.username})  
📖 *Title*: ${title}  
👍 *Likes*: ${like}  
💬 *Comments*: ${comment}  
🔁 *Shares*: ${share}  

✨ Wrapped with love — Powered by popkid ✨
`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await reply("✅ Done, sweetheart! Your TikTok video is here 🎵💖");

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply("⚠️ Sorry love, something went wrong while fetching your TikTok video. Please try again later 💌");
    }
});