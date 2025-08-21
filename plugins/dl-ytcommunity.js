const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "🎥 Download YouTube community posts with love",
    category: "downloader",
    react: "💖",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) {
            return reply("💌 Please provide a YouTube community post link, love.\n\n💡 Example: `.ytpost https://youtube.com/post/...`");
        }

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await react("❌");
            return reply("💔 Failed to fetch that post, sweetheart.\nPlease check the link and try again 💌");
        }

        const post = data.data;
        let caption = `
┌─「 ❤️ 𝗬𝗼𝘂𝗧𝘂𝗯𝗲 𝗟𝗼𝘃𝗲𝗹𝘆 𝗣𝗼𝘀𝘁 🎥 」
│ 📢 *Community Post*
│ 💬 *Content*: ${post.content || "— No text available —"}
└─────────────────────────────

✨ Wrapped with love — Powered by popkid ✨
`;

        if (post.images && post.images.length > 0) {
            for (const img of post.images) {
                await conn.sendMessage(
                    from, 
                    { image: { url: img }, caption }, 
                    { quoted: mek }
                );
                caption = ""; // caption only on first image
            }
        } else {
            await conn.sendMessage(from, { text: caption }, { quoted: mek });
        }

        await react("✅");
        await reply("✅ Done, sweetheart! Your YouTube post is ready ❤️✨");

    } catch (e) {
        console.error("Error in ytpost command:", e);
        await react("❌");
        reply("⚠️ Sorry love, something went wrong while fetching the YouTube post 💌");
    }
});