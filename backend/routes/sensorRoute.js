const express = require('express');
const sensor = require('../controller/sensorController.js');
const router = express.Router();

router.post('/save', sensor.saveDataPayload);

module.exports = router;