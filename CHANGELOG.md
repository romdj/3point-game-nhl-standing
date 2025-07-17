# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-07-17

### Added
- Initial release of NHL 3-Point System project
- GraphQL server with Fastify + Mercurius
- SvelteKit frontend with TypeScript
- NHL API integration for standings data
- 3-point scoring system implementation (Win=3pts, OT/SO Loss=1pt, Loss=0pts)
- Multiple view types (divisions, conferences, league-wide)
- Responsive design with TailwindCSS + DaisyUI
- Real-time data fetching and visualization
- Comprehensive test suite with Jest
- Automated CI/CD pipeline with GitHub Actions
- Semantic-release configuration with 0.x.x versioning
- Claude AI context file for better development assistance

### Features
- **Backend**: GraphQL API server with TypeScript
- **Frontend**: Modern SvelteKit application with responsive design
- **Data**: Real-time NHL standings with 3-point calculation
- **UI**: Clean, modern interface with multiple viewing options
- **Testing**: Comprehensive test coverage for both backend and frontend
- **CI/CD**: Automated builds and releases

### Technical Details
- Node.js 22.x support
- TypeScript throughout the codebase
- GraphQL for efficient data fetching
- Modern build tools (Vite, TypeScript compiler)
- ESLint for code quality
- Jest for testing framework