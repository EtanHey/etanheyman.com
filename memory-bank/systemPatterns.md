# System Patterns: etanheyman.com

## Architecture Overview

etanheyman.com follows the Next.js App Router architecture pattern with React components, utilizing modern React patterns and practices.

## Directory Structure

```
etanheyman.com/
├── app/                    # Main application directory (Next.js App Router)
│   ├── components/         # Reusable UI components
│   │   ├── navigation/     # Navigation-related components
│   │   └── tech-icons/     # Technology icon components
│   ├── about/              # About page route
│   ├── layout.tsx          # Root layout component
│   ├── page.tsx            # Home page component
│   └── globals.css         # Global styles
├── public/                 # Static assets
├── scripts/                # Utility scripts
└── memory-bank/           # Documentation and memory storage
```

## Component Patterns

- **Layout Components**: Define the structure and shared UI elements across pages
- **Page Components**: Contain route-specific content and logic
- **UI Components**: Reusable UI elements that make up the interface
- **Wrapper Components**: Higher-order components that provide functionality (e.g., ParallaxWrapper)

## Styling Approach

- TailwindCSS v4 for utility-first CSS
- Custom theme variables defined in globals.css
- Dark/light mode support through CSS variables and media queries
- Responsive design using Tailwind's breakpoint system

## State Management

- React's built-in hooks (useState, useEffect, useContext) for local state management
- Next.js data fetching patterns for any server-side data needs

## Navigation

- Next.js App Router for file-based routing
- Custom navigation components for enhanced user experience
- Mobile-optimized navigation for smaller screens

## Animation Strategy

- react-scroll-parallax for parallax scrolling effects
- CSS transitions for smooth UI state changes
- Possibly other animation libraries as needed

## Performance Considerations

- Component code splitting for optimized loading
- Image optimization through Next.js
- Minimizing client-side JavaScript
- Efficient rendering with React best practices

## Accessibility Patterns

- Semantic HTML structure
- Keyboard navigation support
- Color contrast compliance
- Screen reader compatibility

## Testing Strategy

- Component testing with appropriate testing library
- Accessibility testing
- Responsive design testing across devices
