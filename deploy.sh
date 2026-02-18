#!/bin/bash

# Neighborhood Microservices Exchange Platform - Docker Deployment Script
# This script helps set up and deploy the application in different environments

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENV_FILE=".env"
ENV_EXAMPLE=".env.example"

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi
    print_success "Docker is installed"
}

check_docker_compose() {
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi
    print_success "Docker Compose is installed"
}

setup_env_file() {
    if [ -f "$ENV_FILE" ]; then
        print_warning "Existing .env file found"
        read -p "Do you want to overwrite it? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_warning "Keeping existing .env file"
            return
        fi
    fi
    
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    print_success ".env file created from .env.example"
    print_warning "Please edit .env and set your secure passwords!"
    
    # Prompt for passwords
    read -sp "Enter PostgreSQL password (min 16 chars): " PG_PASS
    echo
    read -sp "Enter JWT Secret (min 32 chars): " JWT_SECRET
    echo
    
    # Simple sed replacement (platform-dependent)
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/your_secure_password_here_change_in_production/$PG_PASS/g" "$ENV_FILE"
        sed -i '' "s/your_super_secret_jwt_key_change_this_in_production_min_32_chars/$JWT_SECRET/g" "$ENV_FILE"
    else
        # Linux
        sed -i "s/your_secure_password_here_change_in_production/$PG_PASS/g" "$ENV_FILE"
        sed -i "s/your_super_secret_jwt_key_change_this_in_production_min_32_chars/$JWT_SECRET/g" "$ENV_FILE"
    fi
    
    print_success "Environment variables configured"
}

deploy_development() {
    print_header "🚀 STARTING DEVELOPMENT ENVIRONMENT"
    
    if [ ! -f "$ENV_FILE" ]; then
        print_error ".env file not found. Setting it up..."
        setup_env_file
    fi
    
    docker-compose -f docker-compose.yml -f docker-compose.dev.yml up --build
}

deploy_production() {
    print_header "🚀 STARTING PRODUCTION ENVIRONMENT"
    
    ENV_PROD=".env.prod"
    
    if [ ! -f "$ENV_PROD" ]; then
        print_error ".env.prod file not found."
        read -p "Create from .env.example? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            cp "$ENV_EXAMPLE" "$ENV_PROD"
            print_warning "EDIT .env.prod WITH PRODUCTION CREDENTIALS BEFORE DEPLOYMENT!"
            exit 1
        else
            exit 1
        fi
    fi
    
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml --env-file "$ENV_PROD" up -d
    print_success "Production deployment started in background"
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
}

stop_services() {
    print_header "🛑 STOPPING SERVICES"
    docker-compose down
    print_success "Services stopped"
}

stop_all() {
    print_header "🛑 STOPPING ALL SERVICES AND REMOVING VOLUMES"
    docker-compose down -v
    print_success "All services stopped and volumes removed"
}

view_logs() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        docker-compose logs -f
    else
        docker-compose logs -f "$SERVICE"
    fi
}

build_service() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        print_error "Please specify a service name"
        echo "Available services: auth-service, user-service, request-service, provider-service, notification-service, api-gateway, config-server, eureka-server"
        return 1
    fi
    
    docker-compose build "$SERVICE"
    print_success "Service $SERVICE built"
}

restart_service() {
    SERVICE=$1
    if [ -z "$SERVICE" ]; then
        print_error "Please specify a service name"
        return 1
    fi
    
    docker-compose restart "$SERVICE"
    print_success "Service $SERVICE restarted"
}

check_health() {
    print_header "🏥 CHECKING SERVICE HEALTH"
    docker-compose ps
    
    echo
    print_header "📊 DETAILED HEALTH CHECK"
    
    for service in postgres config-server eureka-server api-gateway; do
        if docker ps | grep -q "$service"; then
            STATUS=$(docker inspect --format='{{.State.Health.Status}}' "$service" 2>/dev/null || echo "N/A")
            echo "  $service: $STATUS"
        fi
    done
}

display_menu() {
    echo
    echo -e "${BLUE}=== Neighborhood Microservices Exchange Platform ===${NC}"
    echo "1. Deploy Development Environment"
    echo "2. Deploy Production Environment"
    echo "3. Stop Services"
    echo "4. Stop All (including volumes)"
    echo "5. View Logs"
    echo "6. Check Service Health"
    echo "7. Build Specific Service"
    echo "8. Restart Specific Service"
    echo "9. Setup .env File"
    echo "0. Exit"
    echo
}

# Main Script
case "${1:-}" in
    "dev")
        deploy_development
        ;;
    "prod")
        deploy_production
        ;;
    "stop")
        stop_services
        ;;
    "stop-all")
        stop_all
        ;;
    "logs")
        view_logs "$2"
        ;;
    "health")
        check_health
        ;;
    "build")
        build_service "$2"
        ;;
    "restart")
        restart_service "$2"
        ;;
    "setup")
        setup_env_file
        ;;
    *)
        # No argument provided, show interactive menu
        if [ -z "$1" ]; then
            print_header "Neighborhood Microservices Exchange Platform"
            
            check_docker
            check_docker_compose
            
            while true; do
                display_menu
                read -p "Select an option (0-9): " choice
                
                case $choice in
                    1) deploy_development ;;
                    2) deploy_production ;;
                    3) stop_services ;;
                    4) stop_all ;;
                    5) read -p "Enter service name (or press Enter for all): " svc; view_logs "$svc" ;;
                    6) check_health ;;
                    7) read -p "Enter service name: " svc; build_service "$svc" ;;
                    8) read -p "Enter service name: " svc; restart_service "$svc" ;;
                    9) setup_env_file ;;
                    0) print_success "Exiting..."; exit 0 ;;
                    *) print_error "Invalid option" ;;
                esac
            done
        else
            echo "Usage:"
            echo "  ./deploy.sh dev              - Start development environment"
            echo "  ./deploy.sh prod             - Start production environment"
            echo "  ./deploy.sh stop             - Stop all services"
            echo "  ./deploy.sh stop-all         - Stop all and remove volumes"
            echo "  ./deploy.sh logs [service]   - View logs"
            echo "  ./deploy.sh health           - Check service health"
            echo "  ./deploy.sh build [service]  - Build specific service"
            echo "  ./deploy.sh restart [service]- Restart specific service"
            echo "  ./deploy.sh setup            - Setup .env file"
            echo "  ./deploy.sh                  - Interactive menu"
            exit 1
        fi
        ;;
esac
