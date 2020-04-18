const express = require('express')
const route = express.Router()

const chartController = require('../controllers/humidity.chart.controller')
route.get('/', chartController.chartHumidity)

module.exports = route