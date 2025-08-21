const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "countryinfo",
    alias: ["cinfo", "country", "cinfo2"],
    desc: "Get information about a country",
    category: "info",
    react: "🌍",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, react }) => {
    try {
        if (!q) return reply("❌ Please provide a country name.\nExample: `.countryinfo Pakistan`");

        const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data.status || !data.data) {
            await react("❌");
            return reply(`⚠️ No information found for *${q}*.\nPlease check the spelling and try again.`);
        }

        const info = data.data;
        let neighborsText = info.neighbors.length > 0
            ? info.neighbors.map(n => `🌍 ${n.name}`).join(", ")
            : "No neighboring countries found.";

        // Fancy Boxed Message
        let text = `
╔════════════════════╗
   🌍 *COUNTRY INFO* 🌍
╚════════════════════╝

╔═✦ *General Information* ✦═╗
┃ 🏛 *Capital*     : ${info.capital}
┃ 📍 *Continent*   : ${info.continent.name} ${info.continent.emoji}
┃ 📞 *Phone Code*  : +${info.phoneCode}
┃ 🚗 *Driving Side*: ${info.drivingSide}
╚═══════════════════════════╝

╔═✦ *Geography* ✦═╗
┃ 📏 *Area* : ${info.area.squareKilometers} km²
┃            (${info.area.squareMiles} mi²)
╚════════════════╝

╔═✦ *Culture & Economy* ✦═╗
┃ 💱 *Currency*  : ${info.currency}
┃ 🔤 *Languages* : ${info.languages.native.join(", ")}
┃ 🌟 *Famous For*: ${info.famousFor}
╚═══════════════════════════╝

╔═✦ *Codes* ✦═╗
┃ 🌍 *ISO*  : ${info.isoCode.alpha2}, ${info.isoCode.alpha3}
┃ 🌎 *TLD*  : ${info.internetTLD}
╚═══════════╝

╔═✦ *Neighbors* ✦═╗
┃ ${neighborsText}
╚═════════════════╝

✦━━━〔 🌐 〕━━━✦
        `;

        await conn.sendMessage(from, {
            image: { url: info.flag },
            caption: text,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        await react("✅"); // Success reaction
    } catch (e) {
        console.error("Error in countryinfo command:", e);
        await react("❌");
        reply("⚠️ An error occurred while fetching country information.");
    }
});