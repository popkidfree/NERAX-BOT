const fs = require('fs');
const config = require('../config');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: "menu2",
    desc: "Show full bot menu",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from }) => {
    try {
        const totalCommands = Object.keys(commands).length;
        const uptime = runtime(process.uptime());

        const banner = `
█▄█ █▀█ █▀█ ▄▀█ ▀▄▀   █▀ █▀█ ▀█▀
█░█ █▄█ █▀▄ █▀█ █░█   ▄█ █▄█ ░█░
        ⚡ 𝙉𝙀𝙍𝘼𝙓 𝙎𝙔𝙎𝙏𝙀𝙈 ⚡
`;

        const menuCaption = `
${banner}

╔═━━─── • ───━━═╗
     ⚙️  SYSTEM INFO
╚═━━─── • ───━━═╝
👑 Owner     : ${config.OWNER_NAME || "Popkid"}
💻 Language  : NodeJs
📡 Platform  : Heroku
🤖 Framework : Baileys MD
🔑 Prefix    : [ ${config.PREFIX} ]
⚙️ Mode      : [ ${config.MODE} ]
🗂 Commands  : ${totalCommands}
⏱ Uptime    : ${uptime}
🧾 Version   : 5.0.0 Beta

╔═━━─── • ───━━═╗
     📥  DOWNLOAD MODULE
╚═━━─── • ───━━═╝
▸ facebook [url]     
▸ tiktok [url]       
▸ instagram [url]    
▸ twitter [url]      
▸ pinterest [url]    
▸ mediafire [url]    
▸ apk [app]          
▸ img [query]        
▸ spotify [query]    
▸ play [song]        
▸ audio [url]        
▸ video [url]        
▸ ytmp3 [url]        
▸ ytmp4 [url]        

╔═━━─── • ───━━═╗
     👥  GROUP MODULE
╚═━━─── • ───━━═╝
▸ grouplink           
▸ add @user           
▸ remove @user        
▸ kickall             
▸ promote @user       
▸ demote @user        
▸ revoke              
▸ mute [time]         
▸ unmute              
▸ lockgc / unlockgc   
▸ tagall              
▸ tagadmins           
▸ hidetag [msg]       
▸ invite              

╔═━━─── • ───━━═╗
     🎭  FUN MODULE
╚═━━─── • ───━━═╝
▸ shapar             
▸ rate @user         
▸ hack @user         
▸ ship @user1 @user2 
▸ pickup             
▸ joke               
▸ hrt / hpy / syd    
▸ anger / shy / kiss 

╔═━━─── • ───━━═╗
     👑  OWNER MODULE
╚═━━─── • ───━━═╝
▸ block @user        
▸ unblock @user      
▸ restart            
▸ shutdown           
▸ gjid               
▸ jid @user          
▸ listcmd            
▸ allmenu            

╔═━━─── • ───━━═╗
     🤖  AI MODULE
╚═━━─── • ───━━═╝
▸ ai [query]         
▸ gpt [query]        
▸ gptmini [query]    
▸ imagine [text]     
▸ imagine2 [text]    
▸ blackbox [query]   
▸ luma [query]       
▸ dj [query]         

╔═━━─── • ───━━═╗
     🎎  ANIME MODULE
╚═━━─── • ───━━═╝
▸ waifu              
▸ neko               
▸ maid               
▸ loli               
▸ animegirl          
▸ anime1 - anime5    
▸ naruto             
▸ foxgirl            

╔═━━─── • ───━━═╗
     🔄  CONVERT MODULE
╚═━━─── • ───━━═╝
▸ sticker [img]      
▸ emojimix 😎+😂      
▸ tomp3 [video]      
▸ fancy [text]       
▸ tts [text]         
▸ trt [text]         
▸ base64 [text]      
▸ unbase64 [text]    

╔═━━─── • ───━━═╗
     🛠  UTILITIES
╚═━━─── • ───━━═╝
▸ timenow            
▸ date               
▸ calculate [expr]   
▸ coinflip           
▸ roll               
▸ fact               
▸ define [word]      
▸ news [query]       
▸ movie [name]       
▸ weather [loc]      

╔═━━─── • ───━━═╗
     💞  REACTIONS
╚═━━─── • ───━━═╝
▸ cuddle @user       
▸ hug @user          
▸ kiss @user         
▸ pat @user          
▸ bonk @user         
▸ yeet @user         
▸ slap @user         
▸ blush @user        
▸ smile @user        
▸ wink @user         
▸ poke @user         

╔═━━─── • ───━━═╗
     🏠  CORE SYSTEM
╚═━━─── • ───━━═╝
▸ ping               
▸ alive              
▸ uptime             
▸ repo               
▸ owner              
▸ menu               
▸ menu2              
▸ restart            

════════════════════════════
🚀 ${config.DESCRIPTION}
`;

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

        try {
            await conn.sendMessage(
                from,
                {
                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/i4blgt.jpg' },
                    caption: menuCaption,
                    contextInfo: contextInfo
                },
                { quoted: mek }
            );
        } catch {
            await conn.sendMessage(
                from,
                { text: menuCaption, contextInfo: contextInfo },
                { quoted: mek }
            );
        }

    } catch (e) {
        await conn.sendMessage(
            from,
            { text: `❌ Menu system busy. Please try again later.\n\n> ${config.DESCRIPTION}` },
            { quoted: mek }
        );
    }
});