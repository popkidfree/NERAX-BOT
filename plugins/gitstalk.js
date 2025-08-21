const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "githubstalk",
    alias: ["ghstalk", "gituser"],
    desc: "🌹 Fetch a detailed & stylish GitHub profile card",
    category: "menu",
    react: "💻",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const username = args[0];
        if (!username) {
            return reply("❌ *Please provide a GitHub username.*\nExample: `.githubstalk torvalds`");
        }

        const apiUrl = `https://api.github.com/users/${username}`;
        const { data } = await axios.get(apiUrl);

        // Fancy profile card
        const profileCard = `
╭─────────────◆
│ 💎✨ *GitHub Lovish Profile* ✨💎
│
│ 🌹 *Name*: ${data.name || "Unknown"}
│ 🏷️ *Username*: ${data.login}
│ 🔗 *Profile*: ${data.html_url}
│
│ 📝 *Bio*: ${data.bio || "Not available"}
│ 🏙️ *Location*: ${data.location || "Unknown"}
│
│ 📊 *Public Repos*: ${data.public_repos}
│ 🔭 *Public Gists*: ${data.public_gists}
│
│ 👥 *Followers*: ${data.followers}
│ 🤝 *Following*: ${data.following}
│
│ 📅 *Joined*: ${new Date(data.created_at).toDateString()}
│
╰─────────────◆
🌹 *Powered with Love by Popkid* 🌹
`;

        await conn.sendMessage(
            from,
            {
                image: { url: data.avatar_url },
                caption: profileCard,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error("GitHubStalk Error:", e);
        reply(`❌ Error: ${e.response ? e.response.data.message : e.message}`);
    }
});