#!/bin/bash

echo "🚀 Starting Job Search Assistant with FastAPI Backend"
echo "================================================="

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.11 or later."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or later."
    exit 1
fi

# Check if MongoDB is running
if ! command -v mongod &> /dev/null; then
    echo "⚠️ MongoDB is not installed. Starting with Docker..."
    
    # Check if Docker is installed
    if ! command -v docker &> /dev/null; then
        echo "❌ Docker is not installed. Please install Docker to run MongoDB."
        exit 1
    fi
    
    # Start MongoDB with Docker
    echo "🐳 Starting MongoDB container..."
    docker run -d \
        --name job-search-mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password123 \
        -e MONGO_INITDB_DATABASE=job_search_assistant \
        -v $(pwd)/init-mongo.js:/docker-entrypoint-initdb.d/init-mongo.js:ro \
        mongo:7.0
    
    echo "⏳ Waiting for MongoDB to start..."
    sleep 10
fi

# Create Python virtual environment if it doesn't exist
if [ ! -d "backend/venv" ]; then
    echo "📦 Creating Python virtual environment..."
    cd backend
    python3 -m venv venv
    cd ..
fi

# Activate virtual environment and install dependencies
echo "📦 Installing Python dependencies..."
cd backend
source venv/bin/activate
pip install -r requirements.txt
cd ..

# Install Node.js dependencies
echo "📦 Installing Node.js dependencies..."
npm install

# Copy environment file
if [ ! -f ".env" ]; then
    echo "📝 Creating environment file..."
    cp .env.backend .env
    echo "⚠️ Please edit .env file with your API keys"
fi

# Start the backend
echo "🔧 Starting FastAPI backend..."
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 5

# Start the frontend
echo "🎨 Starting React frontend..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Job Search Assistant is running!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📊 API Docs: http://localhost:8000/docs"
echo "🗄️ MongoDB: mongodb://admin:password123@localhost:27017"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for user to stop
trap "echo '🛑 Stopping services...'; kill $BACKEND_PID $FRONTEND_PID; exit 0" INT
wait
