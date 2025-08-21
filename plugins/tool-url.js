const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd, commands } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  react: "🖇",
  desc: "Convert media to Catbox URL",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (client, message, args, { reply }) => {
  try {
    // 🔹 CHECK MEDIA
    const quotedMsg = message.quoted ? message.quoted : message;
    const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';
    
    if (!mimeType) {
      throw "⚠️ Please reply to an *image*, *video*, or *audio file*";
    }

    // 🔹 DOWNLOAD MEDIA
    const mediaBuffer = await quotedMsg.download();
    const tempFilePath = path.join(os.tmpdir(), `catbox_upload_${Date.now()}`);
    fs.writeFileSync(tempFilePath, mediaBuffer);

    // 🔹 GET FILE EXTENSION
    let extension = '';
    if (mimeType.includes('image/jpeg')) extension = '.jpg';
    else if (mimeType.includes('image/png')) extension = '.png';
    else if (mimeType.includes('video')) extension = '.mp4';
    else if (mimeType.includes('audio')) extension = '.mp3';
    
    const fileName = `file${extension}`;

    // 🔹 PREPARE FORM
    const form = new FormData();
    form.append('fileToUpload', fs.createReadStream(tempFilePath), fileName);
    form.append('reqtype', 'fileupload');

    // 🔹 UPLOAD TO CATBOX
    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders()
    });

    if (!response.data) {
      throw "❌ Upload failed. Please try again later.";
    }

    const mediaUrl = response.data;
    fs.unlinkSync(tempFilePath);

    // 🔹 DETERMINE TYPE
    let mediaType = '📁 File';
    if (mimeType.includes('image')) mediaType = '🖼 Image';
    else if (mimeType.includes('video')) mediaType = '🎥 Video';
    else if (mimeType.includes('audio')) mediaType = '🎵 Audio';

    // 🔹 RESPONSE MESSAGE
    const result = `
📤━━━━━〔 🔗 Media Uploaded 〕━━━━━📤

✨ *Type:* ${mediaType}
📦 *Size:* ${formatBytes(mediaBuffer.length)}

🌍 *URL:* ${mediaUrl}

👑━━━〔 🌍 POPKID ┃ MD 〕━━━👑
    `.trim();

    await reply(result);

  } catch (error) {
    console.error(error);
    await reply(`❌ Error: ${error.message || error}`);
  }
});

// 📏 FORMAT BYTES
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}