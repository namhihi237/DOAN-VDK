const chatbotController = require('../controllers/chatbot.controller')
const express = require('express')
const route = express.Router()

route.get('/', chatbotController.getWebhook)
route.post('/', chatbotController.postWebhook)

module.exports = route