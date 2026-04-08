FROM node:22-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Install preview server
RUN npm install -g serve

# Expose port for preview server
EXPOSE 5173

# Serve the built app
CMD ["serve", "-s", "dist", "-l", "5173"]
