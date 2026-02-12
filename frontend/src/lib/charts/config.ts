/**
 * Chart Configuration - Unity Financial Network
 * Central configuration for colors, gradients, and animations
 */

// Brand color palette extended for charts
export const chartColors = {
  primary: {
    500: '#512783',
    400: '#9a6fc3',
    300: '#b899d6',
    200: '#d3c2e7',
    100: '#e9e0f3',
    50: '#f4f0f9',
  },
  accent: {
    500: '#f18918',
    400: '#f89c3d',
    300: '#ffaf6b',
    200: '#ffcfa3',
    100: '#ffe8d1',
  },
  success: {
    500: '#12b76a',
    400: '#32d583',
    300: '#6ce9a6',
    200: '#a6f4c5',
    100: '#d1fadf',
  },
  error: {
    500: '#f04438',
    400: '#f97066',
    300: '#fda29b',
    200: '#fecdca',
    100: '#fee4e2',
  },
  warning: {
    500: '#f79009',
    400: '#fdb022',
    300: '#fec84b',
    200: '#fedf89',
    100: '#fef0c7',
  },
  gray: {
    900: '#101828',
    800: '#1d2939',
    700: '#344054',
    600: '#475467',
    500: '#667085',
    400: '#98a2b3',
    300: '#d0d5dd',
    200: '#e4e7ec',
    100: '#f2f4f7',
  },
} as const;

// Gradient presets for different visual effects
export const gradientPresets = {
  // Premium gradient - rich depth with brand colors
  premium: {
    opacityFrom: 0.65,
    opacityTo: 0.05,
    stops: [0, 90, 100],
    colorStops: (baseColor: string, lightColor: string) => [
      { offset: 0, color: baseColor, opacity: 0.65 },
      { offset: 50, color: lightColor, opacity: 0.35 },
      { offset: 100, color: lightColor, opacity: 0.05 },
    ],
  },
  // Subtle gradient - minimal effect
  subtle: {
    opacityFrom: 0.45,
    opacityTo: 0,
    stops: [0, 100],
  },
  // Vibrant gradient - high contrast
  vibrant: {
    opacityFrom: 0.8,
    opacityTo: 0.1,
    stops: [0, 70, 100],
  },
  // Glow gradient - for highlighting
  glow: {
    opacityFrom: 0.7,
    opacityTo: 0.15,
    stops: [0, 50, 100],
  },
  // Solid - no gradient, flat color
  solid: {
    opacityFrom: 1,
    opacityTo: 1,
    stops: [0, 100],
  },
} as const;

// Animation configurations
export const animationConfig = {
  enabled: {
    animateGradually: {
      enabled: true,
      delay: 150,
    },
    dynamicAnimation: {
      enabled: true,
      speed: 350,
    },
  },
  disabled: {
    animateGradually: {
      enabled: false,
      delay: 0,
    },
    dynamicAnimation: {
      enabled: false,
      speed: 0,
    },
  },
} as const;

// Chart dimension defaults
export const chartDimensions = {
  sparkline: { height: 50 },
  compact: { height: 180 },
  default: { height: 310 },
  tall: { height: 400 },
  gauge: { height: 200 },
} as const;

// Stroke configurations
export const strokeConfig = {
  thin: { width: 1.5, curve: 'smooth' as const },
  default: { width: 2, curve: 'smooth' as const },
  thick: { width: 3, curve: 'smooth' as const },
  straight: { width: 2, curve: 'straight' as const },
  stepped: { width: 2, curve: 'stepline' as const },
} as const;

// Marker configurations
export const markerConfig = {
  hidden: { size: 0 },
  small: { size: 3, strokeWidth: 2, hover: { size: 5 } },
  default: { size: 4, strokeWidth: 2, hover: { size: 6 } },
  large: { size: 6, strokeWidth: 3, hover: { size: 8 } },
  glow: {
    size: 5,
    strokeWidth: 2,
    hover: { size: 8 },
    cssClass: 'chart-marker-glow',
  },
} as const;

// Grid configurations
export const gridConfig = {
  hidden: {
    show: false,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: false } },
  },
  horizontal: {
    show: true,
    xaxis: { lines: { show: false } },
    yaxis: { lines: { show: true } },
  },
  vertical: {
    show: true,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: false } },
  },
  both: {
    show: true,
    xaxis: { lines: { show: true } },
    yaxis: { lines: { show: true } },
  },
} as const;

// Toolbar configurations
export const toolbarConfig = {
  hidden: { show: false },
  minimal: {
    show: true,
    tools: {
      download: false,
      selection: false,
      zoom: true,
      zoomin: true,
      zoomout: true,
      pan: false,
      reset: true,
    },
  },
  full: {
    show: true,
    tools: {
      download: true,
      selection: true,
      zoom: true,
      zoomin: true,
      zoomout: true,
      pan: true,
      reset: true,
    },
  },
} as const;

// Zoom configurations
export const zoomConfig = {
  disabled: { enabled: false },
  horizontal: {
    enabled: true,
    type: 'x' as const,
    autoScaleYaxis: true,
    zoomedArea: {
      fill: { color: chartColors.primary[500], opacity: 0.1 },
      stroke: { color: chartColors.primary[500], width: 1 },
    },
  },
  bidirectional: {
    enabled: true,
    type: 'xy' as const,
    autoScaleYaxis: true,
    zoomedArea: {
      fill: { color: chartColors.primary[500], opacity: 0.1 },
      stroke: { color: chartColors.primary[500], width: 1 },
    },
  },
} as const;

// Selection/brush configurations
export const selectionConfig = {
  disabled: { enabled: false },
  enabled: {
    enabled: true,
    type: 'x' as const,
    fill: { color: chartColors.accent[500], opacity: 0.15 },
    stroke: { color: chartColors.accent[500], width: 1 },
  },
} as const;

// Responsive breakpoints for charts
export const chartResponsiveBreakpoints = [
  {
    breakpoint: 480,
    options: {
      chart: { height: 250 },
      legend: { position: 'bottom' as const },
    },
  },
  {
    breakpoint: 768,
    options: {
      chart: { height: 280 },
    },
  },
  {
    breakpoint: 1024,
    options: {
      chart: { height: 310 },
    },
  },
] as const;

// Color series presets
export const colorSeries = {
  primary: [chartColors.primary[500], chartColors.primary[300]],
  accent: [chartColors.accent[500], chartColors.accent[300]],
  mixed: [chartColors.primary[500], chartColors.accent[500], chartColors.success[500]],
  rainbow: [
    chartColors.primary[500],
    chartColors.accent[500],
    chartColors.success[500],
    chartColors.warning[500],
    chartColors.error[500],
  ],
  monochrome: [
    chartColors.primary[500],
    chartColors.primary[400],
    chartColors.primary[300],
    chartColors.primary[200],
    chartColors.primary[100],
  ],
} as const;

export type GradientPreset = keyof typeof gradientPresets;
export type ColorSeries = keyof typeof colorSeries;
export type ChartDimension = keyof typeof chartDimensions;
