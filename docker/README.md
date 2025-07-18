# Docker Setup for NHL Standings Application

This directory contains Docker configuration for the NHL Standings application, supporting both development and production environments.

## Architecture

The application uses a multi-service architecture:
- **GraphQL Server**: Node.js/Fastify backend serving GraphQL API
- **Frontend**: SvelteKit application served via Nginx in production

## Quick Start

### Production
```bash
# Build and start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# GraphQL API: http://localhost:4000/graphql
```

### Development
```bash
# Start development environment with hot reload
docker-compose -f docker-compose.dev.yml up --build

# Frontend: http://localhost:5173 (Vite dev server)
# GraphQL API: http://localhost:4000/graphql
```

## Available Services

### Production Services
- `frontend`: Nginx-served SvelteKit build (port 3000)
- `graphql-server`: Production GraphQL server (port 4000)

### Development Services
- `frontend`: Vite dev server with hot reload (port 5173)
- `graphql-server`: Nodemon-powered server with hot reload (port 4000)

## Docker Commands

### Building
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend
docker-compose build graphql-server

# Force rebuild without cache
docker-compose build --no-cache
```

### Running
```bash
# Start in background
docker-compose up -d

# Start specific service
docker-compose up frontend

# View logs
docker-compose logs -f
docker-compose logs -f frontend
```

### Development
```bash
# Start development environment
docker-compose -f docker-compose.dev.yml up

# Run tests in container
docker-compose exec graphql-server npm test
docker-compose exec frontend npm test

# Access container shell
docker-compose exec graphql-server sh
```

### Cleanup
```bash
# Stop all services
docker-compose down

# Remove volumes (will lose node_modules cache)
docker-compose down -v

# Remove everything including images
docker-compose down --rmi all -v
```

## Environment Variables

### Production
- `NODE_ENV=production`
- `PORT=4000` (GraphQL server)
- `PUBLIC_GRAPHQL_ENDPOINT=http://localhost:4000/graphql`

### Development
- `NODE_ENV=development`
- `VITE_HOST=0.0.0.0` (allows external access)

## Health Checks

The GraphQL server includes health checks that verify the `/graphql` endpoint is responding. The frontend service waits for the server to be healthy before starting.

## Volume Mounts (Development)

Development mode mounts source code for hot reload:
- `./frontend/src` → `/app/frontend/src`
- `./graphql-server/src` → `/app/graphql-server/src`
- `./shared` → `/app/shared`

Node modules are stored in named volumes to preserve dependencies.

## Troubleshooting

### Port Conflicts
If ports 3000, 4000, or 5173 are in use:
```bash
# Check what's using the port
lsof -i :3000

# Change ports in docker-compose.yml
ports:
  - "3001:80"  # Change 3000 to 3001
```

### Build Issues
```bash
# Clear Docker cache
docker system prune -a

# Rebuild from scratch
docker-compose build --no-cache
```

### Permission Issues
The production containers run as non-root user `nhlapp` (UID 1001) for security.

## Multi-stage Builds

The Dockerfiles use multi-stage builds to:
1. Install dependencies and build the application
2. Create lean production images with only runtime dependencies
3. Reduce final image size and attack surface