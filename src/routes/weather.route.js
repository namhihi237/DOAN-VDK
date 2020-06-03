const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weather.controller');

// router.get('/getAll', weatherController.getAll);
router.get('/insert', weatherController.insertData);
router.get('/', weatherController.tempPredictAnHour);
router.get('/rain', weatherController.predictRain);
module.exports = router;