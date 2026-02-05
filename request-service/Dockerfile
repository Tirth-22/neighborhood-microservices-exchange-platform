# Multi-stage build: Build stage
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy Maven wrapper and pom.xml
COPY .mvn .mvn
COPY mvnw .
COPY pom.xml .

# Make mvnw executable
RUN chmod +x ./mvnw

# Copy source code
COPY src ./src

# Build the application (dependencies will be downloaded during build)
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8083

# Run Spring Boot
ENTRYPOINT ["java","-jar","app.jar"]
