const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "npm",
  desc: "Search for a package on npm.",
  react: '📦',
  category: "convert",
  filename: __filename,
  use: ".npm <package-name>"
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    if (!args.length) {
      return reply("📦 Please provide the name of the npm package.\nExample: .npm express");
    }

    const packageName = args.join(" ");
    const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    const response = await axios.get(apiUrl);
    if (response.status !== 200) {
      throw new Error("Package not found or an error occurred.");
    }

    const packageData = response.data;
    const latestVersion = packageData["dist-tags"].latest;
    const description = packageData.description || "No description available.";
    const npmUrl = `https://www.npmjs.com/package/${packageName}`;
    const license = packageData.license || "Unknown";
    const repository = packageData.repository ? packageData.repository.url : "Not available";

    // Fancy styled caption
    const message = `
╔═━━───── • ─────━━═╗
     📦  𝙉𝙋𝙈 𝙋𝘼𝘾𝙆𝘼𝙂𝙀
╚═━━───── • ─────━━═╝

🔰 *Package*    : ${packageName}
📄 *Description*: ${description}
⏸️ *Version*   : ${latestVersion}
🪪 *License*   : ${license}
🪩 *Repository*: ${repository}
🔗 *NPM URL*   : ${npmUrl}

════════════════════════════
⚡ Powered by Nerax System
`;

    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (error) {
    console.error("Error:", error);

    const errorMessage = `
╔═━━───── • ─────━━═╗
    ❌  𝙀𝙍𝙍𝙊𝙍 𝙇𝙊𝙂𝙎
╚═━━───── • ─────━━═╝

📛 *Message*: ${error.message}
📜 *Stack*: ${error.stack || "Not available"}
🕒 *Time*: ${new Date().toISOString()}

════════════════════════════
⚡ Nerax NPM Debugger
`;

    await conn.sendMessage(from, { text: errorMessage }, { quoted: mek });
    reply("⚠️ An error occurred while fetching the npm package details.");
  }
});