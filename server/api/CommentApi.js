import express from 'express';
import CommentController from '../controllers/CommentController.js';
import { io } from '../socket/socket-server.js';

const app = express();

app.post('/api/comments', async (req, res) => {
    try {
        const comment = req.body;
        const payload = await CommentController.createComment(comment);

        if (payload.code === 200) {
            io.emit('comment', payload.data);
        }
        
        res.send(payload);
    } catch (error) {
        console.log(error);
    }
}
);

app.get('/api/comments/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const payload = await CommentController.getComments(postId);
        res.send(payload);
    } catch (error) {
        console.log(error);
    }
});

app.delete('/api/comments/:commentId', async (req, res) => {
    try {
        const commentId = req.params.commentId;
        const payload = await CommentController.deleteComment(commentId);
        res.send(payload);
    } catch (error) {
        console.log(error);
    }
});

export default app