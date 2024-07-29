import fs from 'fs';
import multer from 'multer';
import generateFileName from '../utils/generateFileName.js';
/**
* Config storage for multer
* @param {String} path Path to save file
* @returns {Object} storage
*/
export default function storage(path, folderDefault = false) {

    return multer
        .diskStorage({
            destination: function (req, file, cb) {
                if (folderDefault) {
                    const newFolder = path + "/" + req.uniqueSuffix

                    if (!fs.existsSync(newFolder)) {
                        fs.mkdirSync(newFolder);
                    }
                    cb(null, newFolder);
                } else {
                    cb(null, path);
                }
            },
            filename: function (req, file, cb) {
                const extension = file.originalname.split('.').pop()

                if (req.files && req.files.song) {
                    if (req.files.song && req.files.song[0]) {
                        req.fileName = "song"
                    }
                    if (req.files.albumCover && req.files.albumCover[0]) {
                        req.fileName = "cover"
                    }
                }


                if (req.fileName) {
                    cb(null, req.fileName + '.' + extension);
                } else {
                    if (folderDefault)
                        cb(null, req.uniqueSuffix + '.' + extension);
                    else
                        cb(null, generateFileName() + '.' + extension);
                }
            }
        })
}