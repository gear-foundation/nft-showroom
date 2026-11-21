# Build stage
FROM node:24.22.3-alpine3.24@sha256:116b800c3754b440ee0aa3ed2f20f5bf3d99a554bfd9adeea09ea8017f6e85f5 AS builder

# Install build dependencies
RUN apk add --no-cache xsel

# Install pnpm globally
RUN npm install -g pnpm@12.21.0

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

# Copy package files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage: static files served by nginx as UID 101
FROM nginxinc/nginx-unprivileged:1.31.7-alpine-slim@sha256:a8cb0f33d51fa107c96fd2bd3a71aaf564ec131e9d2bdf8700944f0ed8b170d7

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /opt/dist /usr/share/nginx/html

EXPOSE 3000
