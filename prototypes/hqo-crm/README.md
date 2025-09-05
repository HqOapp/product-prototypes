# HqO CRM - Commercial Real Estate CRM Prototype

A modern, comprehensive CRM system specifically designed for commercial real estate management, built with Next.js 15 and React 19.

## 🚀 Live Demo

- **Production**: [Your Vercel URL]
- **Repository**: [Your GitHub URL]

## ✨ Features

### Core CRM Functionality
- **Lease Management**: Complete CRUD operations with detail views and modal flows
- **Tenant Management**: Comprehensive tenant profiles with health metrics
- **Building Management**: Multi-building support with space allocation
- **Analytics Dashboard**: Real-time metrics and charts using Recharts
- **People Management**: Contact management with relationship tracking

### Demo & Customization
- **🎯 Customer Mode Selector**: Switch between "Generic" and "Piedmont" demo modes
- **Settings Panel**: Dedicated settings area for configuration
- **Theme Support**: Dark/light mode toggle

### Technical Features
- **Modern Stack**: Next.js 15 App Router + React 19 + TypeScript
- **UI Components**: shadcn/ui with Radix primitives for accessibility
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Mock Database**: Comprehensive test data for demonstrations

## 🛠 Tech Stack

### Frontend
- **Next.js 15.2.4** with App Router
- **React 19** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component system
- **Radix UI** primitives for accessibility

### Key Dependencies
- **@tanstack/react-table** - Data tables
- **recharts** - Analytics charts
- **lucide-react** - Icons
- **react-hook-form + zod** - Form validation
- **next-themes** - Theme switching

## 📁 Project Structure

```
hqo-crm/
├── app/                          # Next.js App Router
│   ├── settings/                 # ⭐ Settings area
│   │   ├── layout.tsx           # Settings sidebar layout
│   │   └── mode/                # Customer mode selector
│   ├── leases/                  # Lease management
│   ├── tenants/                 # Tenant management
│   ├── buildings/               # Building management
│   ├── intelligence/            # Analytics dashboard
│   └── ...
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── admin/                   # Admin-specific components
│   └── ...
├── lib/                         # Utilities and providers
│   ├── providers/               # ⭐ React Context providers
│   │   └── customer-mode-provider.tsx
│   ├── leasesData.js           # Mock database
│   └── utils.ts
└── ...
```

## 🎯 Customer Mode System

### Usage
The customer mode system allows switching between different demo configurations:

```typescript
import { useCustomerMode } from "@/lib/providers/customer-mode-provider"

function MyComponent() {
  const { currentMode, setMode } = useCustomerMode()
  
  // Conditional rendering based on mode
  if (currentMode === "piedmont") {
    return <PiedmontSpecificContent />
  }
  
  return <GenericContent />
}
```

### Available Modes
- **Generic**: Default mode for general demonstrations
- **Piedmont**: Customized mode for Piedmont-specific demos

### Accessing Mode Selector
1. Click "Settings" in the top navigation
2. Navigate to "Mode" in the settings sidebar
3. Select desired mode with radio buttons

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation
```bash
# Clone the repository
git clone [your-repo-url]
cd hqo-crm

# Install dependencies (may show peer dependency warnings - see Known Issues)
npm install --legacy-peer-deps

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 📊 Mock Data

The application includes comprehensive mock data:
- **8 Tenants**: Including EcoVolt Energy Solutions, NextGen Biotech, etc.
- **5 Buildings**: Office, lab, data center, and retail properties
- **5 Leases**: Complete lease records with terms and documentation
- **Multiple Spaces**: Linked to buildings with availability status

Located in: `lib/leasesData.js`

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create feature branch: `git checkout -b feature/your-feature`
2. Implement changes following TypeScript + shadcn/ui patterns
3. Test functionality
4. Commit with descriptive messages
5. Push and create pull request

## 📝 Version History

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history and rollback instructions.

### Latest Version: v1.1.0
- Added Customer Mode Selector
- Settings area with sidebar navigation
- Enhanced demo customization capabilities

## ⚠️ Known Issues

### Development Environment
- **React 19 Compatibility**: Some dependencies (like `vaul@0.9.9`) don't fully support React 19 yet
- **TypeScript Warnings**: May show "module not found" errors in development
- **Solution**: Use `npm install --legacy-peer-deps` for installation

### Production
- All features work correctly in production deployment
- No impact on Vercel deployment or functionality

## 🤝 Contributing

This is a prototype project. When making changes:

1. **Document changes** in CHANGELOG.md
2. **Test thoroughly** before committing
3. **Follow TypeScript patterns** already established
4. **Use shadcn/ui conventions** for new components

## 📞 Support

For questions or issues with this prototype, refer to:
- [CHANGELOG.md](./CHANGELOG.md) for recent changes
- Git commit history for detailed change tracking
- This README for architecture understanding

---

**Built with ❤️ for commercial real estate management**