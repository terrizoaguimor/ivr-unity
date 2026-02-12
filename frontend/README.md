# Unity Financial Network - Dashboard v1.0.0

Modern, responsive financial dashboard built with React 19, TypeScript, Tailwind CSS 4, and a premium glassmorphism design system. Crafted by the **Unity Team** for enterprise-grade financial applications.

## Overview

Unity Financial Network is a comprehensive dashboard platform designed for financial institutions, fintech companies, and enterprise applications. It features a stunning glassmorphism UI, premium chart visualizations, and a fully responsive design that works flawlessly across all devices.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.x | UI Framework |
| TypeScript | 5.x | Type Safety |
| Vite | 6.x | Build Tool & Dev Server |
| Tailwind CSS | 4.x | Utility-First CSS |
| ApexCharts | 4.x | Data Visualization |
| Framer Motion | 11.x | Animations |
| React Router | 7.x | Navigation |

## Features

### Design System

#### Glassmorphism UI
- **Three-tier glass effects**: `glass-panel` (deepest), `glass-card` (medium), `glass-element` (surface)
- **Brand-tinted surfaces**: Purple (#512783) primary, Orange (#f18918) accent
- **Backdrop blur**: Layered blur effects with performance optimization
- **Premium shadows**: Combination of outer shadows and inner highlights for depth
- **Dark mode support**: Full theme adaptation with glass effects

#### Brand Colors
```
Primary Purple: #512783
Accent Orange:  #f18918
Success:        #12b76a
Error:          #f04438
Warning:        #f79009
```

### Responsive Design

- **Mobile-first approach**: Optimized for all screen sizes (320px to 2560px+)
- **Fluid typography**: `clamp()` based font scaling
- **Intrinsic layouts**: CSS Grid with `auto-fit`/`minmax` for automatic adaptation
- **Container queries**: Component-level responsiveness
- **Touch-friendly**: 44px minimum tap targets on mobile

### Premium Chart System

#### Chart Configuration Library (`/src/lib/charts/`)
Centralized chart configuration system with:
- **Theme-aware styling**: Automatic light/dark mode adaptation
- **Gradient presets**: Premium, subtle, vibrant, glow, solid
- **Animation support**: Entry animations with reduced motion respect
- **Consistent branding**: Brand colors and typography across all charts

#### Chart Types
| Type | Description |
|------|-------------|
| Area Charts | Smooth curves with premium gradient fills |
| Bar Charts | Vertical/horizontal with gradient fills |
| Line Charts | Multi-series with glow markers |
| Donut/Pie | Interactive segments with glass tooltips |
| Radial/Gauge | Animated progress indicators |
| Sparklines | Compact inline charts for KPIs |
| Heatmaps | Activity visualization (GitHub-style) |
| Treemaps | Hierarchical data display |
| Mixed (Bar+Line) | Dual Y-axis combined charts |

#### Chart Features
- **Glass tooltips**: Glassmorphism styled tooltips
- **Entry animations**: Fade-up, scale, slide with stagger support
- **Zoom & pan**: Interactive exploration for time series
- **Data point clicks**: Drill-down capability
- **Lazy loading**: Code-split heavy chart types

### Dashboard Modules

#### E-commerce Dashboard
- Revenue analytics
- Sales performance charts
- Monthly targets with radial gauges
- Product statistics

#### Analytics Dashboard
- User activity tracking
- Session analytics
- Real-time metrics
- Traffic sources

#### Marketing Dashboard
- Campaign performance
- Lead conversion rates
- ROI tracking
- Engagement metrics

#### CRM Dashboard
- Customer pipeline
- Deal tracking
- Contact management
- Activity timeline

#### Additional Dashboards
- **Stocks**: Market data visualization
- **SaaS**: Subscription metrics
- **Logistics**: Delivery tracking
- **Support**: Ticket management

### UI Components

#### Core Components
- Buttons (primary, secondary, ghost, glass variants)
- Form inputs with glass focus states
- Dropdowns and select menus
- Modals with backdrop blur
- Toast notifications
- Data tables with sorting/filtering
- Cards and panels

#### Advanced Components
- Calendar with drag-and-drop
- File manager
- Chat interface
- Email client
- Invoice generator
- AI assistant suite

## Project Structure

```
src/
├── components/
│   ├── charts/           # Chart components
│   │   ├── shared/       # ChartWrapper, skeleton, error states
│   │   ├── line/         # Line/area charts
│   │   ├── bar/          # Bar charts
│   │   ├── pie/          # Pie/donut charts
│   │   ├── sparkline/    # Sparkline & SparklineMetric
│   │   ├── gauge/        # AnimatedGauge & GaugeCluster
│   │   ├── heatmap/      # ActivityHeatmap
│   │   ├── mixed/        # BarLineCombo
│   │   └── LazyChart.tsx # Lazy loading wrappers
│   ├── analytics/        # Analytics dashboard components
│   ├── ecommerce/        # E-commerce components
│   ├── crm/              # CRM components
│   ├── marketing/        # Marketing components
│   └── ui/               # Base UI components
├── hooks/
│   ├── useChartTheme.ts      # Chart theme hook
│   ├── useChartInteraction.ts # Zoom/pan/selection hook
│   └── useMediaQuery.ts      # Responsive utilities
├── lib/
│   └── charts/
│       ├── config.ts     # Colors, gradients, presets
│       ├── theme.ts      # Light/dark theme functions
│       ├── presets.ts    # Chart option factories
│       └── index.ts      # Barrel exports
├── context/
│   └── ThemeContext.tsx  # Dark mode provider
├── pages/                # Route pages
├── styles/               # Global styles
└── utils/                # Utility functions
```

## Installation

### Prerequisites
- Node.js 18.x or later (20.x+ recommended)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unity-frontend-v1.0.0
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```
   > Use `--legacy-peer-deps` if you encounter peer dependency errors.

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

## Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
# API Configuration
VITE_API_URL=https://api.example.com

# Feature Flags
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_AI_FEATURES=true
```

### Theme Customization

The glassmorphism design system uses CSS custom properties defined in `/src/index.css`:

```css
:root {
  /* Glass backgrounds */
  --glass-bg-light: rgba(255, 255, 255, 0.12);
  --glass-bg-medium: rgba(255, 255, 255, 0.18);
  --glass-bg-heavy: rgba(255, 255, 255, 0.25);

  /* Blur values */
  --blur-glass-sm: 8px;
  --blur-glass-md: 16px;
  --blur-glass-lg: 24px;

  /* Brand colors */
  --brand-purple-500: #512783;
  --brand-orange-500: #f18918;
}
```

## Usage Examples

### Using Chart Components

```tsx
import { LineChartOne } from '@/components/charts/line/LineChartOne';
import { AnimatedGauge } from '@/components/charts/gauge/AnimatedGauge';
import { Sparkline } from '@/components/charts/sparkline/Sparkline';

// Area chart with premium gradients
<LineChartOne />

// Animated gauge with thresholds
<AnimatedGauge
  value={75}
  max={100}
  label="Performance"
  thresholds={{ warning: 60, danger: 30 }}
/>

// Inline sparkline
<Sparkline
  data={[10, 20, 15, 30, 25, 40]}
  variant="area"
  color="#512783"
/>
```

### Using Chart Hooks

```tsx
import { useChartTheme } from '@/hooks/useChartTheme';
import { useChartInteraction } from '@/hooks/useChartInteraction';

function MyChart() {
  const { isDarkMode, prefersReducedMotion, mergeWithTheme } = useChartTheme();
  const { events, zoomConfig, resetZoom } = useChartInteraction({
    enableZoom: true,
    onDataPointClick: (point) => console.log(point),
  });

  const options = mergeWithTheme({
    // your chart options
  });

  return <Chart options={options} series={series} />;
}
```

### Using Glass Components

```tsx
// Glass card
<div className="glass-card p-6 rounded-2xl">
  <h3>Revenue</h3>
  <p className="text-2xl font-bold">$124,500</p>
</div>

// Glass panel (deeper blur)
<aside className="glass-panel h-screen">
  <nav>...</nav>
</aside>

// Glass button
<button className="glass-element px-4 py-2 rounded-lg hover:bg-white/10">
  Click me
</button>
```

## Performance

### Optimizations Implemented
- **Code splitting**: Lazy loading for heavy chart components
- **Memoization**: `useMemo` for chart options to prevent re-renders
- **Reduced motion**: Respects `prefers-reduced-motion` preference
- **Blur budget**: Limited concurrent blurred surfaces (~8-10 max)
- **Tree shaking**: Only imports used chart types

### Bundle Size
- CSS: ~184 KB (gzipped: ~31 KB)
- JS: ~3.5 MB (gzipped: ~870 KB)

> Note: Large bundle includes all dashboard modules. Consider code-splitting for production.

## Browser Support

| Browser | Version |
|---------|---------|
| Chrome | 90+ |
| Firefox | 90+ |
| Safari | 15+ |
| Edge | 90+ |

Glassmorphism effects require `backdrop-filter` support.

## Accessibility

- WCAG 2.1 AA compliant color contrast
- Keyboard navigation support
- Screen reader friendly
- Reduced motion support
- Focus visible indicators

## Development

### Code Style
- ESLint for linting
- Prettier for formatting
- TypeScript strict mode

### Commands
```bash
npm run dev       # Start dev server
npm run build     # Production build
npm run preview   # Preview build
npm run lint      # Run ESLint
npm run typecheck # TypeScript check
```

## Changelog

### Version 1.0.0 - February 2026

#### Unity Team Release
- Complete glassmorphism design system implementation
- Premium chart system with 9 chart types
- Responsive design with fluid typography
- Dark mode with glass effects
- 6 dashboard variants (E-commerce, Analytics, Marketing, CRM, Stocks, SaaS)
- Advanced chart features (zoom, pan, animations, glass tooltips)
- Lazy loading for performance optimization
- Accessibility improvements

#### Chart System
- Centralized configuration (`/src/lib/charts/`)
- Theme-aware styling
- Animation presets with reduced motion support
- New components: Sparkline, AnimatedGauge, ActivityHeatmap, BarLineCombo

#### Components Updated
- LineChartOne: Premium gradients, glass tooltips
- BarChartOne: Vibrant gradients, hover states
- MonthlyTarget: Gradient fill, glow effect

## License

Proprietary - Unity Financial Network. All rights reserved.

## Team

Developed by the **Unity Team** for enterprise financial applications.

---

**Unity Financial Network** - Empowering Financial Excellence
