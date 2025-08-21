const { cmd } = require("../command");
const { fetchEmix } = require("../lib/emix-utils");
const { getBuffer } = require("../lib/functions");
const { Sticker, StickerTypes } = require("wa-sticker-formatter");

cmd({
    pattern: "emix",
    alias: ["emojiMix", "mixemoji", "stickerMix"],
    desc: "✨ Create a cool sticker by mixing 2 emojis!",
    category: "fun",
    react: "🎭",
    use: ".emix 😂,🔥",
    filename: __filename,
}, async (conn, mek, m, { args, q, reply }) => {
    try {
        // Validation
        if (!q.includes(",")) {
            return reply("❌ *Usage:* `.emix 😂,🔥`\n\n👉 Send *two emojis* separated by a comma.");
        }

        let [emoji1, emoji2] = q.split(",").map(e => e.trim());

        if (!emoji1 || !emoji2) {
            return reply("⚠️ Please provide two valid emojis, separated by a comma!");
        }

        // Fetch emoji mix
        let imageUrl = await fetchEmix(emoji1, emoji2);

        if (!imageUrl) {
            return reply("😕 Could not generate the emoji mix... Try a different combo!");
        }

        // Convert to sticker
        let buffer = await getBuffer(imageUrl);
        let sticker = new Sticker(buffer, {
            pack: "🌈 EmoMix Pack",
            author: "✨ PopKid ✨",
            type: StickerTypes.FULL,
            categories: ["🔥", "😍", "🎉", "🌟"],
            quality: 85,
            background: "transparent",
        });

        const stickerBuffer = await sticker.toBuffer();

        // Send sticker
        await conn.sendMessage(mek.chat, { sticker: stickerBuffer }, { quoted: mek });

        // React success
        await conn.sendMessage(mek.chat, {
            react: { text: "✅", key: mek.key }
        });

    } catch (e) {
        console.error("Error in .emix command:", e.message);
        reply(`⚠️ Oops! Couldn’t create the emoji mix:\n\n${e.message}`);
    }
});