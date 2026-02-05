# Neighborhood Microservices Exchange Platform

A microservices-based platform that enables people within a neighborhood to exchange services, skills, and resources (e.g., tutoring, repairs, deliveries, rentals) in a secure, scalable, and modular way.
This project is designed using modern microservices architecture with independent services, API gateway, authentication, and a responsive frontend.

## 🚀 Project Overview

The Neighborhood Microservices Exchange Platform allows users to: 

Register and authenticate securely
List services or resources they offer
Browse and request services from nearby users
Communicate and manage service requests
Track transactions and service status
The platform follows domain-driven microservices design, making it easy to scale and extend.

## 🧩 Microservices Architecture
<<<<<<< HEAD
  <img width="1347" height="592" alt="final-architecture" src="https://github.com/user-attachments/assets/31f72836-95a9-43d1-8af4-bd3f3e85855b" />

=======

  <img width="1347" height="592" alt="final-architecture" src="https://github.com/user-attachments/assets/ad7e61d9-020a-4893-aa93-201c73e217ae" />
>>>>>>> ea8206adef5c591d5ae741f7d251959289c6cfb3

## 🛠️ Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security
- Spring Cloud
- Eureka Service Discovery
- Spring Cloud Gateway
- JWT Authentication
- REST APIs
- Postgresql 
- Docker 

### Frontend
- React.js
- Tailwind CSS
- Axios
- Vite
- Git & GitHub
- Postman
- Maven
- Docker Compose 

### System Design Concepts
- Microservices architecture
- Load Balancer
- Circuit Breaker
- Service Discovery (Eureka)
- Centralized Configuration (Config Server)
- Loose Coupling
- saga pattern
  
## 🔑 Microservices Breakdown
### 1️⃣ Auth Service
User authentication & authorization
JWT token generation
Login / Register APIs

### 2️⃣ User Service
User profiles
Address & neighborhood mapping
Skill & service metadata

### 3️⃣ Exchange Service
Service listings
Service requests & approvals

### 4️⃣ Notification Service
Service request updates
notification dashboard (Pending / Accepted / Completed)
Email notifications (later)

### 5️⃣ Request Service
Request any service you want 

### 6️⃣ Provider Service
provide your service


## ⚙️ Setup Instructions
### 🔹 Backend Setup
Clone the repository
```bash
git clone https://github.com/yourusername/neighborhood-microservices-exchange-platform.git
```

### Start Eureka Server
```bash
cd backend/eureka-server
mvn spring-boot:run
```

### Start each microservice
```bash
mvn spring-boot:run
```

### 🔹 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Frontend will run on:

http://localhost:5173

## 🔐 Security

- JWT-based authentication
- Role-based access control
- Secure API gateway routing
- Token validation per request

## 📌 Key Features

- ✔ Microservices-based architecture
- ✔ Independent database per service
- ✔ Scalable & fault-tolerant design
- ✔ API Gateway pattern
- ✔ Secure authentication
- ✔ Modern responsive UI

## 📈 Future Enhancements

- Location-based service recommendations
- Chat between users
- Payment gateway integration
- Kubernetes deployment
- CI/CD pipelines

## 📚 Learning Outcomes

- Microservices architecture
- Spring Cloud ecosystem
- API Gateway & Service Discovery
- Frontend-backend integration
- Real-world scalable system design

## 🤝 Contributing

- Contributions are welcome!
- Fork the repository
- Create a feature branch
- Commit changes

- Open a Pull Request


