const express = require('express')
const route = express.Router()

const chartController = require('../controllers/chart.controller')
route.get('/', chartController.chartTemp)

module.exports = route