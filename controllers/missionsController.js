const db = require('../db');
const fs = require('fs');
const path = require('path');

// Папка для документов миссий
const missionDocsFolder = path.join(__dirname, '..', 'uploads', 'missions');

if (!fs.existsSync(missionDocsFolder)) {
    fs.mkdirSync(missionDocsFolder, { recursive: true });
}

// Создать миссию с возможностью загрузки файла
const createMission = (req, res) => {
    if (req.user.role !== 'association') return res.status(403).json({ message: 'Forbidden' });

    const { title, description, mission_date } = req.body;
    let documentPath = null;

    if (req.file) {
        documentPath = path.join('uploads', 'missions', req.file.filename);
    }

    db.query(
        'INSERT INTO missions (title, description, mission_date, association_id, document_path) VALUES (?, ?, ?, ?, ?)',
        [title, description, mission_date, req.user.user_id, documentPath],
        (err) => {
            if (err) return res.status(400).json({ error: err });
            res.json({ message: 'Mission created', documentPath });
        }
    );
};

// Получить все миссии
const getAllMissions = (req, res) => {
    db.query(
        `SELECT m.id, m.title, m.description, m.mission_date, u.name AS association_name, m.document_path
     FROM missions m
     JOIN users u ON m.association_id = u.id`,
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

module.exports = { createMission, getAllMissions };
