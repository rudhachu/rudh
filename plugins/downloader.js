const { rudhra, mode } = require("../lib");
const axios = require('axios');
const path = require('path');
const fs = require('fs');

rudhra({
    pattern: 'fb ?(.*)',
    fromMe: mode,
    desc: 'Download video from Facebook.',
    type: 'downloader'
}, async (message, match) => {
    try {
        if (!match) {
            return await message.reply("_Provide a Facebook video URL_");
        }

        const videoUrl = match; // Facebook video URL

        // Call the Facebook downloader API
        const apiUrl = `https://itzpire.com/download/facebook?url=${encodeURIComponent(videoUrl)}`;

        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log("API Response:", data); // Log the API response for debugging

        // Check if the API response indicates success and contains a video download URL
        if (data.status === "success" && data.data.video_sd) {
            const videoDownloadUrl = data.data.video_sd; // Extract the video URL from the 'video_sd' field

            // Download the video file
            const videoResponse = await axios({
                url: videoDownloadUrl,
                method: 'GET',
                responseType: 'stream'
            });

            // Create a temporary file path for the video
            const tempFilePath = path.join(__dirname, `${Date.now()}.mp4`);
            const writer = fs.createWriteStream(tempFilePath);

            // Pipe the video stream to the file
            videoResponse.data.pipe(writer);

            // Handle completion of file writing
            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            console.log(`Video saved to ${tempFilePath}`);

            // Send the video file to the user in normal quality
            await message.client.sendMessage(
                message.jid,
                {
                    video: { url: tempFilePath },
                    fileName: `${Date.now()}.mp4`,
                    mimetype: "video/mp4"
                },
                { quoted: message.data }
            );

            // Optionally, delete the temporary file after sending
            fs.unlinkSync(tempFilePath);

        } else {
            console.log("Error: Could not retrieve the video download URL, API response:", data);
            await message.reply("*_Error: Could not retrieve the video download URL. Please try again later!_*");
        }
    } catch (error) {
        console.error("Caught Error:", error); // Log any caught errors
        return message.error(error + "\n\ncommand: fb", error, "_Error occurred while processing the command!!_");
    }
});
