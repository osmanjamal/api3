#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Installing Trading Bot Project Dependencies...${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. Please install npm first."
    exit 1
fi

# Create project directories if they don't exist
mkdir -p frontend backend

# Navigate to frontend directory and install dependencies
echo -e "${GREEN}Installing Frontend Dependencies...${NC}"
cd frontend
npm install react@18.2.0 \
    react-dom@18.2.0 \
    react-router-dom@6.16.0 \
    @heroicons/react@2.0.18 \
    lucide-react@0.284.0 \
    @tailwindcss/forms@0.5.6 \
    tailwindcss@3.3.3 \
    autoprefixer@10.4.16 \
    postcss@8.4.31 \
    recharts@2.8.0 \
    @binance/connector@3.0.0 \
    @binance/futures-connector@3.0.0 \
    @testing-library/jest-dom@5.17.0 \
    @testing-library/react@13.4.0 \
    @testing-library/user-event@13.5.0

# Install dev dependencies
npm install -D @types/react@18.2.0 \
    @types/react-dom@18.2.0 \
    eslint@8.45.0 \
    prettier@3.0.0 \
    typescript@5.0.2

# Initialize Tailwind CSS
npx tailwindcss init -p

echo -e "${GREEN}Frontend dependencies installed successfully!${NC}\n"

# Navigate back to root
cd ..

# Copy package.json if it doesn't exist
if [ ! -f frontend/package.json ]; then
    echo -e "${BLUE}Creating package.json for frontend...${NC}"
    cp package.json frontend/
fi

echo -e "${BLUE}All dependencies installed successfully!${NC}"
echo -e "${BLUE}Please make sure to run 'npm start' in the frontend directory to start the development server.${NC}"

# Check Node.js and npm versions
echo -e "\n${GREEN}Environment Information:${NC}"
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Instructions for starting the project
echo -e "\n${BLUE}To start the project:${NC}"
echo "1. cd frontend"
echo "2. npm start"
echo -e "\n${BLUE}Happy coding!${NC}"