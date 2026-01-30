# Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./ 

# Install git and dependencies
    RUN apk add --no-cache git && npm install
# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install git in production image (if needed)
RUN apk add --no-cache git

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
