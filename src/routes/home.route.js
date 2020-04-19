const express = require('express')
const router = express.Router()
const homeController = require('../controllers/home.controller')

router.get('/', homeController.home)
router.get('/csv', homeController.exportCsvData)

module.exports = router