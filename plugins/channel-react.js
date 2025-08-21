const config = require('../config');
const { cmd } = require('../command');

/**
 * 🔤 Channel Reaction Command
 * ──────────────────────────────
 * Converts text into stylized characters & reacts
 * to WhatsApp Channel messages with the generated emoji text.
 */

const stylizedChars = {
  a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
  h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
  o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
  v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
  '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
  '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
  pattern: "chr",
  alias: ["creact"],
  react: "🔤",
  desc: "React to channel messages with stylized text",
  category: "owner",
  use: ".chr <channel-link> <text>",
  filename: __filename
}, async (conn, mek, m, ctx) => {
  const { from, q, command, reply, isCreator } = ctx;

  try {
    /* ---------------------- 🔹 Permission Check ---------------------- */
    if (!isCreator) {
      return reply("❌ *This command is only for the bot owner.*");
    }

    /* ---------------------- 🔹 Input Validation ---------------------- */
    if (!q) {
      return reply(
        "❎ *Missing arguments!*\n\n" +
        "💡 Usage Example:\n" +
        "```" + `${command} https://whatsapp.com/channel/1234567890 Hello` + "```"
      );
    }

    const [link, ...textParts] = q.trim().split(" ");
    if (!link.includes("whatsapp.com/channel/")) {
      return reply("⚠️ *Invalid channel link format!*");
    }

    const inputText = textParts.join(" ").toLowerCase();
    if (!inputText) {
      return reply("⚠️ Please provide text to convert into stylized form.");
    }

    /* ---------------------- 🔹 Stylize Text -------------------------- */
    const emoji = inputText
      .split("")
      .map(char => (char === " " ? "―" : stylizedChars[char] || char))
      .join("");

    /* ---------------------- 🔹 Extract IDs ---------------------------- */
    const channelId = link.split("/")[4];
    const messageId = link.split("/")[5];
    if (!channelId || !messageId) {
      return reply("❌ Invalid link → missing channel/message ID.");
    }

    /* ---------------------- 🔹 Fetch Channel ------------------------- */
    const channelMeta = await conn.newsletterMetadata("invite", channelId);

    /* ---------------------- 🔹 React to Message ---------------------- */
    await conn.newsletterReactMessage(channelMeta.id, messageId, emoji);

    /* ---------------------- 🔹 Success Response ---------------------- */
    return reply(
      `┏━━━〔 *NERAX-BOT* 〕━━━┓\n` +
      `┃ ✅ *Reaction Sent Successfully!*\n` +
      `┃ 📡 *Channel:* ${channelMeta.name}\n` +
      `┃ 💠 *Reaction:* ${emoji}\n` +
      `┗━━━━━━━━━━━━━━━━━━━━━┛\n\n` +
      `> *© Powered by POPKID ♡*`
    );

  } catch (e) {
    console.error("❌ Error in .chr command:", e);
    reply(`⚠️ Error: ${e.message || "Failed to send reaction"}`);
  }
});