# Multi-stage Dockerfile for NHL Standings Application
# This builds both the GraphQL server and SvelteKit frontend

# Build stage for GraphQL server
FROM node:22-alpine AS server-build
WORKDIR /app

# Copy root package.json and install workspace dependencies
COPY package*.json ./
COPY shared/ ./shared/
COPY graphql-server/package*.json ./graphql-server/
RUN npm ci

# Copy server source and build
COPY graphql-server/ ./graphql-server/
RUN cd graphql-server && npm run build

# Build stage for frontend
FROM node:22-alpine AS frontend-build
WORKDIR /app

# Copy root package.json and install workspace dependencies
COPY package*.json ./
COPY shared/ ./shared/
COPY frontend/package*.json ./frontend/
RUN npm ci

# Copy frontend source and build
COPY frontend/ ./frontend/
RUN cd frontend && npm run build

# Production stage
FROM node:22-alpine AS production
WORKDIR /app

# Install production dependencies only
COPY package*.json ./
COPY shared/ ./shared/
COPY graphql-server/package*.json ./graphql-server/
RUN npm ci --only=production

# Copy built server
COPY --from=server-build /app/graphql-server/dist ./graphql-server/dist
COPY --from=server-build /app/graphql-server/src/graphql/schemas/schema.graphql ./graphql-server/src/graphql/schemas/

# Copy built frontend
COPY --from=frontend-build /app/frontend/build ./frontend/build

# Copy necessary runtime files
COPY graphql-server/server.ts ./graphql-server/

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nhlapp -u 1001
USER nhlapp

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/graphql || exit 1

# Start the server
CMD ["node", "--import", "tsx", "graphql-server/server.ts"]
