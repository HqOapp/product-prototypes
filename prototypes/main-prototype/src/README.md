# Source Code Directory

This folder contains all source code and implementation files for the main prototype.

## File Types
- **Source Code**: React components, JavaScript/TypeScript files, CSS/SCSS
- **Configuration**: Package.json, environment configs, build settings
- **Tests**: Unit tests, integration tests, test utilities
- **Build Assets**: Compiled code, optimized assets, distribution files

## Suggested Structure
```
src/
├── components/
│   ├── ui/
│   ├── features/
│   └── layout/
├── pages/
│   ├── dashboard/
│   ├── settings/
│   └── profile/
├── hooks/
├── utils/
├── services/
│   ├── api/
│   └── auth/
├── styles/
│   ├── globals.css
│   └── components/
├── tests/
│   ├── unit/
│   └── integration/
├── config/
└── types/
```

## Development Guidelines
- Follow established coding standards and patterns
- Include TypeScript types for better type safety
- Write tests for critical functionality
- Use consistent file and component naming
- Document complex logic with comments
- Keep components small and focused
- Use modern React patterns (hooks, functional components)

## Getting Started
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Run tests: `npm test`
4. Build for production: `npm run build`
