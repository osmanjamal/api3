const express = require('express');
const router = express.Router();
const botController = require('../controllers/botController');
const auth = require('../middlewares/auth');

router.use(auth);

router.post('/bots', botController.createBot);
router.get('/bots', botController.getBots);
router.get('/bots/:uuid', botController.getBot);
router.put('/bots/:uuid', botController.updateBot);
router.delete('/bots/:uuid', botController.deleteBot);

module.exports = router;