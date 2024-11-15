const Trade = require('../models/Trade');
const Bot = require('../models/Bot');
const binanceService = require('../services/binanceService');

class TradeController {
    async getTrades(req, res) {
        try {
            const trades = await Trade.find({})
                .populate({
                    path: 'botId',
                    match: { userId: req.user._id }
                })
                .sort({ timestamp: -1 })
                .limit(100);

            const filteredTrades = trades.filter(trade => trade.botId !== null);

            res.json({
                success: true,
                data: filteredTrades
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBotTrades(req, res) {
        try {
            const bot = await Bot.findOne({
                uuid: req.params.uuid,
                userId: req.user._id
            });

            if (!bot) {
                return res.status(404).json({
                    success: false,
                    error: 'Bot not found'
                });
            }

            const trades = await Trade.find({ botId: bot._id })
                .sort({ timestamp: -1 })
                .limit(100);

            res.json({
                success: true,
                data: trades
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async closeTrade(req, res) {
        try {
            const trade = await Trade.findOne({ _id: req.params.id })
                .populate({
                    path: 'botId',
                    match: { userId: req.user._id }
                });

            if (!trade || !trade.botId) {
                return res.status(404).json({
                    success: false,
                    error: 'Trade not found'
                });
            }

            const closeSide = trade.side === 'BUY' ? 'SELL' : 'BUY';
            const closeOrder = await binanceService.placeFuturesOrder(
                trade.symbol,
                closeSide,
                trade.quantity
            );

            trade.status = 'CLOSED';
            trade.closePrice = closeOrder.price;
            trade.closeTime = new Date();
            trade.pnl = calculatePnL(trade);
            await trade.save();

            res.json({
                success: true,
                data: trade
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getTradeStats(req, res) {
        try {
            const bot = await Bot.findOne({
                uuid: req.params.uuid,
                userId: req.user._id
            });

            if (!bot) {
                return res.status(404).json({
                    success: false,
                    error: 'Bot not found'
                });
            }

            const trades = await Trade.find({
                botId: bot._id,
                status: 'CLOSED'
            });

            const stats = calculateTradeStats(trades);

            res.json({
                success: true,
                data: stats
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

function calculatePnL(trade) {
    const entryPrice = parseFloat(trade.price);
    const closePrice = parseFloat(trade.closePrice);
    const quantity = parseFloat(trade.quantity);
    
    if (trade.side === 'BUY') {
        return (closePrice - entryPrice) * quantity;
    } else {
        return (entryPrice - closePrice) * quantity;
    }
}

function calculateTradeStats(trades) {
    const stats = {
        totalTrades: trades.length,
        winningTrades: 0,
        losingTrades: 0,
        totalPnL: 0,
        winRate: 0,
        averageWin: 0,
        averageLoss: 0
    };

    let winningSum = 0;
    let losingSum = 0;

    trades.forEach(trade => {
        stats.totalPnL += trade.pnl;
        
        if (trade.pnl > 0) {
            stats.winningTrades++;
            winningSum += trade.pnl;
        } else {
            stats.losingTrades++;
            losingSum += Math.abs(trade.pnl);
        }
    });

    stats.winRate = (stats.winningTrades / stats.totalTrades) * 100;
    stats.averageWin = winningSum / (stats.winningTrades || 1);
    stats.averageLoss = losingSum / (stats.losingTrades || 1);

    return stats;
}

module.exports = new TradeController();