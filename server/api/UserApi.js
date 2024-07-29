import express from 'express';
import UserController from '../controllers/UserController.js';
import multer from 'multer';
import storage from '../configs/storage.config.js';

const app = express();
const upload = multer({ storage: storage("public/users", true) });
const endpoint = `/api/users`;

app.get(`${endpoint}/:id`, async (req, res) => {
    const id = req.params.id;
    const user = await UserController.getUser(id);

    res.send(user);
});

app.get(`${endpoint}`, async (req, res) => {
    const user = await UserController.getUsers();

    res.send(user);
});

app.put(`${endpoint}/:id`, async (req, res) => {
    const id = req.params.id;
    const data = JSON.parse(req.body.info);

    const payload = await UserController.updateUser(id, data);

    res.send(payload);
});

app.put(`${endpoint}/:id/avatar`, 
    
    (req, res, next) => {
        // Tìm thư mục chứa id của user
        const id = req.params.id;
        req.uniqueSuffix = id;
        req.fileName = process.env.DEFAULT_AVATAR
        next();
    },

    upload.single('avatar'),
    
    async (req, res) => {
        const fileName = req.file.filename;
        const id = req.uniqueSuffix;
        const payload = await UserController.updateUser(id, { avatar : fileName});
        
        res.send(payload); 
});

app.put(`${endpoint}/:id/coverPhoto`, 
    
    (req, res, next) => {
        // Tìm thư mục chứa id của user
        const id = req.params.id;
        req.uniqueSuffix = id;
        req.fileName = process.env.DEFAULT_COVER
        next();
    },

    upload.single('coverPhoto'),
    
    async (req, res) => {
        const fileName = req.file.filename;
        const id = req.uniqueSuffix;
        const payload = await UserController.updateUser(id, { coverPhoto : fileName});
        
        res.send(payload); 
});

export default app