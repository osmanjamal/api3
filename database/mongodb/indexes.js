const indexes = {
    users: [
        { key: { email: 1 }, unique: true },
        { key: { createdAt: 1 } }
    ],
    bots: [
        { key: { uuid: 1 }, unique: true },
        { key: { userId: 1 } },
        { key: { status: 1 } }
    ],
    trades: [
        { key: { botId: 1 } },
        { key: { orderId: 1 }, unique: true },
        { key: { timestamp: -1 } }
    ],
    signals: [
        { key: { botId: 1 } },
        { key: { timestamp: -1 } },
        { key: { status: 1 } }
    ]
};
