import account from './api/AccountApi.js';
import friend from './api/FriendApi.js';
import user from './api/UserApi.js';
import post from './api/PostApi.js';
import reactions from './api/ReactionApi.js';
import comment from './api/CommentApi.js';
import message from './api/MessageApi.js';
import music from './api/MusicApi.js';
import chalk from 'chalk'
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { server, app } from './socket/socket-server.js'
dotenv.config();

// CONFIG HTTP
app.use(express.json());
app.use(cors());

// API
app.use(express.static('public'))
app.use(account)
app.use(friend)
app.use(user)
app.use(post);
app.use(reactions);
app.use(comment)
app.use(message)
app.use(music)

// const options = {
//   key: fs.readFileSync('./ssl/localhost.key'),
//   cert: fs.readFileSync('./ssl/localhost.crt')
// };

server.listen(process.env.SERVER_PORT_SERVICE, () => {
    console.log(`${chalk.green('[SUCCESS]')} Server is listening on port ${process.env.SERVER_PORT_SERVICE}`);
});