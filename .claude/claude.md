# NHL 3-Point System Project

## Project Overview
This project showcases what NHL standings would look like using a 3-point system (following IIHF rules) instead of the current NHL 2-point system. The goal is to provide a more balanced standings representation that doesn't artificially narrow the gap between teams.

**Current Status**: Backend complete, frontend in development using Svelte + GraphQL

## Architecture
- **Backend**: GraphQL server using Fastify + Mercurius
- **Frontend**: SvelteKit application with TypeScript
- **Data Source**: NHL API integration
- **Styling**: TailwindCSS + DaisyUI

## Key Commands

### Root Level
- `npm run build`: Compile TypeScript
- `npm run test`: Run Jest tests  
- `npm run lint`: Run ESLint on source and test files
- `npm run fetch`: Clean, build, and fetch NHL data
- `npm run init`: Initialize data pipeline
- `npm run complete-build`: Full clean build with tests

### GraphQL Server (`graphql-server/`)
- `npm start`: Start server with ts-node
- `npm run dev`: Start with nodemon for development
- `npm test`: Run GraphQL server tests

### Frontend (`front-end/svelte/international-nhl-standings/`)
- `npm run dev`: Start Vite development server
- `npm run build`: Build for production
- `npm run check`: Run svelte-check with TypeScript

## Directory Structure
- `graphql-server/`: GraphQL API server (Fastify + Mercurius)
- `front-end/svelte/international-nhl-standings/`: SvelteKit frontend
- `doc/`: NHL API documentation and OpenAPI specs
- `dist/`: Compiled TypeScript output

## Development Notes

### Scoring System
- **Win**: 3 points (vs 2 in current NHL)
- **OT/SO Loss**: 1 point (same as current)
- **Loss**: 0 points (same as current)

### Key Features
- Multiple view types (divisions, conferences, league-wide)
- Real-time NHL data integration
- Responsive design with modern UI components
- GraphQL API for efficient data fetching

### Tech Stack Details
- **Backend**: TypeScript, Fastify, Mercurius GraphQL, Axios
- **Frontend**: SvelteKit, TypeScript, TailwindCSS, DaisyUI, URQL GraphQL client
- **Testing**: Jest for both backend and frontend
- **Build Tools**: Vite, TypeScript compiler

## Current Branch Status
Working on GraphQL branch with recent changes to:
- `front-end/svelte/international-nhl-standings/src/api/standingsAPI.ts`
- `graphql-server/src/config.ts`

## API Resources
- NHL API documentation in `doc/` directory
- OpenAPI specification: `doc/wsr.nhle.com.swagger.json`
- References Drew Hynes' NHL API documentation

## Contributing
Open to contributions - see main README for contact information and acknowledgements.