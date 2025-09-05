# Changelog

All notable changes to the HqO CRM prototype will be documented in this file.

## [Unreleased]

## [v1.1.0] - 2025-01-25

### Added
- **Customer Mode Selector** for demo customization
  - `CustomerModeProvider` with React Context for global mode management
  - Settings area with dedicated `/settings/mode` route
  - Radio button UI for switching between "Generic" and "Piedmont" modes
  - `useCustomerMode()` hook for consuming components
  - Mode persistence in memory during session
  - Ready for mode-specific branding, logos, and content

### Changed
- Updated top navigation Settings link to point to `/settings/mode`
- Wrapped app layout with `CustomerModeProvider` for global access

### Technical Details
- Created `lib/providers/customer-mode-provider.tsx`
- Added `app/settings/layout.tsx` with sidebar navigation
- Added `app/settings/mode/page.tsx` with mode selection UI
- Modified `app/layout.tsx` and `components/top-nav.tsx`
- Uses TypeScript with proper type safety
- Follows shadcn/ui and Tailwind conventions

### Files Changed
- 5 files modified/created
- 209 insertions, 8 deletions
- Commit: `f9c6de0`

## [v1.0.0] - Previous Version

### Included
- Complete lease management system (list, detail, add lease modal)
- Tenant and building management with detail views
- Mock database with 8 tenants, 5 buildings, 5 leases
- Analytics dashboards with charts
- Admin panel configuration
- Modern responsive UI with dark/light theme
- Next.js 15 + React 19 + TypeScript
- Deployed to Vercel with Git integration

---

## Quick Rollback Reference

To revert customer mode selector:
```bash
git revert f9c6de0
git push origin main
```

To see all commits:
```bash
git log --oneline
```

## Known Issues

- React 19 dependency conflicts with `vaul@0.9.9` (dev environment only)
- TypeScript language server may show false "module not found" errors
- Production deployment works correctly despite dev environment warnings 