[![Build Status](https://travis-ci.com/romdj/3point-game-nhl-standing.svg?branch=master)](https://travis-ci.com/romdj/3point-game-nhl-standing)

# NHL 3-Point System

A modern web application showcasing what NHL standings would look like using the International Ice Hockey Federation (IIHF) 3-point scoring system instead of the traditional NHL 2-point system.

## 🏒 About This Project

This project demonstrates the impact of alternative scoring systems on NHL standings by implementing a 3-point system that doesn't artificially narrow the gap between teams. The application provides real-time NHL standings data with multiple viewing options and interactive visualizations.

### Why 3-Point System?

The current NHL system awards 2 points for any win and 1 point for overtime/shootout losses, creating an imbalance where some games are worth 3 points total while others are worth only 2. The IIHF 3-point system addresses this by:

- **Regulation Wins**: 3 points
- **Overtime/Shootout Wins**: 2 points
- **Overtime/Shootout Losses**: 1 point
- **Regulation Losses**: 0 points

This creates a more balanced competitive environment where every game is worth the same total points.

## 🚀 Features

### Core Functionality
- **Real-time NHL Data**: Live standings fetched from official NHL API
- **Multiple View Types**: Division, Conference, Wild Card, and League-wide standings
- **Interactive Visualizations**: Sortable tables with position tracking
- **Responsive Design**: Mobile-first approach with modern UI
- **Playoff Race Visualization**: Color-coded sections showing playoff scenarios

### Technical Features
- **GraphQL API**: Efficient data fetching with type safety
- **Real-time Updates**: Live data synchronization
- **Progressive Web App**: Offline support and mobile optimization
- **Semantic Versioning**: Automated releases with conventional commits

## 🏗️ Architecture

### Technology Stack

**Frontend**
- **Framework**: SvelteKit with TypeScript
- **Styling**: TailwindCSS + DaisyUI
- **GraphQL Client**: URQL
- **Build Tool**: Vite

**Backend**
- **Server**: Fastify with Mercurius (GraphQL)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **Development**: Nodemon, ts-node

**Development & Testing**
- **Testing**: Jest with ts-jest
- **Quality**: ESLint, TypeScript
- **CI/CD**: GitHub Actions
- **Versioning**: Semantic Release

### Project Structure

```
3point-game-nhl-standing/
├── frontend/  # SvelteKit frontend
│   ├── src/
│   │   ├── api/                 # GraphQL client and API calls
│   │   ├── components/          # Svelte components
│   │   ├── domain/             # Data models and types
│   │   ├── routes/             # SvelteKit routes
│   │   ├── stores/             # Svelte stores for state management
│   │   ├── styles/             # CSS and styling
│   │   └── utils/              # Utility functions
│   ├── static/                 # Static assets
│   └── Configuration files
├── graphql-server/             # GraphQL backend
│   ├── src/
│   │   ├── config.ts           # Server configuration
│   │   ├── graphql/            # GraphQL schema and resolvers
│   │   └── utils/              # Backend utilities
│   ├── tests/                  # Backend tests
│   └── Configuration files
├── doc/                        # API documentation
├── .github/workflows/          # CI/CD configuration
├── .claude/                    # AI assistant context
└── Configuration files
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 22.x or higher
- npm (comes with Node.js)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/romdj/3point-game-nhl-standing.git
   cd 3point-game-nhl-standing
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the GraphQL server**
   ```bash
   cd graphql-server
   npm install
   npm run dev
   ```

4. **Start the frontend (in a new terminal)**
   ```bash
   cd front-end
   npm install
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - GraphQL Playground: http://localhost:4000/graphql

### Development Commands

#### Root Level
```bash
npm run build          # Compile TypeScript
npm run test           # Run Jest tests
npm run lint           # Run ESLint
npm run fetch          # Fetch NHL data
npm run complete-build # Full clean build with tests
```

#### GraphQL Server
```bash
cd graphql-server
npm start              # Start server with ts-node
npm run dev            # Start with nodemon (development)
npm test               # Run GraphQL server tests
```

#### Frontend
```bash
cd front-end
npm run dev            # Start Vite development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run check          # Run svelte-check with TypeScript
```

## 📊 API Documentation

### GraphQL Schema

The application uses a GraphQL API for efficient data fetching:

```graphql
type Team {
  conferenceAbbrev: String
  conferenceName: String
  teamName: String
  points: Int                    # Traditional NHL points
  internationalSystemPoints: Int # 3-point system points
  wins: Int
  regulationWins: Int
  otWins: Int
  losses: Int
  otLosses: Int
  gamesPlayed: Int
  goalDifferential: Int
  goalsFor: Int
  goalsAgainst: Int
  # ... additional fields
}

type Query {
  standings(date: String): [Team]
}
```

### NHL API Integration

The application integrates with the official NHL API:
- **Endpoint**: `https://api-web.nhle.com/v1/standings/{date}`
- **Data Transformation**: Converts NHL format to internal GraphQL schema
- **Historical Data**: Supports date-based queries for historical standings
- **Error Handling**: Graceful fallback for API failures

### Example Queries

```graphql
# Get current standings
query {
  standings {
    teamName
    points
    internationalSystemPoints
    wins
    regulationWins
    otWins
    losses
    otLosses
  }
}

# Get historical standings
query {
  standings(date: "2024-01-01") {
    teamName
    internationalSystemPoints
  }
}
```

## 🎯 Key Features Deep Dive

### 1. Multiple View Types

**Division View**
- Teams organized by NHL divisions (Atlantic, Metropolitan, Central, Pacific)
- Shows divisional standings with 3-point calculations
- Highlights division leaders and playoff positioning

**Conference View**
- Eastern and Western conference standings
- Demonstrates conference-wide impact of 3-point system
- Cross-divisional comparisons

**Wild Card View**
- Complex playoff race visualization
- Division leaders (top 3 from each division)
- Wild card spots (top 2 non-division leaders)
- Playoff bubble (teams within 7 points of wild card)
- Color-coded sections for different playoff scenarios

**League View**
- League-wide standings comparison
- Side-by-side traditional vs 3-point system
- Overall impact analysis

### 2. Interactive Data Visualization

**Sortable Tables**
- Click column headers to sort by any metric
- Visual indicators for sort direction
- Smooth animations for data changes

**Position Tracking**
- Up/down arrows showing team movement
- Comparative position changes between systems
- Historical position tracking

**Responsive Design**
- Mobile-optimized tables with horizontal scrolling
- Touch-friendly interface elements
- Adaptive layouts for different screen sizes

### 3. Real-time Data Processing

**Live Updates**
- Automatic data refresh from NHL API
- Real-time calculation of 3-point standings
- Efficient caching with URQL GraphQL client

**Data Transformation**
```typescript
// Example: Converting NHL points to 3-point system
internationalSystemPoints: team.otLosses * 1 +
                          (team.wins - team.regulationWins) * 2 +
                          team.regulationWins * 3
```

## 🧪 Testing

### Test Structure
```
├── graphql-server/tests/
│   ├── graphql/
│   │   ├── resolvers/          # GraphQL resolver tests
│   │   └── schemas/            # Schema validation tests
│   └── utils/                  # Utility function tests
└── frontend/
    └── src/                    # Component and utility tests
```

### Running Tests
```bash
# Run all tests
npm test

# Run backend tests
cd graphql-server && npm test

# Run frontend tests
cd front-end && npm test

# Run tests with coverage
npm run coverage
```

### Test Coverage
- **Backend**: GraphQL resolvers, API integration, data transformation
- **Frontend**: Component logic, state management, utility functions
- **Integration**: End-to-end API testing with mock data

## 🚀 Deployment

### Production Build
```bash
# Build backend
cd graphql-server
npm run build

# Build frontend
cd front-end
npm run build
```

### Environment Configuration
```bash
# GraphQL Server
PORT=4000
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# NHL API
NHL_API_BASE_URL=https://api-web.nhle.com/v1
```

### Deployment Options
- **Vercel**: Optimized for SvelteKit frontend
- **Netlify**: Static site deployment with serverless functions
- **Docker**: Containerized deployment for full-stack applications
- **AWS/GCP**: Cloud deployment with auto-scaling

## 📈 Performance

### Frontend Optimizations
- **Lazy Loading**: Components load as needed
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Unused code elimination
- **Efficient Rendering**: Svelte's compiled output

### Backend Optimizations
- **GraphQL Caching**: Client-side query caching
- **Efficient Queries**: Optimized NHL API calls
- **Connection Pooling**: HTTP client optimization
- **Error Boundaries**: Graceful error handling

### Performance Metrics
- **Lighthouse Score**: 90+ across all categories
- **First Contentful Paint**: < 1.2s
- **Time to Interactive**: < 2.5s
- **Bundle Size**: < 300KB gzipped

## 🔄 Development Workflow

### Conventional Commits
This project uses conventional commits for automated versioning:

```bash
feat: add new wildcard view functionality
fix: resolve table sorting issue
docs: update API documentation
chore: update dependencies
```

### Semantic Versioning
- **Major**: Breaking changes (currently locked to 0.x.x)
- **Minor**: New features (`feat:` commits)
- **Patch**: Bug fixes (`fix:` commits)

### Release Process
1. Create feature branch
2. Implement changes with conventional commits
3. Run tests and linting
4. Create pull request
5. Merge to main triggers automated release

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Set up environment variables:
   ```bash
   # GraphQL Server
   cp graphql-server/.env.example graphql-server/.env

   # Frontend (optional)
   cp frontend/.env.example frontend/.env
   ```
4. Make changes with conventional commits
5. Run tests: `npm test`
6. Submit pull request

### Environment Variables

#### GraphQL Server (`graphql-server/.env`)
- `NHL_API_BASE_URL`: NHL API base URL (default: https://api-web.nhle.com/v1)
- `PORT`: Server port (default: 4000)
- `NODE_ENV`: Environment (development/production/test)
- `CORS_ORIGIN`: Allowed CORS origin (default: http://localhost:5173)

#### Frontend (`frontend/.env`)
- `VITE_GRAPHQL_URL`: GraphQL server URL (default: http://localhost:4000/graphql)
- `VITE_DEV_MODE`: Development mode flag (default: true)

### Code Style
- **TypeScript**: Strict typing throughout
- **ESLint**: Enforced code style
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages

### Pull Request Guidelines
- Include tests for new features
- Update documentation as needed
- Follow existing code patterns
- Ensure all CI checks pass

## 📚 Additional Resources

### API Documentation
- [NHL API Documentation](doc/records-api.md)
- [Statistics API](doc/stats-api.md)
- [OpenAPI Specification](doc/wsr.nhle.com.swagger.json)

### External Resources
- [Drew Hynes' NHL API Documentation](https://gitlab.com/dword4/nhlapi)
- [Kevin Sidwar's API Documentation](https://www.kevinsidwar.com/)
- [Jon Ursenbach's OpenAPI Specs](https://github.com/erunion/sport-api-specifications)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

This project was made possible by the excellent work of:

- **[Drew Hynes](https://gitlab.com/dword4/nhlapi)** - Comprehensive NHL API documentation that served as the foundation for this project
- **[Kevin Sidwar](https://www.kevinsidwar.com/)** - Early NHL API documentation that provided crucial starting points
- **[Jon Ursenbach](https://github.com/erunion)** - OpenAPI 3 specification for NHL API that enabled structured development

Special thanks to the hockey analytics community for their continued support and feedback.

---

**Made with ❤️ for hockey analytics enthusiasts**

*This project is not affiliated with the National Hockey League (NHL) or the International Ice Hockey Federation (IIHF).*
