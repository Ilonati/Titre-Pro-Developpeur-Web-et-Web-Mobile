const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    applyToMission,
    getCandidatures,
    updateApplicationStatus
} = require('../controllers/candidaturesController');

router.post('/:mission_id/apply', auth, applyToMission);
router.get('/:mission_id', auth, getCandidatures);
router.patch('/:id', auth, updateApplicationStatus);

module.exports = router;




