import express from 'express';
import multer from 'multer';
import storage from '../configs/storage.config.js';
import PostController from '../controllers/PostController.js';
import { io } from '../socket/socket-server.js';

const app = express();
const upload = multer({ storage: storage("public/posts") });

app.post('/api/posts', upload.single('file'), async (req, res) => {
    try {
        const post = JSON.parse(req.body.post);

        // Check if file is video or image
        if (req.file) {
            if (req.file.mimetype == 'video/mp4') {
                post.video = req.file.filename;
            } else {
                post.image = req.file.filename;
            }
        }

        const payload = await PostController.createPost(post);
        if (payload.code === 200) {
            io.emit("new-post", payload);
        }

        res.send(payload);
    } catch (error) {
        console.error(error);
    }
});

app.get('/api/posts', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 8;
        const offset = parseInt(req.query.offset) || 0;
        const keyword = req.query.keyword || ""

        const payload = await PostController.getPosts(limit, offset, keyword);

        res.send(payload);
    } catch (error) {
        console.error(error);
    }
});

app.put(`/api/posts/`, async (req, res) => {
    try {
        const post = req.body;

        const payload = await PostController.editPost(post)

        res.send(payload);
        
    } catch (error) {
        console.error(error);
    }
})

app.delete('/api/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        const payload = await PostController.deletePost(postId);

        if (payload.code === 200) {
            io.emit("delete-post", payload);
        }

        res.send(payload);
    } catch (error) {
        console.error(error);
    }
})

app.get('/api/posts/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;

        const payload = await PostController.getPost(postId);

        res.send(payload);
    } catch (error) {
        console.error(error);
    }
})

app.get(`/api/posts/user/:userId`, async (req, res) => {
    try {

        const userId = req.params.userId;
        const limit = parseInt(req.query.limit) || 8;
        const offset = parseInt(req.query.offset) || 0;

        const payload = await PostController.getPostByUserId(userId, limit, offset);

        res.send(payload);
    } catch (error) {
        console.error(error);
    }
})


export default app