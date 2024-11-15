const express = require('express');
const router = express.Router();
const tradeController = require('../controllers/tradeController');
const auth = require('../middlewares/auth');

router.use(auth);

router.get('/trades', tradeController.getTrades);
router.get('/bots/:uuid/trades', tradeController.getBotTrades);
router.get('/bots/:uuid/stats', tradeController.getTradeStats);
router.post('/trades/:id/close', tradeController.closeTrade);

module.exports = router;