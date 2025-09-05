# Prototypes Directory

This directory contains all prototype projects for internal tracking and discovery. Each prototype is organized in its own folder with standardized metadata and assets.

## Structure

```
prototypes/
├── prototype-name/
│   ├── prototype.json     # Required: Prototype metadata
│   ├── README.md         # Optional: Detailed documentation
│   ├── screenshot.png    # Required: Preview image
│   └── src/             # Optional: Source files
└── README.md            # This file
```

## Adding a New Prototype

1. **Create a new folder** with a descriptive name (use kebab-case)
2. **Add prototype.json** with the required metadata:

```json
{
  "name": "Your Prototype Name",
  "description": "A brief description of what this prototype does and its goals",
  "products": ["Product 1", "Product 2"],
  "status": "draft",              // draft | in-progress | completed | archived
  "type": "design",               // design | code | research | poc
  "author": "Your Name/Team",
  "created": "2024-01-30",
  "updated": "2024-01-30",
  "tags": ["tag1", "tag2"],
  "link": "https://prototype-url.com",
  "repository": "https://github.com/...",
  "screenshot": "screenshot.png",  // Relative to prototype folder
  "priority": "medium"             // low | medium | high
}
```

3. **Add a screenshot** (PNG, JPG, GIF supported) with the filename matching the `screenshot` field
4. **Optional: Add a README.md** with detailed documentation
5. **Optional: Add source files** in a `src/` folder or other organized structure

## Metadata Fields

- **name**: Display name for the prototype
- **description**: Brief overview (2-3 sentences)
- **products**: Array of related HqO products/platforms
- **status**: Current development stage
- **type**: Category of prototype
- **author**: Creator or responsible team
- **created/updated**: ISO date strings (YYYY-MM-DD)
- **tags**: Keywords for filtering and search
- **link**: Live demo, Figma, or primary URL
- **repository**: Source code repository (if applicable)
- **screenshot**: Preview image filename
- **priority**: Business/development priority

## Automatic Discovery

The dashboard automatically scans this directory and displays all valid prototypes. No manual registration required - just add your folder with `prototype.json` and it will appear on the homepage.

## Tips

- Use descriptive folder names that match your prototype name
- Keep screenshots under 2MB for fast loading
- Update the `updated` field when making changes
- Use consistent product names across prototypes
- Add relevant tags to improve discoverability
