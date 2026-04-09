FROM node:22-alpine AS builder

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
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy built assets from builder stage
COPY --from=builder /app/dist /app/dist
COPY server.mjs /app/server.mjs

# Create runtime user
RUN addgroup -S app \
    && adduser -S -D -H -u 10001 app -G app \
    && rm -rf /usr/local/lib/node_modules/npm \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack \
    && chown -R 10001:10001 /app

USER 10001:10001

# Expose port for static server
EXPOSE 5173

# Serve the built app
CMD ["node", "/app/server.mjs"]
