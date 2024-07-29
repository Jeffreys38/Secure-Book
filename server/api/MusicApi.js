import express from 'express';
import multer from 'multer';
import MusicController from '../controllers/MusicController.js'
import storage from '../configs/storage.config.js';
import generateFileName from '../utils/generateFileName.js';
import youtubeToMp3 from '../utils/youtubeToMp3.js';

const app = express();
const upload = multer({ storage: storage("public/musics", true) });
const endpoint = '/api/musics';

app.post(
     `${endpoint}`,
     (req, res, next) => {
          // Truyền tham số vào vị trí Multer mỗi khi POST được gọi
          req.uniqueSuffix = generateFileName()
          next();
     },
     upload.fields([
          { name: 'song', maxCount: 1 },
          { name: 'albumCover', maxCount: 1 }
     ]),
     async (req, res) => {
          try {
               const data = JSON.parse(req.body.infoSong);

               if (data.linkYoutube) {
                    const linkYoutube = data.linkYoutube;
                    const response = await youtubeToMp3(linkYoutube, `public/musics/${req.uniqueSuffix}`)
                    let payload;

                    if (response.code === 200) {
                         delete data.linkYoutube;
                         let music = data
                       
                         music.name = response.data.title;
                         music.author = response.data.author.name;
                         music.owner =  data.owner;
                         music.file = `song.mp3`;
                         music.albumCover = `cover.jpeg`;
                         music.albumId = req.uniqueSuffix;

                         payload = await MusicController.createMusic(music);
                         res.send(payload);
                    } 
                    else if (response.code === 500) {       
                         res.send({
                              code: 500,
                              message: "Tạo bài hát thất bại"
                         });
                    }
               } else {
                    const music = JSON.parse(req.body.infoSong);
                    const file = req.files.song[0];
                    const album = req.files.albumCover[0];

                    music.file = file.filename;
                    music.albumCover = album.filename;
                    music.albumId = req.uniqueSuffix;

                    const payload = await MusicController.createMusic(music);

                    res.send(payload);
               }
          } catch (error) {
               console.log(error);
          }
     }
);

app.get(`${endpoint}`, async (req, res) => {
     try {
          const payload = await MusicController.getMusics()
          res.send(payload)
     } catch (error) {
          console.log(error)
     }
});

app.get(`${endpoint}/owner/:ownerId`, async (req, res) => {
     try {
          const { ownerId } = req.params;
          const { limit, offset } = req.query;

          const payload = await MusicController.getMusicByOwnerId(ownerId, limit, offset);
          res.send(payload);
     } catch (error) {
          console.log(error);
     }
});

app.delete(`${endpoint}/:musicId`, async (req, res) => {
     try {
          const payload = await MusicController.deleteMusic(req.params.musicId)
          res.send(payload)
     } catch (error) {
          console.log(error)
     }
});

export default app