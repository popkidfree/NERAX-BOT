const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pindl",
    alias: ["pinterestdl", "pin", "pins", "pindownload"],
    desc: "Download media from Pinterest",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
        if (args.length < 1) {
            return reply('📌 Please provide the Pinterest URL.\nExample: .pindl https://pin.it/example');
        }

        const pinterestUrl = args[0];
        const response = await axios.get(`https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`);

        if (!response.data.success) {
            return reply('🚫 Failed to fetch data from Pinterest. Try another link.');
        }

        const media = response.data.result.media;
        const description = response.data.result.description || 'No description available';
        const title = response.data.result.title || 'No title available';
        const videoUrl = media.find(item => item.type.includes('720p'))?.download_url || media[0].download_url;

        // Fancy styled caption
        const caption = `
╔═━━───── • ─────━━═╗
   📌  𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏 𝘿𝙇
╚═━━───── • ─────━━═╝

🎀 *Title*      : ${title}
🖼️ *Media Type*: ${media[0].type}
📝 *Desc*       : ${description}

═══════════════
⚡ Powered by popkid 
`;

        // Send media
        if (videoUrl) {
            await conn.sendMessage(from, { video: { url: videoUrl }, caption }, { quoted: mek });
        } else {
            const imageUrl = media.find(item => item.type === 'Thumbnail')?.download_url;
            await conn.sendMessage(from, { image: { url: imageUrl }, caption }, { quoted: mek });
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('⚠️ An error occurred while processing your request.');
    }
});