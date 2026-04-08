# ==========================================
# STAGE 1: Build
# ==========================================
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app

# BÍ KÍP CACHE: Copy mỗi file pom.xml vào trước và tải dependencies
# Làm vầy thì nếu code đổi mà pom.xml không đổi, Docker sẽ xài lại cache tải thư viện, siêu nhanh!
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Tải xong thư viện mới copy source code vào để build
COPY src ./src
RUN mvn clean package -DskipTests

# ==========================================
# STAGE 2: Runtime (Môi trường alpine chạy siêu nhẹ)
# ==========================================
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy cục .jar từ Stage 1 sang. Dùng dấu * để version nào cũng dùng được thay vì hardcode
COPY --from=build /app/target/*.jar app.jar

# Mở cổng giao tiếp
EXPOSE 8080

# Chạy app
ENTRYPOINT ["java", "-jar", "app.jar"]