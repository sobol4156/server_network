const Router = require('express')
const router = new Router();
const controller = require('../controllers/chatController')

router.post('/chat', controller.getChat)

module.exports = router