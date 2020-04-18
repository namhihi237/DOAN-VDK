const express = require('express')
const route = express.Router()

const chartController = require('../controllers/pressure.controller')
route.get('/', chartController.chartPressure)

module.exports = route