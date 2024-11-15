const mongoose = require('mongoose');

const botSchema = new mongoose.Schema({
    uuid: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    exchange: {
        type: String,
        required: true,
        default: 'binance'
    },
    pair: {
        type: String,
        required: true
    },
    leverage: {
        type: Number,
        required: true,
        default: 1
    },
    maxMargin: {
        type: String,
        required: true
    },
    maxInvestment: {
        type: Number,
        required: true
    },
    secret: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['ACTIVE', 'PAUSED', 'STOPPED'],
        default: 'ACTIVE'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Bot', botSchema);