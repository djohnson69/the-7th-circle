# The 7th Circle - Tactical Apparel E-commerce

## Overview

This is a tactical fitness apparel e-commerce storefront for "The 7th Circle" brand. The application serves as a headless Shopify frontend, fetching products via Shopify's Admin GraphQL API and rendering them through a custom React storefront. The brand identity emphasizes military/tactical aesthetics with a dark theme, bold typography, and aggressive messaging targeting fitness and tactical lifestyle enthusiasts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack React Query for server state and data fetching
- **Styling**: Tailwind CSS v4 with custom theme variables for the brand's dark tactical aesthetic
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives
- **Animations**: Framer Motion for hero animations and transitions

### Backend Architecture
- **Server**: Express.js running on Node.js with TypeScript
- **API Pattern**: RESTful endpoints under `/api/*` that proxy to Shopify's GraphQL API
- **Build Process**: Custom build script using esbuild for server bundling and Vite for client
- **Static Serving**: Production serves built client assets from `dist/public`

### E-commerce Integration
- **Platform**: Shopify (headless) via Admin GraphQL API
- **Store Domain**: `apgxpf-9s.myshopify.com` 
- **Checkout**: Direct linking to Shopify's hosted checkout (`the7thcircle.us/cart/`)
- **Cart**: Client-side cart state management simulating Hydrogen's CartProvider pattern
- **Products**: Fetched via GraphQL with transformations for display

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM (configured but minimally used)
- **Connection**: Neon serverless PostgreSQL driver
- **Schema**: Basic users table defined in `shared/schema.ts`
- **Current Usage**: In-memory storage is currently active (`MemStorage` class)

### Key Design Patterns
- **Hydrogen Components**: Custom implementations mimicking Shopify Hydrogen patterns (`Image`, `Money`, `CartProvider`)
- **Path Aliases**: `@/` for client src, `@shared/` for shared code, `@assets/` for attached assets
- **Font Strategy**: Google Fonts (Oswald for display, Roboto for body text)
- **Theme**: Dark mode only with blood red (#D00000) as primary accent color

## External Dependencies

### Third-Party Services
- **Shopify Admin API**: Product catalog, collections, and checkout (requires `SHOPIFY_ADMIN_TOKEN` environment variable)
- **Shopify Storefront**: Checkout URLs redirect to `the7thcircle.us`
- **Google Fonts**: Oswald and Roboto font families

### Database
- **PostgreSQL**: Via Neon serverless driver, connection string in `DATABASE_URL` environment variable
- **Drizzle ORM**: Schema management and database operations

### Key NPM Dependencies
- `@tanstack/react-query`: Data fetching and caching
- `drizzle-orm` / `drizzle-zod`: Database ORM and schema validation
- `@neondatabase/serverless`: PostgreSQL connection
- `express`: HTTP server
- `wouter`: Client-side routing
- Radix UI primitives: Accessible component foundations
- `framer-motion`: Animations
- `zod`: Runtime validation