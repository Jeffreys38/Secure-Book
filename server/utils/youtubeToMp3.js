import fs from 'fs';
import ytdl from 'ytdl-core';
import axios from 'axios';

export default async function youtubeToMp3(linkYoutube, folder) {
    try {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    
        const info = await ytdl.getInfo(linkYoutube)
        const thumbnails = info.videoDetails.thumbnails;
        // 1920 x 1080, 336x188, 244x138
        const thumbnail = thumbnails.find(thumbnail => thumbnail.width === 336 && thumbnail.height === 188);

        axios.get(thumbnail.url, { responseType: 'stream' }).then(response => {
            response.data.pipe(fs.createWriteStream(`${folder}/cover.jpeg`));
        });
 
        ytdl.downloadFromInfo(info, { filter: 'audioonly' }).pipe(fs.createWriteStream(`${folder}/song.mp3`));

        return {
            code: 200,
            message: "Success",
            data: info.videoDetails
        };
    } catch (error) {
        return {
            code: 500,
            message: error.message
        }
    }
}