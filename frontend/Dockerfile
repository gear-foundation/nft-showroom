# Build stage
FROM node:22-alpine AS builder

# Install build dependencies
RUN apk update && apk add --no-cache xsel

# Install pnpm globally
RUN npm install -g pnpm

# Set build arguments
ARG VITE_NODE_ADDRESS
ARG VITE_IPFS_UPLOAD_ADDRESS
ARG VITE_IPFS_GATEWAY_ADDRESS
ARG VITE_INDEXER_ADDRESS
ARG VITE_INDEXER_WS_ADDRESS
ARG VITE_GTM_ID

# Set environment variables
ENV VITE_NODE_ADDRESS=${VITE_NODE_ADDRESS} \
    VITE_IPFS_UPLOAD_ADDRESS=${VITE_IPFS_UPLOAD_ADDRESS} \
    VITE_IPFS_GATEWAY_ADDRESS=${VITE_IPFS_GATEWAY_ADDRESS} \
    VITE_INDEXER_ADDRESS=${VITE_INDEXER_ADDRESS} \
    VITE_INDEXER_WS_ADDRESS=${VITE_INDEXER_WS_ADDRESS} \
    VITE_GTM_ID=${VITE_GTM_ID} \
    DISABLE_ESLINT_PLUGIN=true \
    ESLINT_NO_DEV_ERRORS=true \
    NODE_ENV=production

# Set working directory
WORKDIR /opt

# Copy all files for better compatibility with CI/CD
COPY . .

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build the application
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install only serve package globally
RUN npm install --global serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /opt/dist ./dist

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "/app/dist", "-l", "3000"]
