# ==========================================
# STAGE 1: Nấu code với Node Alpine
# ==========================================
FROM node:20-alpine AS builder
WORKDIR /app

# Khai báo biến môi trường lúc build (nếu React có xài file .env)
# VÍ DỤ: ARG VITE_API_URL
# ENV VITE_API_URL=$VITE_API_URL

COPY package.json package-lock.json ./

# Xài npm ci thay vì npm install cho chuẩn bài doanh nghiệp
RUN npm ci

COPY . .
RUN npm run build

# ==========================================
# STAGE 2: Chạy web bằng Nginx Alpine
# ==========================================
FROM nginx:alpine

# Xóa trang web mặc định của Nginx cho sạch sẽ
RUN rm -rf /usr/share/nginx/html/*

# Bốc thư mục dist từ Stage 1 ném qua
COPY --from=builder /app/dist /usr/share/nginx/html

# Ghi đè file cấu hình Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]