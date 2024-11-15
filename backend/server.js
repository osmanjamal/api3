const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/database');
require('dotenv').config();

const app = express();

// Routes
const userRoutes = require('./src/routes/userRoutes');
const botRoutes = require('./src/routes/botRoutes');
const tradeRoutes = require('./src/routes/tradeRoutes');
const webhookService = require('./src/services/webhookService');

// Error handler
const errorHandler = require('./src/middlewares/errorHandler');

// CORS options
const corsOptions = {
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    credentials: true,
    maxAge: 86400
};

// Connect to database
connectDB();

// Middlewares
app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan('dev'));

// Health check route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Routes
app.use('/api/v1', userRoutes);
app.use('/api/v1', botRoutes);
app.use('/api/v1', tradeRoutes);

// Webhook endpoint
app.post('/webhook/:uuid', async (req, res) => {
    try {
        const result = await webhookService.processSignal({
            ...req.body,
            bot_uuid: req.params.uuid
        });
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Handle 404
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
    console.log('Unhandled Rejection! Shutting down...');
    console.log(err.name, err.message);
    process.exit(1);
});

process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});