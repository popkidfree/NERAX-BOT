const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd, commands } = require('../command');

// ╭━━━〔 ✨ LOVISH DOWNLOADER ZONE ✨ 〕━━━⊷
// │ 🌄 Stylish | 🎉 Modern | 💖 Lovish
// ╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━⊷

// Instagram Downloader
cmd({
  pattern: "ig2",
  alias: ["insta2", "Instagram2"],
  desc: "🌸 Download Instagram videos in style",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) {
      return reply("💔 Please provide a valid Instagram link 🌸✨");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const response = await axios.get(`https://api.davidcyriltech.my.id/instagram?url=${q}`);
    const data = response.data;

    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Couldn’t fetch the Instagram video 💌 Check your link and try again!");
    }

    await conn.sendMessage(from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "✅ 🎥 *Instagram Video Wrapped with Love!* ❤️✨"
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("💔 Oops! Something went wrong while fetching your IG video 🌸");
  }
});

// Twitter Downloader
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "🐦 Download Twitter videos in HD/SD",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return reply("❌ Please drop a valid Twitter URL 💫");
    }

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${q}`);
    const data = response.data;

    if (!data?.status || !data?.result) {
      return reply("⚠️ Couldn’t fetch Twitter media 💔 Check the link!");
    }

    const { desc, thumb, video_sd, video_hd } = data.result;

    const caption = `
╭━━━〔 🐦 Twitter Downloader 🎉 〕━━━⊷
│ 📝 *Description:* ${desc || "No description available"}
╰━━━━━━━━━━━━━━━━━━━━━━━⊷

✨ Choose your vibe:
1️⃣ SD Quality 🎬
2️⃣ HD Quality 🌄
3️⃣ Audio 🎵
4️⃣ Document 📂
5️⃣ Voice 🎤
`;

    const sentMsg = await conn.sendMessage(from, { image: { url: thumb }, caption }, { quoted: m });
    const messageID = sentMsg.key.id;

    conn.ev.on("messages.upsert", async (msgData) => {
      const receivedMsg = msgData.messages[0];
      if (!receivedMsg.message) return;

      const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
      const senderID = receivedMsg.key.remoteJid;
      const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

      if (isReplyToBot) {
        await conn.sendMessage(senderID, { react: { text: '⬇️', key: receivedMsg.key } });

        switch (receivedText) {
          case "1":
            await conn.sendMessage(senderID, { video: { url: video_sd }, caption: "📥 *SD Quality Unlocked!* 🌸" }, { quoted: receivedMsg });
            break;
          case "2":
            await conn.sendMessage(senderID, { video: { url: video_hd }, caption: "📥 *HD Quality Sparkles!* 🌄✨" }, { quoted: receivedMsg });
            break;
          case "3":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mpeg" }, { quoted: receivedMsg });
            break;
          case "4":
            await conn.sendMessage(senderID, { document: { url: video_sd }, mimetype: "audio/mpeg", fileName: "Twitter_Audio.mp3", caption: "📥 *Saved as Document!* 💌" }, { quoted: receivedMsg });
            break;
          case "5":
            await conn.sendMessage(senderID, { audio: { url: video_sd }, mimetype: "audio/mp4", ptt: true }, { quoted: receivedMsg });
            break;
          default:
            reply("❌ Invalid choice, darling 🌸 Please reply with 1-5.");
        }
      }
    });

  } catch (error) {
    console.error("Error:", error);
    reply("💔 Something broke while fetching Twitter video 🌄✨");
  }
});

// MediaFire Downloader
cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "📂 Download MediaFire files easily",
  react: "📦",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a MediaFire link 🌟");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const response = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${q}`);
    const data = response.data;

    if (!data?.status || !data?.result?.dl_link) {
      return reply("⚠️ Couldn’t grab that file 💌 Link might be private!");
    }

    const { dl_link, fileName, fileType } = data.result;

    const caption = `
╭━━━〔 📂 MediaFire Downloader 〕━━━⊷
│ 🏷 *File:* ${fileName}
│ 📦 *Type:* ${fileType}
╰━━━━━━━━━━━━━━━━━━━━━━━⊷

📥 File is coming with love ❤️✨`;

    await conn.sendMessage(from, {
      document: { url: dl_link },
      mimetype: fileType || "application/octet-stream",
      fileName: fileName || "mediafire_download",
      caption
    }, { quoted: m });

  } catch (error) {
    console.error("Error:", error);
    reply("💔 Failed to fetch MediaFire file 🌸 Try again later.");
  }
});

// APK Downloader
cmd({
  pattern: "apk",
  desc: "📱 Download APKs from Aptoide",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide an app name 💫");

    await conn.sendMessage(from, { react: { text: "⏳", key: m.key } });

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${q}/limit=1`;
    const response = await axios.get(apiUrl);
    const app = response.data?.datalist?.list[0];

    if (!app) return reply("⚠️ No app found with that name 💌");

    const sizeMB = (app.size / 1048576).toFixed(2);

    const caption = `
╭━━━〔 📱 APK Downloader 🎉 〕━━━⊷
│ 📦 *Name:* ${app.name}
│ 🏋 *Size:* ${sizeMB} MB
│ 📦 *Package:* ${app.package}
│ 📅 *Updated:* ${app.updated}
│ 👨‍💻 *Developer:* ${app.developer.name}
╰━━━━━━━━━━━━━━━━━━━━━━━⊷

✨ Wrapped with ❤️ Powered by popkid`;

    await conn.sendMessage(from, {
      document: { url: app.file.path_alt },
      fileName: `${app.name}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("💔 Something went wrong fetching your APK 🌸");
  }
});

// Google Drive Downloader
cmd({
  pattern: "gdrive",
  desc: "🌐 Download Google Drive files",
  react: "☁️",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a Google Drive link 💫");

    await conn.sendMessage(from, { react: { text: "⬇️", key: m.key } });

    const response = await axios.get(`https://api.fgmods.xyz/api/downloader/gdrive?url=${q}&apikey=mnp3grlZ`);
    const result = response.data?.result;

    if (!result?.downloadUrl) return reply("⚠️ Couldn’t fetch GDrive file 💌");

    await conn.sendMessage(from, {
      document: { url: result.downloadUrl },
      mimetype: result.mimetype,
      fileName: result.fileName,
      caption: "✅ *Google Drive File Delivered with Love!* 🌄✨"
    }, { quoted: m });

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("Error:", error);
    reply("💔 Something went wrong with GDrive downloader 🎉");
  }
});