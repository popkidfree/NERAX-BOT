const axios = require('axios');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "weather",
    desc: "🌤 Get detailed weather information for any location",
    react: "🌤",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a city name.\n\n📌 Example:  `.weather Tokyo`");

        const apiKey = '2d61a72574c11c4f36173b627f8cb177'; 
        const city = q.trim();
        const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        const response = await axios.get(url);
        const data = response.data;

        const weather = `
┌─「 🌍 𝗪𝗲𝗮𝘁𝗵𝗲𝗿 𝗨𝗽𝗱𝗮𝘁𝗲 」
│ 📍 Location: *${data.name}, ${data.sys.country}*
│ 🌡️ Temp: *${data.main.temp}°C*
│ 🤗 Feels Like: *${data.main.feels_like}°C*
│ 🔻 Min: *${data.main.temp_min}°C*  |  🔺 Max: *${data.main.temp_max}°C*
│ 💧 Humidity: *${data.main.humidity}%*
│ ☁️ Condition: *${data.weather[0].main}*
│ 📝 Description: *${data.weather[0].description}*
│ 💨 Wind: *${data.wind.speed} m/s*
│ 📊 Pressure: *${data.main.pressure} hPa*
└─────────────────────────────

✨ *Powered By popkid*
`;

        return reply(weather);

    } catch (e) {
        console.log(e);
        if (e.response && e.response.status === 404) {
            return reply("🚫 City not found. Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the weather information. Please try again later.");
    }
});