const tempPredictController = require('../controllers/tempPredict.chart.controller');
const express = require('express')
const router = express.Router();

router.get('/', tempPredictController.chartTempPredict);

module.exports = router;