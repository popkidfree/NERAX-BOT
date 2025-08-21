const { cmd } = require("../command");

/**
 * 📡 WhatsApp Channel Info Command
 * Fetches metadata of a channel using its invite link.
 */

cmd({
  pattern: "cid",
  alias: ["newsletter", "id"],
  react: "📡",
  desc: "Get WhatsApp Channel info from link",
  category: "whatsapp",
  filename: __filename
}, async (conn, mek, m, ctx) => {
  const { from, q, reply } = ctx;

  try {
    // 🔹 Input Validation
    if (!q) {
      return reply(
        "❎ *Please provide a WhatsApp Channel link.*\n\n" +
        "💡 Example:\n`.cid https://whatsapp.com/channel/123456789`"
      );
    }

    // 🔹 Extract Channel ID
    const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) {
      return reply(
        "⚠️ *Invalid channel link format.*\n\n" +
        "✅ Correct format:\nhttps://whatsapp.com/channel/xxxxxxxxx"
      );
    }

    const inviteId = match[1];

    // 🔹 Fetch Metadata
    let metadata;
    try {
      metadata = await conn.newsletterMetadata("invite", inviteId);
    } catch {
      return reply("❌ Failed to fetch channel metadata.\n\nMake sure the link is correct & accessible.");
    }

    if (!metadata || !metadata.id) {
      return reply("❌ Channel not found or inaccessible.");
    }

    // 🔹 Format Info Text
    const infoText =
      `*— 乂 WhatsApp Channel Info —*\n\n` +
      `🆔 *ID:* ${metadata.id}\n` +
      `📌 *Name:* ${metadata.name || "N/A"}\n` +
      `👥 *Followers:* ${metadata.subscribers?.toLocaleString() || "N/A"}\n` +
      `📅 *Created on:* ${
        metadata.creation_time
          ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID")
          : "Unknown"
      }`;

    // 🔹 Send with Preview if available
    if (metadata.preview) {
      await conn.sendMessage(
        from,
        {
          image: { url: `https://pps.whatsapp.net${metadata.preview}` },
          caption: infoText
        },
        { quoted: m }
      );
    } else {
      await reply(infoText);
    }

  } catch (error) {
    console.error("❌ Error in .cid plugin:", error);
    reply("⚠️ An unexpected error occurred. Please try again.");
  }
});