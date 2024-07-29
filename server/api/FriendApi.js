import express from 'express';
import FriendController from '../controllers/FriendController.js';

const app = express();
const endpoint = `/api/friends`;

app.get(`${endpoint}/:userId`, async (req, res) => {
    const userId = req.params.userId;
    const payload = await FriendController.getFriends(userId);

    res.send(payload);
});

app.put(`${endpoint}/:userId`, async (req, res) => {
    const userId = req.params.userId;
    const updateFields = req.body;
    const payload = await FriendController.updateFriend(userId, updateFields);

    res.send(payload);
});

export default app