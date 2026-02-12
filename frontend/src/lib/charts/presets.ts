/**
 * Chart Presets - Unity Financial Network
 * Factory functions for creating ApexChart configurations
 */

import { ApexOptions } from 'apexcharts';
import {
  chartColors,
  gradientPresets,
  markerConfig,
  gridConfig,
  toolbarConfig,
  zoomConfig,
  chartDimensions,
  colorSeries,
  type GradientPreset,
  type ColorSeries,
} from './config';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface BaseChartConfig {
  colors?: string[];
  colorPreset?: ColorSeries;
  height?: number;
  showToolbar?: boolean;
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
}

interface AreaChartConfig extends BaseChartConfig {
  gradient?: GradientPreset;
  strokeWidth?: number;
  strokeCurve?: 'smooth' | 'straight' | 'stepline';
  showMarkers?: boolean;
  enableZoom?: boolean;
  stacked?: boolean;
}

interface BarChartConfig extends BaseChartConfig {
  horizontal?: boolean;
  stacked?: boolean;
  columnWidth?: string;
  borderRadius?: number;
  gradient?: GradientPreset;
  enableZoom?: boolean;
}

interface DonutChartConfig extends BaseChartConfig {
  donutSize?: string;
  showLabels?: boolean;
  showTotal?: boolean;
  totalLabel?: string;
}

interface RadialChartConfig extends BaseChartConfig {
  startAngle?: number;
  endAngle?: number;
  hollow?: number;
  trackBackground?: string;
  showValue?: boolean;
}

interface SparklineConfig {
  color?: string;
  type?: 'line' | 'area' | 'bar';
  height?: number;
  strokeWidth?: number;
}

interface HeatmapConfig extends BaseChartConfig {
  colorRange?: { from: number; to: number; color: string; name?: string }[];
  distributed?: boolean;
  enableShades?: boolean;
}

interface TreemapConfig extends BaseChartConfig {
  distributed?: boolean;
  enableShades?: boolean;
  shadeIntensity?: number;
}

// ─────────────────────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────────────────────

function getColors(config: BaseChartConfig): string[] {
  if (config.colors) return config.colors;
  if (config.colorPreset) return [...colorSeries[config.colorPreset]] as string[];
  return [...colorSeries.primary] as string[];
}

function getGradientFill(preset: GradientPreset = 'premium', colors: string[]): ApexOptions['fill'] {
  const gradient = gradientPresets[preset];

  return {
    type: 'gradient',
    gradient: {
      shade: 'dark',
      type: 'vertical',
      shadeIntensity: 0.5,
      gradientToColors: colors.length > 1 ? [colors[1]] : [chartColors.primary[200]],
      opacityFrom: gradient.opacityFrom,
      opacityTo: gradient.opacityTo,
      stops: [...gradient.stops],
    },
  };
}

// ─────────────────────────────────────────────────────────────
// Chart Preset Functions
// ─────────────────────────────────────────────────────────────

/**
 * Create Area Chart Options
 */
export function createAreaChartOptions(config: AreaChartConfig = {}): ApexOptions {
  const colors = getColors(config);
  const {
    gradient = 'premium',
    strokeWidth = 2,
    strokeCurve = 'smooth',
    showMarkers = false,
    enableZoom = false,
    stacked = false,
    height = chartDimensions.default.height,
    showToolbar = false,
    showLegend = false,
    legendPosition = 'top',
  } = config;

  return {
    chart: {
      type: 'area',
      height,
      fontFamily: 'Poppins, sans-serif',
      toolbar: showToolbar ? toolbarConfig.minimal : toolbarConfig.hidden,
      zoom: enableZoom ? zoomConfig.horizontal : zoomConfig.disabled,
      stacked,
      animations: {
        enabled: true,
        speed: 350,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    colors,
    fill: getGradientFill(gradient, colors),
    stroke: {
      curve: strokeCurve,
      width: strokeWidth,
    },
    markers: showMarkers ? markerConfig.default : markerConfig.hidden,
    grid: gridConfig.horizontal,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: showLegend,
      position: legendPosition,
      horizontalAlign: 'left',
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: undefined },
    },
  };
}

/**
 * Create Bar Chart Options
 */
export function createBarChartOptions(config: BarChartConfig = {}): ApexOptions {
  const colors = getColors(config);
  const {
    horizontal = false,
    stacked = false,
    columnWidth = '50%',
    borderRadius = 6,
    gradient = 'subtle',
    enableZoom = false,
    height = chartDimensions.default.height,
    showToolbar = false,
    showLegend = false,
    legendPosition = 'top',
  } = config;

  return {
    chart: {
      type: 'bar',
      height,
      fontFamily: 'Poppins, sans-serif',
      toolbar: showToolbar ? toolbarConfig.minimal : toolbarConfig.hidden,
      zoom: enableZoom ? zoomConfig.horizontal : zoomConfig.disabled,
      stacked,
      animations: {
        enabled: true,
        speed: 350,
      },
    },
    colors,
    plotOptions: {
      bar: {
        horizontal,
        columnWidth,
        borderRadius,
        borderRadiusApplication: 'end',
        dataLabels: {
          position: 'top',
        },
      },
    },
    fill: gradient === 'solid' ? { opacity: 1 } : getGradientFill(gradient, colors),
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    grid: gridConfig.horizontal,
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: showLegend,
      position: legendPosition,
      horizontalAlign: 'left',
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      title: { text: undefined },
    },
  };
}

/**
 * Create Line Chart Options
 */
export function createLineChartOptions(config: AreaChartConfig = {}): ApexOptions {
  const baseOptions = createAreaChartOptions(config);

  return {
    ...baseOptions,
    chart: {
      ...baseOptions.chart,
      type: 'line',
    },
    fill: {
      type: 'solid',
      opacity: 1,
    },
    markers: config.showMarkers ? markerConfig.glow : markerConfig.default,
  };
}

/**
 * Create Donut Chart Options
 */
export function createDonutChartOptions(config: DonutChartConfig = {}): ApexOptions {
  const colors = getColors(config);
  const {
    donutSize = '65%',
    showLabels = true,
    showTotal = true,
    totalLabel = 'Total',
    height = chartDimensions.default.height,
    showLegend = true,
    legendPosition = 'bottom',
  } = config;

  return {
    chart: {
      type: 'donut',
      height,
      fontFamily: 'Poppins, sans-serif',
      animations: {
        enabled: true,
        speed: 500,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    colors,
    plotOptions: {
      pie: {
        donut: {
          size: donutSize,
          labels: {
            show: showLabels,
            name: {
              show: true,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '24px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 600,
              offsetY: 5,
              formatter: (val) => String(val),
            },
            total: {
              show: showTotal,
              showAlways: true,
              label: totalLabel,
              fontSize: '14px',
              fontFamily: 'Poppins, sans-serif',
              fontWeight: 500,
              formatter: (w) => {
                const total = w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
                return total.toLocaleString();
              },
            },
          },
        },
      },
    },
    stroke: {
      width: 0,
    },
    legend: {
      show: showLegend,
      position: legendPosition,
      horizontalAlign: 'center',
      markers: {
        size: 8,
        shape: 'circle',
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: { height: 280 },
          legend: { position: 'bottom' },
        },
      },
    ],
  };
}

/**
 * Create Radial Bar (Gauge) Options
 */
export function createRadialChartOptions(config: RadialChartConfig = {}): ApexOptions {
  const colors = getColors(config);
  const {
    startAngle = -135,
    endAngle = 135,
    hollow = 65,
    trackBackground = chartColors.gray[100],
    showValue = true,
    height = chartDimensions.gauge.height,
  } = config;

  return {
    chart: {
      type: 'radialBar',
      height,
      fontFamily: 'Poppins, sans-serif',
      animations: {
        enabled: true,
        speed: 800,
      },
    },
    colors,
    plotOptions: {
      radialBar: {
        startAngle,
        endAngle,
        hollow: {
          size: `${hollow}%`,
          background: 'transparent',
        },
        track: {
          background: trackBackground,
          strokeWidth: '100%',
          margin: 0,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            blur: 4,
            opacity: 0.1,
          },
        },
        dataLabels: {
          show: showValue,
          name: {
            show: true,
            fontSize: '14px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 500,
            offsetY: -10,
          },
          value: {
            show: true,
            fontSize: '32px',
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 600,
            offsetY: 5,
            formatter: (val) => `${val}%`,
          },
        },
      },
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'dark',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: [chartColors.primary[300]],
        stops: [0, 100],
      },
    },
    stroke: {
      lineCap: 'round',
    },
  };
}

/**
 * Create Sparkline Options
 */
export function createSparklineOptions(config: SparklineConfig = {}): ApexOptions {
  const {
    color = chartColors.primary[500],
    type = 'area',
    height = chartDimensions.sparkline.height,
    strokeWidth = 2,
  } = config;

  const baseOptions: ApexOptions = {
    chart: {
      type,
      height,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 300,
      },
    },
    colors: [color],
    stroke: {
      curve: 'smooth',
      width: strokeWidth,
    },
    tooltip: {
      enabled: false,
    },
  };

  if (type === 'area') {
    baseOptions.fill = {
      type: 'gradient',
      gradient: {
        opacityFrom: 0.5,
        opacityTo: 0,
      },
    };
  }

  if (type === 'bar') {
    baseOptions.plotOptions = {
      bar: {
        columnWidth: '60%',
        borderRadius: 2,
      },
    };
  }

  return baseOptions;
}

/**
 * Create Heatmap Options
 */
export function createHeatmapOptions(config: HeatmapConfig = {}): ApexOptions {
  const {
    colorRange = [
      { from: 0, to: 20, color: chartColors.primary[100], name: 'Low' },
      { from: 21, to: 50, color: chartColors.primary[300], name: 'Medium' },
      { from: 51, to: 80, color: chartColors.primary[400], name: 'High' },
      { from: 81, to: 100, color: chartColors.primary[500], name: 'Very High' },
    ],
    distributed = false,
    enableShades = true,
    height = chartDimensions.default.height,
    showLegend = true,
  } = config;

  return {
    chart: {
      type: 'heatmap',
      height,
      fontFamily: 'Poppins, sans-serif',
      toolbar: toolbarConfig.hidden,
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        colorScale: {
          ranges: colorRange,
        },
        distributed,
        enableShades,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: showLegend,
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
  };
}

/**
 * Create Treemap Options
 */
export function createTreemapOptions(config: TreemapConfig = {}): ApexOptions {
  const colors = getColors(config);
  const {
    distributed = true,
    enableShades = true,
    shadeIntensity = 0.5,
    height = chartDimensions.default.height,
    showLegend = false,
  } = config;

  return {
    chart: {
      type: 'treemap',
      height,
      fontFamily: 'Poppins, sans-serif',
      toolbar: toolbarConfig.hidden,
      animations: {
        enabled: true,
        speed: 500,
      },
    },
    colors,
    plotOptions: {
      treemap: {
        distributed,
        enableShades,
        shadeIntensity,
      },
    },
    legend: {
      show: showLegend,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
      },
      formatter: (text, op) => {
        return [text, op.value];
      },
      offsetY: -4,
    },
    stroke: {
      width: 2,
      colors: ['#fff'],
    },
  };
}

/**
 * Create Mixed Chart Options (Bar + Line)
 */
export function createMixedChartOptions(config: BaseChartConfig = {}): ApexOptions {
  const colors = config.colors || [chartColors.primary[500], chartColors.accent[500]];
  const {
    height = chartDimensions.default.height,
    showToolbar = false,
    showLegend = true,
    legendPosition = 'top',
  } = config;

  return {
    chart: {
      type: 'line',
      height,
      fontFamily: 'Poppins, sans-serif',
      toolbar: showToolbar ? toolbarConfig.minimal : toolbarConfig.hidden,
      animations: {
        enabled: true,
        speed: 350,
      },
    },
    colors,
    stroke: {
      width: [0, 3],
      curve: 'smooth',
    },
    plotOptions: {
      bar: {
        columnWidth: '50%',
        borderRadius: 6,
      },
    },
    fill: {
      opacity: [0.85, 1],
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.4,
        opacityFrom: 0.9,
        opacityTo: 0.6,
      },
    },
    markers: {
      size: [0, 4],
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: gridConfig.horizontal,
    legend: {
      show: showLegend,
      position: legendPosition,
      horizontalAlign: 'left',
    },
    xaxis: {
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: [
      {
        title: { text: undefined },
      },
      {
        opposite: true,
        title: { text: undefined },
      },
    ],
    dataLabels: {
      enabled: false,
    },
  };
}
