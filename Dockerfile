# Build stage
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./ 

# Install git and dependencies (npm install: works without package-lock.json)
RUN apk add --no-cache git && npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install git in production image (if needed)
RUN apk add --no-cache git

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist

# Install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Expose port (4173 = Vite preview default)
EXPOSE 4173

# Start the application
CMD ["npm", "run", "start"]
