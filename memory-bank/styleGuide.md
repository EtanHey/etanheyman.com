# Etan Heyman Portfolio - Style Guide

## Typography with Tailwind

### Font Family
- **Primary Font**: Nutmeg (headers and branding)
- **Secondary Font**: Roboto (body text and UI elements)

### Desktop Typography Scale
| Element     | Tailwind Classes                          | Size  | Weight | Line Height |
|-------------|-------------------------------------------|-------|--------|-------------|
| Header 1    | `text-[64px] font-bold font-[Nutmeg]`   | 64px  | 700    | 1.171875em  |
| Header 2    | `text-5xl font-bold font-[Nutmeg]`      | 48px  | 700    | 1.171875em  |
| Header 3    | `text-[40px] font-bold font-[Nutmeg]`   | 40px  | 700    | 1.171875em  |
| Header 4    | `text-[32px] font-bold font-[Nutmeg]`   | 32px  | 700    | 1.171875em  |
| Header 5    | `text-2xl font-bold font-[Nutmeg]`      | 24px  | 700    | 1.171875em  |
| Header 6    | `text-xl font-bold font-[Nutmeg]`       | 20px  | 700    | 1.171875em  |
| Paragraph   | `text-lg font-normal`                    | 18px  | 400    | 1.171875em  |

### Mobile Typography Scale
| Element     | Tailwind Classes                              | Size  | Weight | Line Height |
|-------------|-----------------------------------------------|-------|--------|-------------|
| Header 1    | `text-[34px] font-bold font-[Nutmeg]`       | 34px  | 700    | 1.171875em  |
| Header 2    | `text-[26px] font-bold font-[Nutmeg]`       | 26px  | 700    | 1.171875em  |
| Header 3    | `text-[22px] font-bold font-[Nutmeg]`       | 22px  | 700    | 1.171875em  |
| Header 4    | `text-xl font-bold font-[Nutmeg]`           | 20px  | 700    | 1.171875em  |
| Header 5    | `text-base font-bold font-[Nutmeg]`         | 16px  | 700    | 1.171875em  |
| Header 6    | `text-[15px] font-bold font-[Nutmeg]`       | 15px  | 700    | 1.171875em  |
| Paragraph   | `text-sm font-normal`                        | 14px  | 400    | 1.171875em  |

## Color Palette with Tailwind

### Blue Color Scale
| Color Name      | Hex       | Tailwind Class              | Usage                    |
|-----------------|-----------|----------------------------|--------------------------|
| Blue 50         | #E7F5FE   | `bg-blue-50` `text-blue-50`    | Lightest blue accent     |
| Blue 100        | #B8E2FB   | `bg-blue-100` `text-blue-100`  | Light blue backgrounds   |
| Blue 200        | #88CFF8   | `bg-blue-200` `text-blue-200`  | Medium light blue        |
| Blue 300        | #59BCF5   | `bg-blue-300` `text-blue-300`  | Medium blue              |
| Blue 400        | #2AA9F2   | `bg-blue-400` `text-blue-400`  | Medium-strong blue       |
| Blue 500        | #0F82EB   | `bg-primary` `text-primary`    | **Primary blue**         |
| Blue 600        | #0085D7   | `bg-blue-600` `text-blue-600`  | Strong blue              |
| Blue 700        | #0053A4   | `bg-blue-700` `text-blue-700`  | Dark blue                |
| Blue 800        | #002072   | `bg-blue-800` `text-blue-800`  | Very dark blue           |
| Blue 900        | #00003F   | `bg-background` `text-blue-900`| Deepest blue/background  |

### Additional Colors
| Color Name      | Hex       | Tailwind Class              | Usage                    |
|-----------------|-----------|----------------------------|--------------------------|
| White           | #FFFFFF   | `bg-white` `text-white`    | White text/backgrounds   |
| Black           | #000000   | `bg-black` `text-black`    | Black text               |
| Red             | #E70E0E   | `bg-red` `text-red`        | Error/Alert states       |

### Key Tailwind Color Classes
- **Background**: `bg-background` (Blue 900)
- **Primary**: `bg-primary` / `text-primary` (Blue 500)
- **White**: `bg-white` / `text-white`
- **Red**: `bg-red` / `text-red` (for errors/alerts)

## Logo Variations
The portfolio includes two logo variations:
1. **Logo White** - For use on dark backgrounds
2. **Logo Blue** - For use on light backgrounds

Both logos follow the same design but with different color treatments to ensure optimal contrast and visibility.

## Layout & Spacing with Tailwind

### Border Radius
```typescript
// Tailwind classes
rounded-sm     // calc(var(--radius) - 4px)
rounded-md     // calc(var(--radius) - 2px)
rounded-lg     // var(--radius) = 0.625rem
rounded-xl     // calc(var(--radius) + 4px)
```

### Responsive Design Examples
```typescript
// Mobile-first responsive text
<h1 className="text-[34px] md:text-[64px]">

// Responsive spacing
<div className="px-4 md:px-8 lg:px-16">

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

## Animations with Tailwind
```typescript
// Custom animation utilities (defined in globals.css)
<div className="animate-float">
<div className="animate-pulse-scale">

// Respect motion preferences
@media (prefers-reduced-motion: reduce) {
  // Animations disabled
}
```

## Component Styling Examples

### Card with Shadow
```typescript
<div className="bg-white rounded-lg shadow-[0px_0px_24px_0px_rgba(95,109,126,0.15)]">
  // Card content
</div>
```

### Primary Button
```typescript
<button className="bg-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 transition-colors">
  Click Me
</button>
```

### Responsive Header
```typescript
<h1 className="text-[34px] md:text-[64px] font-bold font-[Nutmeg] text-white">
  Etan Heyman
</h1>
```

## Tailwind Configuration
Colors are defined as CSS custom properties in `globals.css` and exposed to Tailwind through the `@theme` directive:

```css
@theme {
  --color-background: #00003f;
  --color-blue-50: #e7f5fe;
  --color-blue-100: #b8e2fb;
  // ... etc
}
```

## Usage Guidelines
1. **Always use Tailwind classes** instead of inline styles
2. **Mobile-first approach**: Start with mobile styles, add desktop with `md:`, `lg:`, etc.
3. **Use semantic color names**: `bg-primary` instead of `bg-blue-500`
4. **Consistent spacing**: Use Tailwind's spacing scale (4, 8, 16, etc.)
5. **Typography**: Always use the predefined text sizes and font families