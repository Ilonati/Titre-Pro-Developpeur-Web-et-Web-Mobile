
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    createMission,
    getMissions,
    updateMission,
    deleteMission
} = require('../controllers/missionsController');

router.get('/', getMissions);
router.post('/', auth, createMission);
router.put('/:id', auth, updateMission);
router.delete('/:id', auth, deleteMission);

module.exports = router;


