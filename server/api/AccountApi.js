import express from 'express';
import AccountController from '../controllers/AccountController.js';
import fs from 'fs'
import axios from 'axios'

const app = express();
const endpoint = `/api/auth`;

app.post(`${endpoint}/register`, async function (req, res) {
    const account = req.body
    account.avatar = process.env.DEFAULT_AVATAR + process.env.DEFAULT_IMAGE_FORMAT
    account.coverPhoto = process.env.DEFAULT_COVER + process.env.DEFAULT_IMAGE_FORMAT

    const response = await AccountController.addAccount(account)

    if (response.code === 200) {
        // Tạo folder chứa dữ liệu cho user này
        const userId = response.data._id
        const folderPath = `./public/users/${userId}`

        if (!fs.existsSync(folderPath)) {
            fs.mkdirSync(folderPath)

            // Tạo avatar mặc định cho user
            fs.copyFileSync('./public/users/default.jpeg', `${folderPath}/${account.avatar}`)

            // Tạo ảnh bìa mặc định
            const url = "https://bingw.jasonzeng.dev/?resolution=1920x1080&index=random&w=1920&format=json&qlt=100"

            axios({
                method: 'get',
                url: url,
            })
                .then(function (response) {
                    const urlImage = response.data.url
                    const path = `${folderPath}/${account.coverPhoto}`

                    axios({
                        method: 'get',
                        url: urlImage,
                        responseType: 'stream'
                    })
                        .then(function (response) {
                            response.data.pipe(fs.createWriteStream(path))
                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                });
        }
    }
    res.send(response)
})

app.post(`${endpoint}/login`, async function (req, res) {
    try {
        const account = req.body
        const payload = await AccountController.findAccount(account)

        res.status(200).send(payload);
        
    } catch(error) {
        console.log(error)

        res.send({
            code: 404,
            message: "Something went wrong"
        })
    }
})

app.post(`${endpoint}/logout`, async function (req, res) {
    const account = req.body
    const payload = await AccountController.logout(account)

    res.send(payload)
})

export default app