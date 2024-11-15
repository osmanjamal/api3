const binanceService = require('./binanceService');
const Bot = require('../models/Bot');
const Trade = require('../models/Trade');

class TradingService {
    async executeTrade(bot, signal) {
        try {
            await binanceService.setLeverage(signal.symbol, bot.leverage);
            
            const accountInfo = await binanceService.getAccountInfo();
            const availableBalance = parseFloat(accountInfo.availableBalance);
            const currentPrice = await binanceService.getMarketPrice(signal.symbol);
            
            let quantity = this.calculatePositionSize(
                availableBalance,
                currentPrice,
                bot.maxInvestment,
                bot.leverage
            );

            if (signal.order.currency_type === 'base') {
                quantity = signal.order.amount;
            }

            const order = await binanceService.placeFuturesOrder(
                signal.symbol,
                signal.action,
                quantity
            );

            const trade = new Trade({
                botId: bot._id,
                orderId: order.orderId,
                symbol: signal.symbol,
                side: signal.action,
                quantity: quantity.toString(),
                price: currentPrice.toString(),
                status: 'EXECUTED'
            });

            await trade.save();
            return trade;

        } catch (error) {
            throw new Error(`Trade execution failed: ${error.message}`);
        }
    }

    calculatePositionSize(balance, price, maxInvestment, leverage) {
        const maxPositionValue = balance * maxInvestment / 100;
        const leveragedPosition = maxPositionValue * leverage;
        return leveragedPosition / price;
    }

    async closePosition(trade) {
        try {
            const closeSide = trade.side === 'BUY' ? 'SELL' : 'BUY';
            
            const closeOrder = await binanceService.placeFuturesOrder(
                trade.symbol,
                closeSide,
                trade.quantity
            );

            const currentPrice = await binanceService.getMarketPrice(trade.symbol);
            
            trade.status = 'CLOSED';
            trade.closePrice = currentPrice.toString();
            trade.closeTime = new Date();
            await trade.save();

            return closeOrder;

        } catch (error) {
            throw new Error(`Position closing failed: ${error.message}`);
        }
    }

    async monitorPosition(trade) {
        try {
            const currentPrice = await binanceService.getMarketPrice(trade.symbol);
            const entryPrice = parseFloat(trade.price);
            const quantity = parseFloat(trade.quantity);

            let pnl;
            if (trade.side === 'BUY') {
                pnl = (currentPrice - entryPrice) * quantity;
            } else {
                pnl = (entryPrice - currentPrice) * quantity;
            }

            trade.pnl = pnl;
            await trade.save();

            return { currentPrice, pnl };

        } catch (error) {
            throw new Error(`Position monitoring failed: ${error.message}`);
        }
    }
}

module.exports = new TradingService();