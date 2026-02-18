<<<<<<< HEAD
# Multi-stage build: Build stage
FROM eclipse-temurin:21-jdk AS build
=======
FROM maven:3.9.6-eclipse-temurin-21-alpine AS build
>>>>>>> db6409ff3d530454665e452848781b122316a7f4
WORKDIR /app

COPY pom.xml .
COPY src src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine

<<<<<<< HEAD
# Copy source code
COPY src ./src

# Build the application (dependencies will be downloaded during build)
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
=======
>>>>>>> db6409ff3d530454665e452848781b122316a7f4
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java","-jar","app.jar"]
