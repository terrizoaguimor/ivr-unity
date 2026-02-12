/**
 * Chart Library - Unity Financial Network
 * Centralized exports for chart configuration system
 */

// Configuration
export {
  chartColors,
  gradientPresets,
  animationConfig,
  chartDimensions,
  strokeConfig,
  markerConfig,
  gridConfig,
  toolbarConfig,
  zoomConfig,
  selectionConfig,
  chartResponsiveBreakpoints,
  colorSeries,
  type GradientPreset,
  type ColorSeries,
  type ChartDimension,
} from './config';

// Theme
export {
  getChartTheme,
  getTooltipTheme,
  getLegendTheme,
  getAxisTheme,
  getGridTheme,
  themeColors,
} from './theme';

// Presets
export {
  createAreaChartOptions,
  createBarChartOptions,
  createLineChartOptions,
  createDonutChartOptions,
  createRadialChartOptions,
  createSparklineOptions,
  createHeatmapOptions,
  createTreemapOptions,
  createMixedChartOptions,
} from './presets';
