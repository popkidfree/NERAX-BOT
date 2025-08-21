const { cmd } = require('../command');
const config = require("../config");

/**
 * 🚫 Anti-Link System
 * Blocks unwanted links in groups & auto-kicks violators.
 */

// Organized Link Patterns
const linkPatterns = [
  // WhatsApp Links
  /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
  /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,

  // Telegram Links
  /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,

  // YouTube Links
  /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
  /https?:\/\/youtu\.be\/\S+/gi,

  // Facebook Links
  /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
  /https?:\/\/fb\.me\/\S+/gi,

  // Instagram, Twitter, TikTok
  /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,

  // Other Social Platforms
  /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
  /https?:\/\/ngl\/\S+/gi,
  /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
  /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
  /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

// 🚀 Command Trigger
cmd({ on: "body" }, async (conn, m, store, ctx) => {
  const { from, body, sender, isGroup, isAdmins, isBotAdmins, reply } = ctx;

  try {
    // Skip if not group, sender is admin, or bot isn't admin
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // Check for links
    const hasLink = linkPatterns.some(pattern => pattern.test(body));

    if (hasLink && config.ANTI_LINK_KICK === 'true') {
      // Delete the message
      await conn.sendMessage(from, { delete: m.key }, { quoted: m });

      // Notify & tag offender
      await conn.sendMessage(
        from,
        {
          text: `⚠️ *Anti-Link Protection*\n\n🚫 Links are not allowed here!\n@${sender.split('@')[0]} has been *removed* from the group.`,
          mentions: [sender]
        },
        { quoted: m }
      );

      // Kick offender
      await conn.groupParticipantsUpdate(from, [sender], "remove");
    }
  } catch (error) {
    console.error("❌ Anti-Link Error:", error);
    reply("⚠️ An error occurred while checking the message.");
  }
});