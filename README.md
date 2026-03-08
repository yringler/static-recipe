# Recipe Site Monorepo

A monorepo containing an Eleventy static recipe site and an Angular recipe editor app.

## Structure

```
recipe-site/
├── package.json          # npm workspaces root
├── shared/
│   ├── recipe.schema.ts  # TypeScript interfaces
│   └── recipe.schema.json # JSON Schema for validation
├── site/                 # Eleventy static site
│   ├── src/
│   │   ├── recipes/      # Recipe JSON files
│   │   ├── _includes/    # Nunjucks templates
│   │   ├── css/          # Styles
│   │   └── js/           # Scaler script
│   └── _site/            # Build output
└── editor/               # Angular editor app
    ├── src/
    └── dist/             # Build output
```

## Getting Started

### Install dependencies

```bash
npm install
```

### Development

```bash
# Run the Eleventy site (http://localhost:8080)
npm run dev:site

# Run the Angular editor (http://localhost:4200)
npm run dev:editor
```

### Build

```bash
# Build both packages
npm run build

# Build individually
npm run build:site
npm run build:editor
```

## Recipe JSON Schema

Recipes live in `site/src/recipes/*.json`. Each file must conform to the schema defined in `shared/recipe.schema.json`.

### Example Recipe Structure

```json
{
  "id": "challah-bread",
  "title": "Challah Bread",
  "description": "A traditional Jewish braided bread...",
  "category": "bread",
  "tags": ["shabbos", "pareve"],
  "yield": { "amount": 2, "unit": "loaves" },
  "timing": { "prep": "PT30M", "cook": "PT35M", "total": "PT3H", "rest": "PT2H" },
  "ingredients": [
    {
      "items": [
        { "quantity": 7, "unit": "g", "item": "active dry yeast", "scalable": true }
      ]
    }
  ],
  "steps": [
    {
      "steps": [
        { "instruction": "Dissolve yeast in warm water.", "duration": "PT10M" }
      ]
    }
  ]
}
```

## Features

### Site (Eleventy)
- Recipe pages at `/recipes/{id}/`
- Homepage with recipes grouped by category
- Tag pages at `/tags/{tag}/`
- Serving size scaler (vanilla JS, no framework)
- Print-friendly CSS

### Editor (Angular)
- Paste/Load recipe JSON → edit in structured form → Copy JSON
- AJV-powered JSON Schema validation
- Reactive forms with add/remove/reorder for ingredient and step groups
- Human-friendly duration input (e.g. "30m", "1h30m") → ISO 8601 conversion
