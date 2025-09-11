const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { createMission, getAllMissions } = require('../controllers/missionsController');

// Настройка multer для документов миссий
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads', 'missions'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Маршрут для создания миссии с документом
router.post('/', auth, upload.single('document'), createMission);

// Просмотр миссий
router.get('/', getAllMissions);

module.exports = router;
