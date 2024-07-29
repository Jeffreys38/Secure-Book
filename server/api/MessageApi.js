import express from 'express';
import MessageController from '../controllers/MessageController.js';
import { io, onlineUsers } from '../socket/socket-server.js';
const app = express();

const endpoint = "/api/messages";

app.post(endpoint, async (req, res) => {
    const message = req.body;
    const response = await MessageController.addMessage(message);
    
    const { code, data } = response;

    if (code == 200) {
        const senderSocketId = onlineUsers.get(data.sender._id.toString())
        const receiverSocketId = onlineUsers.get(data.receiver._id.toString())
        io.to(senderSocketId).to(receiverSocketId).emit("new-message", response.data);

        const lastMessages = await MessageController.getMessagesByOwner(data.receiver._id.toString())
        if (lastMessages.code === 200) {
            io.to(receiverSocketId).emit("notification", lastMessages.data)
        }
    }

    res.status(response.code).send(response);
});

app.get(endpoint, async (req, res) => {
    const response = await MessageController.getMessages();
    res.status(response.code).send(response);
});

// Lấy danh sách tin nhắn theo userId (người nhận)
app.get(`${endpoint}/:userId`, async (req, res) => {
    const userId = req.params.userId;
    const limit =  req.query.limit
    const response = await MessageController.getMessagesByOwner(userId, limit)

    res.send(response)
});

// Xóa tin nhắn theo _id của message
app.delete(`${endpoint}/:messageId`, async (req, res) => {
    const messageId = req.params.messageId;
    const response = await MessageController.deleteMessage(messageId);
    res.status(response.code).send(response);
});

app.get(`${endpoint}/conversation/:userId1/:userId2`, async (req, res) => {
    const userId1 = req.params.userId1;
    const userId2 = req.params.userId2;
    const response = await MessageController.getConversation(userId1, userId2);
    res.status(response.code).send(response);
});

export default app