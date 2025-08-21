const axios = require("axios");
const cheerio = require('cheerio');
const { cmd, commands } = require('../command');
const config = require('../config');
const { fetchJson } = require('../lib/functions');

const api = `https://nethu-api-ashy.vercel.app`;

cmd({
  pattern: "facebook",
  react: "🎥",
  alias: ["fbb", "fbvideo", "fb"],
  desc: "💞 Download romantic videos from Facebook with style",
  category: "download",
  use: ".facebook <facebook_url>",
  filename: __filename
},
async (conn, mek, m, { from, prefix, q, reply }) => {
  try {
    if (!q) return reply("💔 Please give me a Facebook video link, my love.\n\n💡 Example: `.facebook https://fb.watch/...`");

    const fb = await fetchJson(`${api}/download/fbdown?url=${encodeURIComponent(q)}`);
  
    if (!fb.result || (!fb.result.sd && !fb.result.hd)) {
      return reply("😢 Sorry, I couldn’t find that video.\nTry again with a valid link, sweetheart. 💌");
    }

    let caption = `
┌─「 ❤️ 𝗙𝗮𝗰𝗲𝗯𝗼𝗼𝗸 𝗩𝗶𝗱𝗲𝗼 𝗟𝗼𝘃𝗲 𝗦𝗵𝗮𝗿𝗲 」
│ 📝 *Title*: Facebook Video
│ 🔗 *URL*: ${q}
│ 💕 *Requested By*: *Popkid Nerax*
└─────────────────────────────
`;

    if (fb.result.thumb) {
      await conn.sendMessage(from, {
        image: { url: fb.result.thumb },
        caption: caption
      }, { quoted: mek });
    }

    if (fb.result.sd) {
      await conn.sendMessage(from, {
        video: { url: fb.result.sd },
        mimetype: "video/mp4",
        caption: "💖 *Here’s your SD Quality Video, Love* 💖"
      }, { quoted: mek });
    }

    if (fb.result.hd) {
      await conn.sendMessage(from, {
        video: { url: fb.result.hd },
        mimetype: "video/mp4",
        caption: "💝 *Here’s your HD Quality Video, Darling* 💝"
      }, { quoted: mek });
    }

  } catch (err) {
    console.error(err);
    reply("💔 Oops, something went wrong while fetching your video.\nPlease try again later, love. 💌");
  }
});