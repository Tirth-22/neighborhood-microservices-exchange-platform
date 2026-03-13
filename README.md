# Neighborhood Microservices Exchange Platform

A full-stack microservices-based platform that enables people within a neighborhood to exchange services, skills, and resources (e.g., tutoring, repairs, deliveries, rentals) in a secure, scalable, and modular way. This project demonstrates enterprise-grade microservices architecture with independent services, API gateway, authentication, and a modern React frontend.

## 🚀 Project Overview

The Neighborhood Microservices Exchange Platform allows users to:

- **Register and authenticate** securely with JWT tokens
- **List services or resources** they offer as providers
- **Browse and request services** from nearby providers
- **Manage service requests** with real-time status tracking
- **Receive notifications** for request updates and status changes
- **Track service completion** and request lifecycle status

The platform follows domain-driven microservices design, making it easy to scale, maintain, and extend.

## 🧩 Microservices Architecture

<img width="2244" height="1013" alt="final-architecture" src="https://github.com/user-attachments/assets/28cec5bd-0d2e-4543-ab01-ab25200cbe00" />6

### Architecture Highlights
- **Service Discovery**: Eureka Server for dynamic service registration
- **API Gateway**: Spring Cloud Gateway for routing and load balancing
- **Config Server**: Centralized configuration management
- **Event-Driven**: Kafka for asynchronous communication between services
- **Database per Service**: Each microservice has its own PostgreSQL database

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Java 21 | Core programming language |
| Spring Boot 3.x | Microservices framework |
| Spring Security | Authentication & authorization |
| Spring Cloud Gateway | API Gateway & routing |
| Spring Cloud Config | Centralized configuration |
| Netflix Eureka | Service discovery |
| Apache Kafka | Event streaming & messaging |
| PostgreSQL | Database per service |
| JWT | Token-based authentication |
| Docker | Containerization |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool & dev server |
| Tailwind CSS | Styling framework |
| Axios | HTTP client |
| React Router | Client-side routing |

### Build Tools
| Tool | Purpose |
|------|---------|
| Docker Compose | Container orchestration |
| Nginx | Load balancer & reverse proxy |
| Maven | Build automation |
| Git & GitHub | Version control |
| Postman | API testing |
| pgAdmin | Database management |

### System Design Concepts
- Microservices Architecture
- Load Balancing
- Circuit Breaker Pattern
- Service Discovery (Eureka)
- Centralized Configuration
- Event-Driven Architecture
- Saga Pattern
- API Gateway Pattern
- Database per Service

## 🔑 Microservices Breakdown

### 1️⃣ Config Server (Port: 8888)
- Centralized configuration management
- Environment-specific configurations
- Git-based configuration repository
- Dynamic configuration refresh

### 2️⃣ Eureka Server (Port: 8761)
- Service registry and discovery
- Health monitoring
- Load balancing support
- Dynamic service registration

### 3️⃣ API Gateway (Port: 8080)
- Single entry point for all requests
- Request routing & load balancing
- JWT token validation
- Rate limiting
- Cross-cutting concerns handling

### 4️⃣ Auth Service (Port: 8081)
- User authentication & authorization
- JWT token generation & validation
- Login / Register APIs
- Role-based access control (USER/PROVIDER/ADMIN)
- Password encryption with BCrypt

### 5️⃣ User Service (Port: 8082)
- User profile management
- Address & neighborhood mapping
- User preferences
- Account settings

### 6️⃣ Provider Service (Port: 8083)
- Provider registration & management
- Service offerings catalog
- Availability management (timezone-aware)
- Weekday-based recurring slots
- Provider ratings & reviews

### 7️⃣ Request Service (Port: 8084)
- Service request creation
- Request lifecycle management
- Status tracking (PENDING → ACCEPTED → COMPLETED)
- Availability validation
- Double-booking prevention
- Kafka event consumption

### 8️⃣ Notification Service (Port: 8085)
- Real-time notifications
- Notification dashboard
- Status updates (Pending / Accepted / Completed)
- In-app notification support

### 🔄 Load Balancer (Port: 80)
- Nginx-based load balancing
- SSL termination
- Request distribution
- High availability

## 📁 Project Structure

```
neighborhood-microservices-exchange-platform/
├── Frontend/             # React application
├── api-gateway/          # Spring Cloud Gateway
├── auth-service/         # Authentication & JWT
├── config-server/        # Centralized configuration
├── config-repo/          # Configuration files
├── eureka-server/        # Service discovery
├── user-service/         # User management
├── provider-service/     # Provider & services
├── request-service/      # Service requests
├── notification-service/ # Notifications
├── load-balancer/        # Nginx load balancer
├── kafka-docker/         # Kafka setup
├── docker-compose.yml    # Container orchestration
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+
- Docker & Docker Compose
- Maven 3.8+
- PostgreSQL 15+ (or use Docker)

### 🐳 Docker Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/yourusername/neighborhood-microservices-exchange-platform.git
cd neighborhood-microservices-exchange-platform

# Start all services with Docker Compose
docker-compose up -d

# Check service status
docker-compose ps
```

### 🔹 Manual Backend Setup

```bash
# Start Eureka Server first
cd eureka-server
mvn spring-boot:run

# Start Config Server
cd ../config-server
mvn spring-boot:run

# Start other services (in separate terminals)
cd ../auth-service && mvn spring-boot:run
cd ../user-service && mvn spring-boot:run
cd ../provider-service && mvn spring-boot:run
cd ../request-service && mvn spring-boot:run
cd ../notification-service && mvn spring-boot:run
cd ../api-gateway && mvn spring-boot:run
```

### 🔹 Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

### Service URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| API Gateway | http://localhost:8080 |
| Eureka Dashboard | http://localhost:8761 |
| Config Server | http://localhost:8888 |
| pgAdmin | http://localhost:5050 |

## 🔐 Security

- **JWT-based authentication** with access & refresh tokens
- **Role-based access control** (USER, PROVIDER, ADMIN)
- **Secure API gateway routing** with token validation
- **BCrypt password encryption**
- **CORS configuration** for frontend integration
- **Rate limiting** to prevent abuse

## 📌 Key Features

### Core Features
- ✅ Microservices-based architecture
- ✅ Independent database per service
- ✅ Scalable & fault-tolerant design
- ✅ API Gateway pattern
- ✅ Secure JWT authentication
- ✅ Role-based authorization
- ✅ Modern responsive UI

### Provider Features
- ✅ Service listing management
- ✅ Timezone-aware availability
- ✅ Weekday-based scheduling
- ✅ Provider ratings & reviews
- ✅ Earnings tracking

### Request Management
- ✅ Service request creation
- ✅ Real-time status tracking (later)
- ✅ Availability validation
- ✅ Double-booking prevention
- ✅ Request history

### Notification System
- ✅ Real-time notifications (later)
- ✅ Status update alerts
- ✅ Notification dashboard

### Search & Discovery
- ✅ Service search & filtering
- ✅ Category-based browsing
- ✅ Price range filtering
- ✅ Rating-based sorting
- ✅ Pagination support

### Additional Features
- ✅ Location-based services
- ✅ Dispute resolution
- ✅ Provider verification
- ✅ Analytics dashboard
- ✅ Caching with Redis
- ✅ Rate limiting
- ✅ Audit logging
- ✅ Health monitoring

## 📊 API Documentation

API documentation is available via Postman collection:
- Import the project API collection into Postman

### Sample API Endpoints

```bash
# Authentication
POST /api/auth/register    # Register new user
POST /api/auth/login       # Login & get JWT

# Providers
GET  /api/providers        # List all providers
POST /api/providers        # Register as provider
GET  /api/providers/{id}/services  # Get provider services

# Requests
POST /api/requests         # Create service request
GET  /api/requests/user    # Get user's requests
PUT  /api/requests/{id}/status  # Update request status
```

## 🧪 Testing

```bash
# Run unit tests
mvn test

# Run integration tests
mvn verify

# Run frontend tests
cd Frontend && npm test
```

## 📈 Future Enhancements

- Kubernetes deployment

## 📚 Learning Outcomes

This project demonstrates proficiency in:

- **Microservices Architecture** - Designing and implementing distributed systems
- **Spring Cloud Ecosystem** - Config Server, Eureka, Gateway
- **Event-Driven Architecture** - Kafka for async communication
- **API Design** - RESTful API best practices
- **Security** - JWT, OAuth2, role-based access
- **Frontend Development** - React, Tailwind CSS
- **Dockerization** - Docker, Docker Compose, Nginx
- **Database Design** - PostgreSQL, database per service

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Tirth**
- GitHub: [@Tirth-22](https://github.com/Tirth-22)
- LinkedIn: [Tirth Makadia](https://www.linkedin.com/in/tirth-makadia-769b0931b/)

---

⭐ If you found this project helpful, please give it a star!


