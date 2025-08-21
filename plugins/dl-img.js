const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "✨ Search and download lovely Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🌸 Please provide a search query, love.\n\n💡 Example: `.img cute cats` 🐾");
        }

        await reply(`
┌─「 🦋 𝗟𝗼𝘃𝗲𝗹𝘆 𝗜𝗺𝗮𝗴𝗲 𝗦𝗲𝗮𝗿𝗰𝗵 ✨」
│ 🔍 Searching for: *${query}*
│ 💌 Please wait, sweetheart...
└─────────────────────────────
`);

        const url = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const response = await axios.get(url);

        if (!response.data?.success || !response.data.results?.length) {
            return reply("💔 Sorry love, no images found.\nTry different keywords 💡");
        }

        const results = response.data.results;
        const selectedImages = results
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        for (const imageUrl of selectedImages) {
            await conn.sendMessage(
                from,
                { 
                    image: { url: imageUrl },
                    caption: `
🌸 *Result for:* _${query}_  
✨ Wrapped with love & beauty ✨  
> 💕 Powered by popkid
`
                },
                { quoted: mek }
            );
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await reply("✅ Done, sweetheart! Your lovely images are here 💖");

    } catch (error) {
        console.error("Image Search Error:", error);
        reply("⚠️ Sorry love, something went wrong while fetching your images. Please try again later 💌");
    }
});