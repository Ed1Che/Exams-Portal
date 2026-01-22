#!/bin/bash

# Setup script for Nginx Load Balancer
# Root: exam-results-system/

set -e

echo "=========================================="
echo "Exam Results System - Nginx Setup"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Ensure script runs from root
ROOT_DIR="$(pwd)"

if [ ! -f "docker-compose.yml" ]; then
    print_error "Please run this script from exam-results-system root directory."
    exit 1
fi

# Check Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed."
    exit 1
fi

print_success "Docker and Docker Compose are installed"

# Create directories
echo ""
echo "Creating necessary directories..."

mkdir -p nginx-logs
mkdir -p backups
mkdir -p backend/logs
mkdir -p backend/uploads

print_success "Directories created"

# Check backend env
if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env not found. Creating from example..."

    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        print_success "backend/.env created"
        print_warning "Update backend/.env before production use"
    else
        print_error "backend/.env.example not found"
        exit 1
    fi
fi

# Stop containers
echo ""
echo "Stopping existing containers..."
docker-compose down 2>/dev/null || true
print_success "Containers stopped"

# Build & run
echo ""
echo "Building and starting services..."
docker-compose up -d --build

# Wait
echo ""
echo "Waiting for services..."
sleep 6

# Check database
echo ""
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

# Check APIs
echo ""
echo "Checking API instances..."

for port in 5000 5001 5002; do
    for i in {1..15}; do
        if curl -sf http://localhost:$port/health &> /dev/null; then
            print_success "API instance on port $port is ready"
            break
        fi

        if [ $i -eq 15 ]; then
            print_warning "API instance on port $port not responding"
        fi

        sleep 2
    done
done

# Check Nginx
echo ""
echo "Checking Nginx..."
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

# Run migrations
echo ""
echo "Running database setup..."
docker-compose exec -T api_1 npm run reset || true
docker-compose exec -T api_1 npm run seed || true
print_success "Database setup completed"

# Status
echo ""
echo "=========================================="
echo "Service Status"
echo "=========================================="
docker-compose ps

# Info
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

print_success "Setup complete!"

echo ""
echo "Useful commands:"
echo "  View logs:        docker-compose logs -f"
echo "  API logs:         docker-compose logs -f api_1 api_2 api_3"
echo "  Nginx logs:       docker-compose logs -f nginx"
echo "  Stop services:    docker-compose down"
echo "  Restart:          docker-compose restart"
echo "  Status:           docker-compose ps"
echo ""

