const Router = require('express')
const router = new Router();
const controller = require('../controllers/friendsController')

router.post('/add', controller.addUser)

module.exports = router