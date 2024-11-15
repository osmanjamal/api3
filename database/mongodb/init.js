const { MongoClient } = require('mongodb');

async function initializeDatabase() {
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
        await client.connect();
        const db = client.db('tradingBot');

        // Create collections with schemas
        await db.createCollection('users', userSchema);
        await db.createCollection('bots', botSchema);
        await db.createCollection('trades', tradeSchema);
        await db.createCollection('signals', signalSchema);

        // Create indexes
        for (const [collection, collectionIndexes] of Object.entries(indexes)) {
            for (const index of collectionIndexes) {
                await db.collection(collection).createIndex(index.key, {
                    unique: index.unique || false,
                    background: true
                });
            }
        }

        console.log('Database initialized successfully');
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    } finally {
        await client.close();
    }
}

module.exports = initializeDatabase;
