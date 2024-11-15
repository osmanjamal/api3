const botSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["uuid", "name", "pair", "leverage", "maxMargin", "maxInvestment", "secret", "userId", "createdAt"],
            properties: {
                uuid: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                pair: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                leverage: {
                    bsonType: "int",
                    minimum: 1,
                    maximum: 125,
                    description: "must be an integer between 1 and 125 and is required"
                },
                maxMargin: {
                    bsonType: "decimal",
                    description: "must be a decimal and is required"
                },
                maxInvestment: {
                    bsonType: "decimal",
                    description: "must be a decimal and is required"
                },
                secret: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                status: {
                    enum: ["ACTIVE", "PAUSED", "STOPPED"],
                    description: "can only be one of the enum values"
                },
                userId: {
                    bsonType: "objectId",
                    description: "must be an objectId and is required"
                },
                createdAt: {
                    bsonType: "date",
                    description: "must be a date and is required"
                }
            }
        }
    }
};
