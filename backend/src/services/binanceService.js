const { Spot } = require('@binance/connector');
const { Futures } = require('@binance/futures-connector');
const config = require('../../config/config');

class BinanceService {
    constructor() {
        // Initialize spot and futures clients
        this.spotClient = new Spot(
            process.env.BINANCE_API_KEY,
            process.env.BINANCE_API_SECRET
        );
        
        this.futuresClient = new Futures(
            process.env.BINANCE_API_KEY,
            process.env.BINANCE_API_SECRET,
            { baseURL: 'https://fapi.binance.com' }
        );
    }

    async getAccountInfo() {
        try {
            const response = await this.futuresClient.account();
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get account info: ${error.message}`);
        }
    }

    async getPositions() {
        try {
            const response = await this.futuresClient.positionRisk();
            return response.data.filter(position => parseFloat(position.positionAmt) !== 0);
        } catch (error) {
            throw new Error(`Failed to get positions: ${error.message}`);
        }
    }

    async placeFuturesOrder(symbol, side, quantity, price = null, orderType = 'MARKET') {
        try {
            const orderParams = {
                symbol: symbol,
                side: side,
                type: orderType,
                quantity: quantity
            };

            if (price && orderType !== 'MARKET') {
                orderParams.price = price;
            }

            const response = await this.futuresClient.newOrder(orderParams);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to place futures order: ${error.message}`);
        }
    }

    async setLeverage(symbol, leverage) {
        try {
            const response = await this.futuresClient.changeInitialLeverage(symbol, leverage);
            return response.data;
        } catch (error) {
            throw new Error(`Failed to set leverage: ${error.message}`);
        }
    }

    async getBalance() {
        try {
            const response = await this.futuresClient.balance();
            return response.data;
        } catch (error) {
            throw new Error(`Failed to get balance: ${error.message}`);
        }
    }

    async calculateMaxAllowedPosition(symbol, leverage) {
        try {
            const balance = await this.getBalance();
            const usdtBalance = balance.find(b => b.asset === 'USDT');
            
            if (!usdtBalance) {
                throw new Error('No USDT balance found');
            }

            const availableBalance = parseFloat(usdtBalance.availableBalance);
            const maxPosition = availableBalance * leverage;

            // Get current price for the symbol
            const ticker = await this.futuresClient.bookTicker(symbol);
            const currentPrice = parseFloat(ticker.data.price);

            return {
                maxPositionUSDT: maxPosition,
                maxPositionQuantity: maxPosition / currentPrice,
                availableBalance: availableBalance,
                currentPrice: currentPrice
            };
        } catch (error) {
            throw new Error(`Failed to calculate max position: ${error.message}`);
        }
    }

    async closeAllPositions() {
        try {
            const positions = await this.getPositions();
            const closePromises = positions.map(position => {
                const side = parseFloat(position.positionAmt) > 0 ? 'SELL' : 'BUY';
                return this.placeFuturesOrder(
                    position.symbol,
                    side,
                    Math.abs(parseFloat(position.positionAmt))
                );
            });

            return await Promise.all(closePromises);
        } catch (error) {
            throw new Error(`Failed to close all positions: ${error.message}`);
        }
    }

    async getMarketPrice(symbol) {
        try {
            const response = await this.futuresClient.bookTicker(symbol);
            return parseFloat(response.data.price);
        } catch (error) {
            throw new Error(`Failed to get market price: ${error.message}`);
        }
    }

    // Add more methods as needed...
}

module.exports = new BinanceService();