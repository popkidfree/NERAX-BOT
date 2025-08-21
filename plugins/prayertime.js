const axios = require('axios'); 
const fetch = require('node-fetch'); 
const { cmd } = require('../command');

cmd({
    pattern: "praytime", 
    alias: ["prayertimes", "prayertime", "ptime"], 
    react: "🕌", 
    desc: "Get the prayer times, weather, and location for the city.", 
    category: "information", 
    filename: __filename,
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const city = args.length > 0 ? args.join(" ") : "bhakkar"; // Default city
        const apiUrl = `https://api.nexoracle.com/islamic/prayer-times?city=${city}`;

        const response = await fetch(apiUrl);
        if (!response.ok) return reply("❎ Error fetching prayer times!");

        const data = await response.json();
        if (data.status !== 200) return reply("❎ Failed to get prayer times. Please try again later.");

        const prayerTimes = data.result.items[0];
        const weather = data.result.today_weather;
        const location = data.result.city;
        const state = data.result.state;
        const country = data.result.country;

        const temperature = weather.temperature !== null ? `${weather.temperature}°C` : "Data not available";

        // Fancy caption format
        const dec = `
╔═━━───── • ─────━━═╗
        🕌  𝙋𝙍𝘼𝙔𝙀𝙍 𝙏𝙄𝙈𝙀𝙎
╚═━━───── • ─────━━═╝

📍 *Location*: ${location}, ${state}, ${country}
🕌 *Method*: ${data.result.prayer_method_name}

╭━━❐━⪼
🌅 *Fajr*: ${prayerTimes.fajr}
🌄 *Shurooq*: ${prayerTimes.shurooq}
☀️ *Dhuhr*: ${prayerTimes.dhuhr}
🌇 *Asr*: ${prayerTimes.asr}
🌆 *Maghrib*: ${prayerTimes.maghrib}
🌃 *Isha*: ${prayerTimes.isha}
╰━━❑━⪼

🧭 *Qibla Direction*: ${data.result.qibla_direction}°
🌡️ *Temperature*: ${temperature}

> *Powered by popkid♡*
        `;

        // Send response with an image + caption
        await conn.sendMessage(
            from,
            {
                image: { url: "https://files.catbox.moe/3y5w8z.jpg" },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: "120363388320701164@newsletter",
                        newsletterName: "JesterTechX",
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

    } catch (e) {
        console.error(e);
        reply("❌ Error occurred while fetching prayer times and weather.");
    }
});