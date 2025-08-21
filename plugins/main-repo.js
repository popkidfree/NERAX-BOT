const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const config = require('../config');    
const { cmd } = require('../command');

cmd({
    pattern: "repo",
    alias: ["sc", "script", "info"],
    desc: "Show futuristic GitHub repository info ⚡",
    react: "🚀",
    category: "info",
    filename: __filename,
},
async (conn, mek, m, { from, reply }) => {
    const githubRepoURL = 'https://github.com/mrpopkid/NERAX-BOT';

    try {
        const [, username, repoName] = githubRepoURL.match(/github\.com\/([^/]+)\/([^/]+)/);

        const response = await fetch(`https://api.github.com/repos/${username}/${repoName}`);
        if (!response.ok) throw new Error(`GitHub API failed: ${response.status}`);

        const repoData = await response.json();

        // 🌌 Futuristic Tech Console Style
        const fancyPanel = `
╭━━━〔 *💠NERAX BOT* 〕━━━◉
│ 🛰️ *Bot Name:* ${repoData.name}
│ 👨‍💻 *Owner:* ${repoData.owner.login}
│ ⭐ *Stars:* ${repoData.stargazers_count}
│ 🍴 *Forks:* ${repoData.forks_count}
│ 🔗 *Repo:* ${repoData.html_url}
│
│ 📡 *Description:* 
│   ${repoData.description || 'No description available'}
├━━━━━━━━━━━━━━━━━━━━◉
│ ⚡ *System:* ${config.BOT_NAME} v4.0
│ 🔐 *Powered By:* popkid
╰━━━━━━━━━━━━━━━━━━━━◉
> 🛠️ Support Development → ⭐ & 🍴 Repo`;

        // Cyber Poster with caption
        await conn.sendMessage(from, {
            image: { url: `https://i.ibb.co/bjPrbF84/3174.jpg` },
            caption: fancyPanel,
            contextInfo: { 
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363388320701164@newsletter',
                    newsletterName: 'popkid',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

        // Tech Sound Effect (AI Beep/Welcome)
        const audioPath = path.join(__dirname, '../assets/menu.m4a');
        await conn.sendMessage(from, {
            audio: fs.readFileSync(audioPath),
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error("Repo Error:", error);
        reply("❌ [SYSTEM FAILURE] Unable to fetch repository info.");
    }
});