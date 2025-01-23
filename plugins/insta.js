const {
    rudhra,
    getJson,
    mode,
    getBuffer
} = require("../lib/");
const fetch = require('node-fetch');

rudhra({
    pattern: 'insta ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram Reels.',
    type: 'downloader',
}, async (message, match, client) => {
    try {
        const url = match || message.reply_message.text;
        if (!url) {
            return await message.reply("Please provide a valid Instagram URL.");
        }

        const instaApi = `https://api.siputzx.my.id/api/d/igdl?url=${url}`;
        const res = await fetch(instaApi);
        if (!res.ok) {
            return await message.reply("Please try again.");
        }
        await message.reply('_Uploading media...⎙_', { quoted: message.data });
        
        const data = await res.json();
        const igmedia = data.data;

        if (igmedia && igmedia.length > 0) {
            let counter = 0;
            for (const media of igmedia) {
                if (counter >= 10) break;
                const mediaurl = media.url;
                await message.sendFile(mediaurl);
                counter++;
            }
        } else {
            await message.reply("No media found for the provided URL.");
        }
    } catch (error) {
        console.error(error);
        await message.reply(" 'error' ");
    }
});

rudhra({
    pattern: 'story ?(.*)',
    fromMe: mode,
    desc: 'Download Instagram Story',
    type: 'downloader'
}, async (message, match, client) => {
    const storyUrl = match || message.reply_message.text;

    if (!storyUrl) {
        return await message.reply('_Enter an Instagram Story URL!_');
    }

    try {
        let resi = await getJson(`https://api-aswin-sparky.koyeb.app/api/downloader/story?url=${storyUrl}`);
        
        if (!resi || !resi.data || resi.data.length === 0) {
            return await message.reply('_No media found or invalid URL!_');
        }

        await message.reply('_Uploading media...⎙_', { quoted: message.data });

        for (let media of resi.data) {
            if (media?.url) {
                await message.sendFromUrl(media.url, { quoted: message.data });
            } else {
                console.warn('Media object missing URL:', media);
            }
        }
    } catch (error) {
        console.error('Error fetching or sending media:', error);
        await message.reply('_Error fetching media!. Please try again later!_');
    }
});
