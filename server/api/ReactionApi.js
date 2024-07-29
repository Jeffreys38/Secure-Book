import express from 'express';
import PostController from '../controllers/PostController.js';
import ReactionController from '../controllers/ReactionController.js';
import { io } from '../socket/socket-server.js';

const app = express();
const endpoint = `/api/reactions`;

app.post(`${endpoint}`, async (req, res) => {
    try {
        const { postId, owner } = req.body;
        const reaction = await ReactionController.addReaction(postId, owner);
        
        io.emit('recieveEmoji', {postId, reaction});
        res.send(reaction);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.delete(`${endpoint}`, async (req, res) => {
    try {
        const { postId, owner } = req.query;
        const reaction = await ReactionController.removeReaction(postId, owner);
        
        io.emit('recieveEmoji', {postId, reaction});
        res.send(reaction);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

app.get(`${endpoint}`, async (req, res) => {
    try {
        const { postId, owner } = req.query;
        const reaction = await ReactionController.checkReaction(postId, owner);

        res.send(reaction);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
})

export default app