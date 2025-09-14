
const db = require('../db');

exports.applyToMission = async (req, res) => {
    try {
        if (req.user.role !== 'volunteer') {
            return res.status(403).json({ message: 'Seuls les bénévoles peuvent postuler' });
        }

        const { mission_id } = req.params;

        await db.execute(
            'INSERT INTO candidatures (mission_id, volunteer_id) VALUES (?, ?)',
            [mission_id, req.user.user_id]
        );

        res.status(201).json({ message: 'Candidature envoyée' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Vous avez déjà postulé à cette mission' });
        }
        res.status(500).json({ error: err.message });
    }
};

exports.getCandidatures = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: 'Seules les associations peuvent voir les candidatures' });
        }

        const { mission_id } = req.params;

        const [rows] = await db.execute(
            `SELECT candidatures.*, users.name as volunteer_name, users.email as volunteer_email
       FROM candidatures
       JOIN users ON candidatures.volunteer_id = users.id
       WHERE mission_id = ?`,
            [mission_id]
        );

        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateApplicationStatus = async (req, res) => {
    try {
        if (req.user.role !== 'association') {
            return res.status(403).json({ message: 'Seules les associations peuvent modifier le statut' });
        }

        const { id } = req.params;
        const { status } = req.body;

        if (!['acceptee', 'refusee'].includes(status)) {
            return res.status(400).json({ message: 'Statut invalide' });
        }

        const [result] = await db.execute(
            'UPDATE candidatures SET status=? WHERE id=?',
            [status, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Candidature non trouvée' });
        }

        res.json({ message: `Candidature ${status}` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};



