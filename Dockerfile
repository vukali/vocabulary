# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Install dependencies for production
COPY package*.json ./
RUN npm ci --only=production

# Expose port 3000 (hoặc cổng mà ứng dụng của bạn đang chạy)
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
