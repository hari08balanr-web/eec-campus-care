# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
ARG VITE_SUPABASE_URL=https://tiknudsevxjqhayzqzde.supabase.co
ARG VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpa251ZHNldnhqcWhheXpxemRlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA2ODM0NzEsImV4cCI6MjEwNjI1OTQ3MX0.B-e4VSTuSf9lhY-U6nqTOD1_VsmUsCs8rwgjOT9Dl3Q
ARG VITE_API_URL=/api
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Stage 2: Build Spring Boot Backend with frontend embedded
FROM maven:3.9.6-eclipse-temurin-17 AS backend-build
WORKDIR /backend
COPY backend/pom.xml .
COPY backend/src ./src
COPY --from=frontend-build /frontend/dist ./src/main/resources/static
RUN mvn clean package -DskipTests

# Stage 3: Lightweight Production Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=backend-build /backend/target/eec-care-backend-0.0.1-SNAPSHOT.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
