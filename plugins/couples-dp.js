const { cmd, commands } = require('../command');
const axios = require('axios');

cmd({
  pattern: "couplepp",
  alias: ["couple", "cpp"],
  react: "💑",
  desc: "💞 Get a matching male & female couple profile picture",
  category: "image",
  use: ".couplepp",
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
  try {
    reply(`
┌─「 💞 𝗖𝗼𝘂𝗽𝗹𝗲 𝗣𝗣 𝗙𝗶𝗻𝗱𝗲𝗿 」
│ ⏳ Fetching a cute couple picture set...
└─────────────────────────────
`);

    const response = await axios.get("https://api.davidcyriltech.my.id/couplepp");

    if (!response.data || !response.data.success) {
      return reply("❌ Sorry, failed to fetch couple profile pictures.\n\n💡 Please try again later.");
    }

    const malePp = response.data.male;
    const femalePp = response.data.female;

    if (malePp) {
      await conn.sendMessage(from, {
        image: { url: malePp },
        caption: `
👨 *Male Profile Picture*
━━━━━━━━━━━━━━━━━━━━━━━
💡 Save this and pair it with the female one for a perfect DP combo!
`
      }, { quoted: m });
    }

    if (femalePp) {
      await conn.sendMessage(from, {
        image: { url: femalePp },
        caption: `
👩 *Female Profile Picture*
━━━━━━━━━━━━━━━━━━━━━━━
💖 Now you’ve got the matching couple display pictures!
`
      }, { quoted: m });
    }

    await reply("✨ *Here’s your couple DP set!* ✨");

  } catch (error) {
    console.error(error);
    reply("⚠️ An error occurred while fetching the couple profile pictures. Please try again later.");
  }
});