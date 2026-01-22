#!/bin/bash

# Setup script for Nginx Load Balancer
# This script sets up and runs the entire system with load balancing

set -e

echo "=========================================="
echo "Exam Results System - Nginx Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Create necessary directories
echo ""
echo "Creating necessary directories..."
mkdir -p nginx-logs
mkdir -p uploads
mkdir -p logs
mkdir -p backups
print_success "Directories created"

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success ".env file created from .env.example"
        print_warning "Please update .env with your configuration"
    else
        print_error ".env.example not found"
        exit 1
    fi
fi

# Stop any running containers
echo ""
echo "Stopping any existing containers..."
docker-compose down 2>/dev/null || true
print_success "Existing containers stopped"

# Build and start services
echo ""
echo "Building and starting services..."
echo "This may take a few minutes on first run..."
docker-compose up -d --build

# Wait for services to be healthy
echo ""
echo "Waiting for services to be healthy..."
sleep 5

# Check database
echo "Checking database..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -U postgres &> /dev/null; then
        print_success "Database is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        print_error "Database failed to start"
        exit 1
    fi
    echo "Waiting for database... ($i/30)"
    sleep 2
done

# Check API instances
echo ""
echo "Checking API instances..."
for port in 5000 5001 5002; do
    for i in {1..15}; do
        if curl -sf http://localhost:$port/health &> /dev/null; then
            print_success "API instance on port $port is ready"
            break
        fi
        if [ $i -eq 15 ]; then
            print_warning "API instance on port $port is not responding"
        fi
        sleep 2
    done
done

# Check Nginx
echo ""
echo "Checking Nginx load balancer..."
for i in {1..15}; do
    if curl -sf http://localhost/health &> /dev/null; then
        print_success "Nginx load balancer is ready"
        break
    fi
    if [ $i -eq 15 ]; then
        print_error "Nginx failed to start"
        exit 1
    fi
    sleep 2
done

# Run database migrations
echo ""
echo "Running database setup..."
docker-compose exec -T api_1 npm run reset
docker-compose exec -T api_1 npm run seed
print_success "Database setup completed"

# Show service status
echo ""
echo "=========================================="
echo "Service Status"
echo "=========================================="
docker-compose ps

# Show access information
echo ""
echo "=========================================="
echo "Access Information"
echo "=========================================="
echo ""
echo "🌐 Application URL:     http://localhost"
echo "🔧 API Endpoint:        http://localhost/api/v1"
echo "⚖️  API Load Balancer:  http://localhost:8080"
echo "📊 Database:            localhost:5432"
echo ""
echo "Backend Instances:"
echo "  • API Instance 1:     http://localhost:5000"
echo "  • API Instance 2:     http://localhost:5001"
echo "  • API Instance 3:     http://localhost:5002"
echo ""
echo "=========================================="
echo "Login Credentials"
echo "=========================================="
echo ""
echo "ADMIN:"
echo "  Username: admin001"
echo "  Password: Admin@123"
echo ""
echo "LECTURER:"
echo "  Username: lect001"
echo "  Password: Lect@123"
echo ""
echo "STUDENT:"
echo "  Username: student001"
echo "  Password: Student@123"
echo ""
echo "=========================================="
echo ""

# Show logs command
print_success "Setup complete!"
echo ""
echo "Useful commands:"
echo "  View logs:           docker-compose logs -f"
echo "  View API logs:       docker-compose logs -f api_1 api_2 api_3"
echo "  View Nginx logs:     docker-compose logs -f nginx"
echo "  Stop services:       docker-compose down"
echo "  Restart services:    docker-compose restart"
echo "  View status:         docker-compose ps"
echo ""