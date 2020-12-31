const express = require('express');
const router = express.Router();

const logic = require('../logic/main.js');

router.get('/', logic.home);

module.exports = router;