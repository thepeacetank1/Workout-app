# Workout App Guidelines

## Build/Run Commands
- Start full application: `./start-server.sh`
- Restart application: `./restart-server.sh`
- Backend server: `cd backend && npm run dev` (development) or `npm start` (production)
- Frontend client: `cd frontend && npm start`
- Build frontend: `cd frontend && npm run build`
- Run tests: `cd backend && npm test` or `cd frontend && npm test`
- Run specific test: `cd backend && npx jest path/to/test.js -t 'test name'`
- Install dependencies: `cd backend && npm install` or `cd frontend && npm install --legacy-peer-deps`
- Lint code: `cd backend && npm run lint` or `cd frontend && npm run lint`

## Code Style Guidelines
- **Imports**: Group by standard library, third-party, local modules
- **Formatting**: Follow ESLint rules in respective projects
- **Types**: Use TypeScript for frontend code with explicit type annotations
- **Naming**: camelCase for variables/functions, PascalCase for components/classes
- **Components**: Use functional components with hooks in React
- **APIs**: RESTful endpoints in Express, with validation
- **Error Handling**: Use try/catch with proper error responses
- **Logging**: Use Winston for backend logging with appropriate levels
- **Authentication**: JWT-based auth flow with protected routes
- **State Management**: Redux Toolkit for global state