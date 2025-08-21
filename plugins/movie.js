const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "movie",
    desc: "Fetch detailed information about a movie.",
    category: "utility",
    react: "🎬",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, args }) => {
    try {
        // Extract movie name
        const movieName = args.length > 0 ? args.join(' ') : m.text.replace(/^[\.\#\$\!]?movie\s?/i, '').trim();
        
        if (!movieName) {
            return reply("📽️ Please provide the name of the movie.\nExample: .movie Iron Man");
        }

        const apiUrl = `https://apis.davidcyriltech.my.id/imdb?query=${encodeURIComponent(movieName)}`;
        const response = await axios.get(apiUrl);

        if (!response.data.status || !response.data.movie) {
            return reply("🚫 Movie not found. Please check the name and try again.");
        }

        const movie = response.data.movie;

        // Fancy straight-line styled caption
        const dec = `
╔═━━───── • ─────━━═╗
      🎬  𝙈𝙊𝙑𝙄𝙀 𝙄𝙉𝙁𝙊
╚═━━───── • ─────━━═╝

🎬 *Title*     : ${movie.title} (${movie.year})
📊 *IMDb*      : ${movie.imdbRating || 'N/A'}
🍅 *Rotten*    : ${movie.ratings.find(r => r.source === 'Rotten Tomatoes')?.value || 'N/A'}
💰 *Box Office*: ${movie.boxoffice || 'N/A'}

📅 *Released*  : ${new Date(movie.released).toLocaleDateString()}
⏳ *Runtime*   : ${movie.runtime || 'N/A'}
🎭 *Genre*     : ${movie.genres || 'N/A'}

📝 *Plot*:  
${movie.plot || 'N/A'}

🎥 *Director*  : ${movie.director || 'N/A'}
✍️ *Writer*    : ${movie.writer || 'N/A'}
🌟 *Actors*    : ${movie.actors || 'N/A'}

🌍 *Country*   : ${movie.country || 'N/A'}
🗣️ *Language* : ${movie.languages || 'N/A'}
🏆 *Awards*   : ${movie.awards || 'None'}

🔗 *IMDb Link*: ${movie.imdbUrl}
════════════════════════════
⚡ Powered by Nerax System
`;

        // Send message with poster
        await conn.sendMessage(
            from,
            {
                image: { 
                    url: movie.poster && movie.poster !== 'N/A' 
                        ? movie.poster 
                        : 'https://files.catbox.moe/3y5w8z.jpg'
                },
                caption: dec,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363388320701164@newsletter',
                        newsletterName: 'Nerax System',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error('Movie command error:', e);
        reply(`❌ Error: ${e.message}`);
    }
});