const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')

router.get('/', homeController.home)
router.get('/csvMinutes', homeController.exportCsvData)
router.get('/csvHours', homeController.exportCsvDataHour)
module.exports = router