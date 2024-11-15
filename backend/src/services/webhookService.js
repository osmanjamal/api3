const crypto = require('crypto');
const binanceService = require('./binanceService');
const Bot = require('../models/Bot');
const Trade = require('../models/Trade');

class WebhookService {
    async processSignal(payload) {
        try {
            const bot = await Bot.findOne({ uuid: payload.bot_uuid });
            if (!bot) {
                throw new Error('Bot not found');
            }

            const timestamp = Date.now();
            const maxLagMs = parseInt(payload.max_lag) * 1000;
            
            if (timestamp - parseInt(payload.timestamp) > maxLagMs) {
                throw new Error('Signal expired');
            }

            const signature = crypto
                .createHmac('sha256', bot.secret)
                .update(JSON.stringify(payload))
                .digest('hex');

            if (signature !== payload.signature) {
                throw new Error('Invalid signature');
            }

            let orderSide;
            const position = payload.strategy_info.market_position;
            const prevPosition = payload.strategy_info.prev_market_position;

            if (position === 'long' && prevPosition === 'flat') {
                orderSide = 'BUY';
            } else if (position === 'flat' && prevPosition === 'long') {
                orderSide = 'SELL';
            } else if (position === 'short' && prevPosition === 'flat') {
                orderSide = 'SELL';
            } else if (position === 'flat' && prevPosition === 'short') {
                orderSide = 'BUY';
            }

            if (!orderSide) {
                throw new Error('Invalid position transition');
            }

            await binanceService.setLeverage(payload.tv_instrument, bot.leverage);

            const order = await binanceService.placeFuturesOrder(
                payload.tv_instrument,
                orderSide,
                payload.order.amount
            );

            const trade = new Trade({
                botId: bot._id,
                orderId: order.orderId,
                symbol: payload.tv_instrument,
                side: orderSide,
                quantity: payload.order.amount,
                price: payload.trigger_price,
                timestamp: timestamp,
                status: 'EXECUTED'
            });

            await trade.save();
            return trade;

        } catch (error) {
            throw new Error(`Webhook processing failed: ${error.message}`);
        }
    }
}

module.exports = new WebhookService();