# Copilot Instructions for Connected Website

## Company Context

### About Connected Systems
**Connected Systems** (trading as "Connected") is a software development consultancy based in Perth, Western Australia, specializing in Microsoft enterprise technologies and bespoke system development.

**Core Specializations:**
1. Microsoft 365 & SharePoint Solutions
2. Azure Integration & Cloud Services
3. Enterprise Application Development (.NET)
4. Legacy System Integration (BizTalk)

**Target Markets:** Australian enterprises (primary), international clients (secondary)  
**Office Location:** 81 Edward Street, Perth WA 6000

### Website Purpose & Goals
This is the public marketing website for Connected Systems. The site serves two primary audiences:
1. **IT Decision Makers** - Prospective clients evaluating enterprise consulting partners
2. **Existing Clients** - Support resources and company information

### Content Strategy
- **Tone:** Approachable/modern, business-focused (not overly technical)
- **Primary Page:** Single long-form home page with all key information
- **Separate Pages:** Individual product pages, privacy policy/terms & conditions, future documentation area
- **Contact:** Form submission (implementation TBD - design form but defer submission handling)
- **SEO Focus:** Australian market, Microsoft stack keywords, enterprise consulting

### Brand Identity
- **Logo:** `/public/logo-clean.svg` (icon without text)
- **Primary Colors:** 
  - Light Blue: `#00b4ec`
  - Dark Blue: `#1f73b8`
  - Text Dark: `#29313f`
- **Fonts:** Geist Sans (primary), Geist Mono (code/technical)

## Project Overview
This is a Next.js 15 static website configured for static export (`output: 'export'`) with MDX support and Tailwind CSS v4. The project uses React 19 and is specifically optimized for GitHub Pages deployment, serving purely static content without any server-side functionality.

> **Note**: If project files don't exist yet, follow these instructions to initialize the project with the correct architecture. Use `npx create-next-app@latest . --typescript --tailwind --app --src-dir --turbo --eslint`.

## Key Architecture Decisions

### Static Export Configuration
- **Static Generation**: `next.config.ts` is configured with `output: 'export'` for static site generation compatible with GitHub Pages
- **Image Optimization**: Images are set to `unoptimized: true` since static exports don't support Next.js image optimization
- **MDX Integration**: Uses `@next/mdx` with custom page extensions: `['js', 'jsx', 'mdx', 'ts', 'tsx']` for content pages
- **Build Output**: Generates static HTML/CSS/JS files in the `out/` directory for GitHub Pages serving

### Styling System
- **Tailwind CSS v4**: Uses the new `@tailwindcss/postcss` plugin (not the legacy config file approach)
- **CSS Variables**: Custom properties defined in `globals.css` using `@theme inline` directive
- **Dark Mode**: Automatic dark mode support via `prefers-color-scheme` media query
- **Typography**: Geist Sans and Geist Mono fonts loaded via `next/font/google`

### Development Workflow

#### Available Commands
```bash
npm run dev        # Development server with Turbopack
npm run build      # Production build with Turbopack  
npm run start      # Start production server
npm run lint       # ESLint with Next.js rules
```

#### Key File Patterns
- **App Router**: Uses `src/app/` directory structure (Next.js 13+ App Router)
- **Path Aliases**: `@/*` maps to `./src/*` for clean imports
- **TypeScript**: Strict mode enabled with Next.js plugin integration

## Critical Development Notes

### Turbopack Integration
Both dev and build commands use `--turbopack` flag for faster bundling. This is a deliberate choice for performance optimization.

### MDX and JSX Page Strategy
- **MDX for Content**: Use `.mdx` files for content-heavy pages (documentation, articles, static content)
- **JSX for Interactivity**: Use `.tsx` files for interactive pages requiring complex state or user interactions
- MDX loader and React integration pre-configured for seamless component embedding
- Import React components directly into MDX files using standard ES6 imports
- Both file types can coexist in the same `src/app/` directory structure

### Static Asset Handling
- All static assets in `/public/` directory are served from root
- Images should use `unoptimized: true` attribute when using Next.js `<Image>` component
- SVG assets are stored in `/public/` and referenced with absolute paths like `/next.svg`

### Styling Conventions
- Use Tailwind v4 utility classes directly
- Custom CSS variables are defined in `globals.css` using the `@theme inline` pattern
- Dark mode styles use CSS custom properties that automatically switch based on system preference
- Font variables (`--font-geist-sans`, `--font-geist-mono`) are available globally via CSS custom properties

### ESLint Configuration
- Uses flat config format (`eslint.config.mjs`) with Next.js recommended rules
- Extends `next/core-web-vitals` and `next/typescript`
- Ignores build outputs: `.next/`, `out/`, `build/`

## File Structure Guidelines
- **Content Pages**: Use `.mdx` files in `src/app/` for content-heavy pages (blogs, documentation, marketing pages)
- **Interactive Pages**: Use `.tsx` files in `src/app/` for pages requiring state management, forms, or complex interactions
- **Shared Components**: Create `src/components/` for reusable components used across both MDX and JSX pages
- **Styles**: Global styles in `src/app/globals.css`, component-specific styles as CSS modules or Tailwind classes
- **Static Assets**: All in `/public/` directory, referenced with absolute paths
- **Types**: TypeScript definitions can go in `src/types/` or alongside components

## Deployment Notes
- **GitHub Pages Optimized**: Project builds to static files in `out/` directory for GitHub Pages
- **No Server-Side Features**: Avoid API routes, server actions, or any server-side functionality
- **Asset Paths**: All assets use relative paths compatible with GitHub Pages subdirectory serving
- **Build Process**: Run `npm run build` to generate static files for deployment

### GitHub Actions Workflows
Two deployment workflows are configured in `.github/workflows/`:

1. **`nextjs.yml`** - Simplified deployment workflow
   - Triggers on push to `master` branch or manual dispatch
   - Node.js 20 with npm caching
   - Builds and deploys to GitHub Pages
   - Uses standard build without base path handling

2. **`deploy.yml`** - Enhanced deployment workflow (recommended)
   - Triggers on push to `main` or `master` branch or manual dispatch
   - Node.js 20 with npm caching
   - **Smart base path handling**: Automatically sets `NEXT_PUBLIC_BASE_PATH` for repository subdirectories (e.g., `username.github.io/repo-name`)
   - Uses `actions/configure-pages@v4` for automatic Pages configuration
   - Two-stage deployment: build job → deploy job with environment protection

Both workflows use:
- `actions/upload-pages-artifact@v3` to upload the `./out` directory
- `actions/deploy-pages@v4` for actual deployment
- Concurrency control to prevent overlapping deployments