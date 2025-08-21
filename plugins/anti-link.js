const { cmd } = require('../command');
const config = require("../config");

cmd({
  'on': "body"
}, async (conn, m, store, {
  from,
  body,
  sender,
  isGroup,
  isAdmins,
  isBotAdmins,
  reply
}) => {
  try {
    if (!global.warnings) global.warnings = {};

    // Skip if not in group / user is admin / bot not admin
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // Forbidden link patterns
    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      /https?:\/\/(?:api\.whatsapp\.com|wa\.me)\/\S+/gi,
      /wa\.me\/\S+/gi,
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
      /https?:\/\/(?:whatsapp\.com|channel\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
      /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
    ];

    const containsLink = linkPatterns.some(pattern => pattern.test(body));

    if (containsLink && config.ANTI_LINK === 'true') {
      console.log(`🔗 Link detected from ${sender}: ${body}`);

      try {
        await conn.sendMessage(from, { delete: m.key });
        console.log(`🗑️ Deleted message: ${m.key.id}`);
      } catch (error) {
        console.error("❌ Failed to delete message:", error);
      }

      global.warnings[sender] = (global.warnings[sender] || 0) + 1;
      const warningCount = global.warnings[sender];

      if (warningCount < 4) {
        await conn.sendMessage(from, {
          text: `⚠️ *ANTI-LINK WARNING*\n\n` +
                `╭─────────────────╮\n` +
                `│ 👤 User   : @${sender.split('@')[0]}\n` +
                `│ 🔢 Count  : ${warningCount}/3\n` +
                `│ 📌 Reason : Link Detected\n` +
                `│ ⚖️ Action : Warning\n` +
                `╰─────────────────╯\n\n` +
                `⛔ Next violation = removal.`,
          mentions: [sender]
        });
      } else {
        await conn.sendMessage(from, {
          text: `🚨 *USER REMOVED* 🚨\n\n` +
                `👤 @${sender.split('@')[0]}\n` +
                `❌ Exceeded 3/3 warnings.\n` +
                `➡️ Removed from group.`,
          mentions: [sender]
        });
        await conn.groupParticipantsUpdate(from, [sender], "remove");
        delete global.warnings[sender];
      }
    }
  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ Error while processing anti-link system.");
  }
});