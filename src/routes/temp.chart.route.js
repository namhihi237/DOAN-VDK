const express = require('express')
const route = express.Router()

const chartController = require('../controllers/temp.chart.controller')
route.get('/', chartController.chartTemp)
route.get('/humidity', chartController.chartHumidity)

module.exports = route