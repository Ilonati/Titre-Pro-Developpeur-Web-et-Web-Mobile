const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const { applyToMission, updateApplicationStatus, getCandidaturesByMission } = require('../controllers/candidaturesController');

// Настройка хранения файлов
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '..', 'uploads'));
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage });

// Подать заявку с файлом резюме
router.post('/:mission_id/apply', auth, upload.single('resume'), applyToMission);

// Изменить статус заявки
router.patch('/:id', auth, updateApplicationStatus);

router.get('/:mission_id', auth, getCandidaturesByMission);

module.exports = router;
