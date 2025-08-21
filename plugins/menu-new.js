const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        
        const menuCaption = `┏━━━━━━━━━━━━━━━━━━━┓
┃   ✨ *NERAX BOT MENU* ✨
┗━━━━━━━━━━━━━━━━━━━┛

👑 *Owner* : Popkid
📱 *Baileys* : Multi Device
💻 *Type* : NodeJs
☁️ *Platform* : Heroku
⚙️ *Mode* : [ ${config.MODE} ]
🔑 *Prefix* : [ ${config.PREFIX} ]
🧾 *Version* : 5.0.0 Beta
🗂️ *Commands* : ${totalCommands}

┏━〔 *⚡ Main Categories ⚡* 〕━┓
┃ ① 📥 Download
┃ ② 👥 Group
┃ ③ 😄 Fun
┃ ④ 👑 Owner
┃ ⑤ 🤖 AI
┃ ⑥ 🎎 Anime
┃ ⑦ 🔄 Convert
┃ ⑧ 📌 Other
┃ ⑨ 💞 Reactions
┃ ⑩ 🏠 Main
┗━━━━━━━━━━━━━━━━━━━┛

💡 *Reply with the number (1-10)*
to explore the selected menu!`;

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: '120363420342566562@newsletter',
                newsletterName: config.OWNER_NAME,
                serverMessageId: 143
            }
        };

        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/i4blgt.jpg' },
                        caption: menuCaption,
                        contextInfo: contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                return await conn.sendMessage(
                    from,
                    { text: menuCaption, contextInfo: contextInfo },
                    { quoted: mek }
                );
            }
        };

        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            sentMsg = await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo: contextInfo },
                { quoted: mek }
            );
        }
        
        const messageID = sentMsg.key.id;

        // Stylish menu data
        const menuData = {
            '1': {
                title: "📥 Download Menu",
                content: `┏━〔 *📥 Download Menu* 〕━┓
┃ 🌐 *Social Media*
┃ • facebook [url]
┃ • mediafire [url]
┃ • tiktok [url]
┃ • twitter [url]
┃ • instagram [url]
┃ • pinterest [url]
┃ • apk [app]
┃ • img [query]
┃────────────────────
┃ 🎵 *Music / Video*
┃ • spotify [query]
┃ • play [song]
┃ • audio [url]
┃ • video [url]
┃ • ytmp3 [url]
┃ • ytmp4 [url]
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '2': {
                title: "👥 Group Menu",
                content: `┏━〔 *👥 Group Menu* 〕━┓
┃ 🛠️ *Management*
┃ • grouplink
┃ • add @user
┃ • remove @user
┃ • kickall
┃────────────────────
┃ ⚡ *Admin Tools*
┃ • promote @user
┃ • demote @user
┃ • revoke
┃ • mute [time]
┃ • unmute
┃ • lockgc
┃ • unlockgc
┃────────────────────
┃ 🏷️ *Tagging*
┃ • tagall
┃ • tagadmins
┃ • hidetag [msg]
┃ • invite
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '3': {
                title: "😄 Fun Menu",
                content: `┏━〔 *😄 Fun Menu* 〕━┓
┃ 🎭 *Interactive*
┃ • shapar
┃ • rate @user
┃ • hack @user
┃ • ship @user1 @user2
┃ • pickup
┃ • joke
┃────────────────────
┃ 😂 *Reactions*
┃ • hrt
┃ • hpy
┃ • syd
┃ • anger
┃ • shy
┃ • kiss
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '4': {
                title: "👑 Owner Menu",
                content: `┏━〔 *👑 Owner Menu* 〕━┓
┃ ⚠️ *Restricted*
┃ • block @user
┃ • unblock @user
┃ • restart
┃ • shutdown
┃────────────────────
┃ ℹ️ *Info Tools*
┃ • gjid
┃ • jid @user
┃ • listcmd
┃ • allmenu
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '5': {
                title: "🤖 AI Menu",
                content: `┏━〔 *🤖 AI Menu* 〕━┓
┃ 💬 *Chat AI*
┃ • ai [query]
┃ • gpt [query]
┃ • gptmini [query]
┃────────────────────
┃ 🖼️ *Image AI*
┃ • imagine [text]
┃ • imagine2 [text]
┃────────────────────
┃ 🔍 *Specialized*
┃ • blackbox [query]
┃ • luma [query]
┃ • dj [query]
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '6': {
                title: "🎎 Anime Menu",
                content: `┏━〔 *🎎 Anime Menu* 〕━┓
┃ 🖼️ *Images*
┃ • waifu
┃ • neko
┃ • maid
┃ • loli
┃────────────────────
┃ 🎭 *Characters*
┃ • animegirl
┃ • anime1-5
┃ • naruto
┃ • foxgirl
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '7': {
                title: "🔄 Convert Menu",
                content: `┏━〔 *🔄 Convert Menu* 〕━┓
┃ 🖼️ *Media*
┃ • sticker [img]
┃ • emojimix 😎+😂
┃ • tomp3 [video]
┃────────────────────
┃ 📝 *Text*
┃ • fancy [text]
┃ • tts [text]
┃ • trt [text]
┃ • base64 [text]
┃ • unbase64 [text]
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '8': {
                title: "📌 Other Menu",
                content: `┏━〔 *📌 Other Menu* 〕━┓
┃ 🕒 *Utilities*
┃ • timenow
┃ • date
┃ • calculate [expr]
┃────────────────────
┃ 🎲 *Random*
┃ • coinflip
┃ • roll
┃ • fact
┃────────────────────
┃ 🔍 *Search*
┃ • define [word]
┃ • news [query]
┃ • movie [name]
┃ • weather [loc]
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '9': {
                title: "💞 Reactions Menu",
                content: `┏━〔 *💞 Reactions Menu* 〕━┓
┃ ❤️ *Affection*
┃ • cuddle @user
┃ • hug @user
┃ • kiss @user
┃ • pat @user
┃────────────────────
┃ 😂 *Funny*
┃ • bonk @user
┃ • yeet @user
┃ • slap @user
┃────────────────────
┃ 😊 *Expressions*
┃ • blush @user
┃ • smile @user
┃ • wink @user
┃ • poke @user
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            },
            '10': {
                title: "🏠 Main Menu",
                content: `┏━〔 *🏠 Main Menu* 〕━┓
┃ ℹ️ *Bot Info*
┃ • ping
┃ • alive
┃ • uptime
┃ • repo
┃ • owner
┃────────────────────
┃ 🛠️ *Controls*
┃ • menu
┃ • menu2
┃ • restart
┗━━━━━━━━━━━━━━━━━━━┛
> ${config.DESCRIPTION}`,
                image: true
            }
        };

        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                
                if (isReplyToMenu) {
                    const receivedText = receivedMsg.message.conversation || 
                                      receivedMsg.message.extendedTextMessage?.text;
                    const senderID = receivedMsg.key.remoteJid;

                    if (menuData[receivedText]) {
                        const selectedMenu = menuData[receivedText];
                        
                        try {
                            if (selectedMenu.image) {
                                await conn.sendMessage(
                                    senderID,
                                    {
                                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/i4blgt.jpg' },
                                        caption: selectedMenu.content,
                                        contextInfo: contextInfo
                                    },
                                    { quoted: receivedMsg }
                                );
                            } else {
                                await conn.sendMessage(
                                    senderID,
                                    { text: selectedMenu.content, contextInfo: contextInfo },
                                    { quoted: receivedMsg }
                                );
                            }

                            await conn.sendMessage(senderID, {
                                react: { text: '✅', key: receivedMsg.key }
                            });

                        } catch (e) {
                            await conn.sendMessage(
                                senderID,
                                { text: selectedMenu.content, contextInfo: contextInfo },
                                { quoted: receivedMsg }
                            );
                        }

                    } else {
                        await conn.sendMessage(
                            senderID,
                            {
                                text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10.\n\n> ${config.DESCRIPTION}`,
                                contextInfo: contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    }
                }
            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        conn.ev.on("messages.upsert", handler);

        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        try {
            await conn.sendMessage(
                from,
                { text: `❌ Menu system busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
                { quoted: mek }
            );
        } catch {}
    }
});