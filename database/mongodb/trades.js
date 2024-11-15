const tradeSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["botId", "orderId", "symbol", "side", "quantity", "price", "status", "timestamp"],
            properties: {
                botId: {
                    bsonType: "objectId",
                    description: "must be an objectId and is required"
                },
                orderId: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                symbol: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                side: {
                    enum: ["BUY", "SELL"],
                    description: "can only be BUY or SELL"
                },
                quantity: {
                    bsonType: "decimal",
                    description: "must be a decimal and is required"
                },
                price: {
                    bsonType: "decimal",
                    description: "must be a decimal and is required"
                },
                status: {
                    enum: ["PENDING", "EXECUTED", "FAILED", "CANCELLED"],
                    description: "can only be one of the enum values"
                },
                pnl: {
                    bsonType: "decimal",
                    description: "must be a decimal if exists"
                },
                closePrice: {
                    bsonType: "decimal",
                    description: "must be a decimal if exists"
                },
                closeTime: {
                    bsonType: "date",
                    description: "must be a date if exists"
                },
                timestamp: {
                    bsonType: "date",
                    description: "must be a date and is required"
                }
            }
        }
    }
};

