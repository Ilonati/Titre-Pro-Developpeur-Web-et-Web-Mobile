const db = require('../db');
const fs = require('fs');
const path = require('path');

// Путь для хранения резюме
const uploadFolder = path.join(__dirname, '..', 'uploads');

// Создаём папку, если её нет
if (!fs.existsSync(uploadFolder)) {
    fs.mkdirSync(uploadFolder);
}

// Подать заявку с загрузкой файла
const applyToMission = (req, res) => {
    if (req.user.role !== 'volunteer') return res.status(403).json({ message: 'Forbidden' });

    const mission_id = req.params.mission_id;
    let resumePath = null;

    if (req.file) {
        resumePath = path.join('uploads', req.file.filename);
    }

    db.query(
        'INSERT INTO candidatures (mission_id, volunteer_id) VALUES (?, ?)',
        [mission_id, req.user.user_id],
        (err) => {
            if (err) return res.status(400).json({ error: 'Already applied or invalid mission' });
            res.json({ message: 'Application submitted', resumePath });
        }
    );
};

// Обновление статуса заявки (для ассоциации)
const updateApplicationStatus = (req, res) => {
    if (req.user.role !== 'association') return res.status(403).json({ message: 'Forbidden' });

    const { status } = req.body;
    const candidature_id = req.params.id;

    db.query(
        `UPDATE candidatures c
     JOIN missions m ON c.mission_id = m.id
     SET c.status = ?
     WHERE c.id = ? AND m.association_id = ?`,
        [status, candidature_id, req.user.user_id],
        (err, result) => {
            if (err) return res.status(500).json({ error: err });
            if (result.affectedRows === 0) return res.status(403).json({ message: 'Not allowed' });
            res.json({ message: 'Status updated' });
        }
    );
};

// Получить заявки для миссии (ассоциация)
const getCandidaturesByMission = (req, res) => {
    if (req.user.role !== 'association') {
        return res.status(403).json({ message: 'Only associations can view applications' });
    }

    const { mission_id } = req.params;

    db.query(
        `SELECT c.id, c.status, c.applied_at, u.name AS volunteer_name, u.email, c.mission_id
     FROM candidatures c
     JOIN users u ON c.volunteer_id = u.id
     WHERE c.mission_id = ?`,
        [mission_id],
        (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.json(results);
        }
    );
};

module.exports = { applyToMission, updateApplicationStatus, getCandidaturesByMission };
