const { cmd } = require('../command');
const { ytsearch } = require('@dark-yasiya/yt-dl.js');

// ─── 🎥 YOUTUBE VIDEO DOWNLOAD ───
cmd({
    pattern: "mp4",
    alias: ["video"],
    react: "🎥",
    desc: "Download YouTube videos in MP4",
    category: "main",
    use: ".mp4 < YouTube URL or name >",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ Provide a *YouTube link* or *search query*");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("❌ No results found.");

        const video = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(video.url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data?.result?.download_url) return reply("❌ Failed to fetch download link.");

        const caption = `
╭━━━〔 🎥 *POPKID ┃ VIDEO DL* 〕━━━╮
┃ 🎬 Title: ${video.title}
┃ ⏳ Duration: ${video.timestamp}
┃ 👁 Views: ${video.views}
┃ 👤 Author: ${video.author.name}
┃ 🔗 Link: ${video.url}
╰━━━━━━━━━━━━━━━━━━━━━━╯
        `.trim();

        await conn.sendMessage(from, {
            video: { url: data.result.download_url },
            caption,
            mimetype: "video/mp4"
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("❌ Error: Unable to process your request.");
    }
});


// ─── 🎶 YOUTUBE SONG DOWNLOAD ───
cmd({
    pattern: "song",
    alias: ["play", "mp3"],
    react: "🎶",
    desc: "Download YouTube songs in MP3",
    category: "main",
    use: ".song < YouTube URL or name >",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("⚠️ Provide a *song name* or *YouTube link*");

        const yt = await ytsearch(q);
        if (!yt.results.length) return reply("❌ No results found.");

        const song = yt.results[0];
        const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(song.url)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (!data?.result?.downloadUrl) return reply("❌ Failed to fetch audio.");

        const caption = `
╭━━━〔 🎵 *POPKID ┃ SONG DL* 〕━━━╮
┃ 🎼 Title: ${song.title}
┃ 👤 Channel: ${song.author.name}
┃ ⏳ Duration: ${song.timestamp}
┃ 🔗 Link: ${song.url}
╰━━━━━━━━━━━━━━━━━━━━━━╯
        `.trim();

        await conn.sendMessage(from, {
            audio: { url: data.result.downloadUrl },
            mimetype: "audio/mpeg",
            fileName: `${song.title}.mp3`,
            contextInfo: {
                externalAdReply: {
                    title: song.title.length > 25 ? `${song.title.slice(0, 22)}...` : song.title,
                    body: "🎶 POPKID ┃ MD",
                    mediaType: 1,
                    thumbnailUrl: song.thumbnail.replace("default.jpg", "hqdefault.jpg"),
                    sourceUrl: "https://whatsapp.com/channel/0029Vb2OcviBFLgPzVjWhE0n",
                    renderLargerThumbnail: true,
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error(error);
        reply("❌ Error: Something went wrong.");
    }
});