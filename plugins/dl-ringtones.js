const axios = require("axios");
const { cmd, commands } = require("../command");

cmd({
    pattern: "ringtone",
    alias: ["ringtones", "ring"],
    desc: "🎵 Search & download a lovely ringtone",
    react: "🎶",
    category: "fun",
    filename: __filename,
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🎶 Please provide a search query, love.\n\n💡 Example: `.ringtone Suna`");
        }

        await reply(`
┌─「 💖 𝗟𝗼𝘃𝗲𝗹𝘆 𝗥𝗶𝗻𝗴𝘁𝗼𝗻𝗲 𝗙𝗶𝗻𝗱𝗲𝗿 🎵 」
│ 🔍 Searching for: *${query}*
│ 💌 Please wait, sweetheart...
└─────────────────────────────
`);

        const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`);

        if (!data.status || !data.result || data.result.length === 0) {
            return reply("💔 No ringtones found for your query, love.\nTry another keyword 💡");
        }

        const randomRingtone = data.result[Math.floor(Math.random() * data.result.length)];

        await conn.sendMessage(
            from,
            {
                audio: { url: randomRingtone.dl_link },
                mimetype: "audio/mpeg",
                fileName: `${randomRingtone.title}.mp3`,
                caption: `
🎶 *Here’s your lovely ringtone, darling!*  
💖 *Title:* ${randomRingtone.title}  
✨ Wrapped with love & music ✨  
> 💕 Powered by popkid
`
            },
            { quoted: m }
        );

        await reply("✅ Done, sweetheart! Your ringtone is ready 🎵💖");

    } catch (error) {
        console.error("Error in ringtone command:", error);
        reply("⚠️ Sorry love, something went wrong while fetching your ringtone. Please try again later 💌");
    }
});