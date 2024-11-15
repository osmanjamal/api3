const Bot = require('../models/Bot');
const Trade = require('../models/Trade');
const binanceService = require('../services/binanceService');
const crypto = require('crypto');

class BotController {
    async createBot(req, res) {
        try {
            const {
                name,
                pair,
                leverage,
                maxMargin,
                maxInvestment
            } = req.body;

            const secret = crypto.randomBytes(32).toString('hex');
            const uuid = crypto.randomUUID();

            const bot = new Bot({
                uuid,
                name,
                pair,
                leverage,
                maxMargin,
                maxInvestment,
                secret,
                userId: req.user._id
            });

            await bot.save();
            
            res.status(201).json({
                success: true,
                data: {
                    uuid: bot.uuid,
                    webhook: `${process.env.API_URL}/webhook/${bot.uuid}`,
                    secret: bot.secret
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBots(req, res) {
        try {
            const bots = await Bot.find({ userId: req.user._id });
            res.json({ success: true, data: bots });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBot(req, res) {
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
                data: {
                    bot,
                    trades
                }
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async updateBot(req, res) {
        try {
            const bot = await Bot.findOneAndUpdate(
                { uuid: req.params.uuid, userId: req.user._id },
                req.body,
                { new: true }
            );

            if (!bot) {
                return res.status(404).json({
                    success: false,
                    error: 'Bot not found'
                });
            }

            res.json({
                success: true,
                data: bot
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async deleteBot(req, res) {
        try {
            const bot = await Bot.findOneAndDelete({
                uuid: req.params.uuid,
                userId: req.user._id
            });

            if (!bot) {
                return res.status(404).json({
                    success: false,
                    error: 'Bot not found'
                });
            }

            await Trade.deleteMany({ botId: bot._id });

            res.json({
                success: true,
                message: 'Bot deleted successfully'
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new BotController();