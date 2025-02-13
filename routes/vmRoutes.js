const express = require('express');
const { startVM } = require('../controllers/vmController');

const router = express.Router();

router.post('/start-vm', startVM);

module.exports = router;