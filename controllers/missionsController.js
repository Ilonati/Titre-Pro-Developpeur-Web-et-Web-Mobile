
const db = require('../db');

exports.createMission = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: 'Seules les associations peuvent créer des missions' });
        }

        const { title, description, mission_date } = req.body;

        if (!title || !description || !mission_date) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
        }

        const [result] = await db.execute(
            'INSERT INTO missions (title, description, mission_date, association_id) VALUES (?, ?, ?, ?)',
            [title, description, mission_date, req.user.user_id]
        );

        res.status(201).json({ message: 'Mission créée', missionId: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getMissions = async (req, res) => {
    try {
        const [missions] = await db.execute(
            'SELECT missions.*, users.name as association_name FROM missions JOIN users ON missions.association_id = users.id'
        );
        res.json(missions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateMission = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: 'Seules les associations peuvent modifier une mission' });
        }

        const { id } = req.params;
        const { title, description, mission_date } = req.body;

        const [result] = await db.execute(
            'UPDATE missions SET title=?, description=?, mission_date=? WHERE id=? AND association_id=?',
            [title, description, mission_date, id, req.user.user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mission non trouvée ou non autorisée' });
        }

        res.json({ message: 'Mission mise à jour' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteMission = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: 'Seules les associations peuvent supprimer une mission' });
        }

        const { id } = req.params;

        const [result] = await db.execute(
            'DELETE FROM missions WHERE id=? AND association_id=?',
            [id, req.user.user_id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Mission non trouvée ou non autorisée' });
        }

        res.json({ message: 'Mission supprimée' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


