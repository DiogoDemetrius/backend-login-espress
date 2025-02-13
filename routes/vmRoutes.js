const express = require('express');
const vmController = require('../controllers/vmController');

const router = express.Router();

// Teste simples sem middleware
router.post('/start-vm', (req, res, next) => {
    console.log('Middleware de teste');
    next();
}, vmController.startVM);

module.exports = router;