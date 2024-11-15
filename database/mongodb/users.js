const userSchema = {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["email", "name", "binanceApiKey", "binanceSecretKey", "createdAt"],
            properties: {
                email: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                name: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                binanceApiKey: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                binanceSecretKey: {
                    bsonType: "string",
                    description: "must be a string and is required"
                },
                createdAt: {
                    bsonType: "date",
                    description: "must be a date and is required"
                },
                lastLoginAt: {
                    bsonType: "date",
                    description: "must be a date if the field exists"
                }
            }
        }
    }
};

