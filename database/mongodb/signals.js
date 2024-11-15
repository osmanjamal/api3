const signalSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["botId", "timestamp", "action", "price", "status"],
            properties: {
                botId: {
                    bsonType: "objectId",
                    description: "must be an objectId and is required"
                },
                timestamp: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                action: {
                    enum: ["BUY", "SELL", "CLOSE"],
                    description: "can only be BUY, SELL or CLOSE"
                },
                price: {
                    bsonType: "decimal",
                    description: "must be a decimal and is required"
                },
                status: {
                    enum: ["PENDING", "PROCESSED", "FAILED", "IGNORED"],
                    description: "can only be one of the enum values"
                },
                metadata: {
                    bsonType: "object",
                    description: "additional signal metadata if exists"
                },
                errorMessage: {
                    bsonType: "string",
                    description: "error message if signal failed"
                }
            }
        }
    }
};

