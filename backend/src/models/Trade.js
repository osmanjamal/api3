const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
    botId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Bot',
        required: true
    },
    orderId: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    side: {
        type: String,
        enum: ['BUY', 'SELL'],
        required: true
    },
    quantity: {
        type: String,
        required: true
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'EXECUTED', 'FAILED', 'CANCELLED'],
        default: 'PENDING'
    },
    pnl: {
        type: Number,
        default: 0
    },
    closePrice: {
        type: String
    },
    closeTime: {
        type: Date
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Trade', tradeSchema);