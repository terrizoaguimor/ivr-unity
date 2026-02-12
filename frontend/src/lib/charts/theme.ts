/**
 * Chart Theme - Unity Financial Network
 * Theme-aware chart styling for light and dark modes
 */

import { ApexOptions } from 'apexcharts';
import { chartColors } from './config';

/**
 * Generate theme-aware ApexChart options
 */
export function getChartTheme(isDarkMode: boolean): Partial<ApexOptions> {
  return {
    theme: {
      mode: isDarkMode ? 'dark' : 'light',
    },
    chart: {
      background: 'transparent',
      foreColor: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[500],
      fontFamily: 'Poppins, sans-serif',
    },
    grid: {
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.gray[200],
      strokeDashArray: 4,
    },
    tooltip: {
      theme: isDarkMode ? 'dark' : 'light',
      cssClass: 'glass-tooltip',
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
      },
      x: {
        show: true,
      },
      marker: {
        show: true,
      },
    },
    xaxis: {
      labels: {
        style: {
          colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    legend: {
      labels: {
        colors: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[700],
      },
      fontFamily: 'Poppins, sans-serif',
      fontSize: '13px',
      markers: {
        offsetX: -4,
      },
    },
    dataLabels: {
      style: {
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        filter: {
          type: 'darken',
        },
      },
    },
  };
}

/**
 * Get tooltip theme configuration
 */
export function getTooltipTheme(isDarkMode: boolean): ApexOptions['tooltip'] {
  return {
    enabled: true,
    theme: isDarkMode ? 'dark' : 'light',
    cssClass: 'glass-tooltip',
    fillSeriesColor: false,
    style: {
      fontSize: '12px',
      fontFamily: 'Poppins, sans-serif',
    },
    onDatasetHover: {
      highlightDataSeries: true,
    },
    x: {
      show: true,
      format: 'dd MMM yyyy',
    },
    y: {
      formatter: (value: number) => {
        if (value >= 1000000) {
          return `${(value / 1000000).toFixed(1)}M`;
        }
        if (value >= 1000) {
          return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toFixed(0);
      },
    },
    marker: {
      show: true,
    },
  };
}

/**
 * Get legend theme configuration
 */
export function getLegendTheme(isDarkMode: boolean, position: 'top' | 'bottom' | 'left' | 'right' = 'top'): ApexOptions['legend'] {
  return {
    show: true,
    position,
    horizontalAlign: position === 'top' || position === 'bottom' ? 'left' : 'center',
    labels: {
      colors: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[700],
    },
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13px',
    markers: {
      size: 6,
      offsetX: -4,
    },
    itemMargin: {
      horizontal: 12,
      vertical: 4,
    },
  };
}

/**
 * Get axis theme configuration
 */
export function getAxisTheme(isDarkMode: boolean): {
  xaxis: ApexOptions['xaxis'];
  yaxis: ApexOptions['yaxis'];
} {
  const labelStyle = {
    colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
    fontSize: '12px',
    fontFamily: 'Poppins, sans-serif',
  };

  return {
    xaxis: {
      labels: {
        style: labelStyle,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      crosshairs: {
        show: true,
        stroke: {
          color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : chartColors.gray[300],
          width: 1,
          dashArray: 4,
        },
      },
    },
    yaxis: {
      labels: {
        style: labelStyle,
        formatter: (value: number) => {
          if (typeof value !== 'number') return String(value);
          if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
          if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
          return value.toFixed(0);
        },
      },
    },
  };
}

/**
 * Get grid theme configuration
 */
export function getGridTheme(isDarkMode: boolean, showHorizontal = true, showVertical = false): ApexOptions['grid'] {
  return {
    show: showHorizontal || showVertical,
    borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.gray[200],
    strokeDashArray: 4,
    xaxis: {
      lines: {
        show: showVertical,
      },
    },
    yaxis: {
      lines: {
        show: showHorizontal,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  };
}

/**
 * Color utilities for theme
 */
export const themeColors = {
  getTextPrimary: (isDark: boolean) =>
    isDark ? 'rgba(255, 255, 255, 0.9)' : chartColors.gray[900],
  getTextSecondary: (isDark: boolean) =>
    isDark ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[700],
  getTextMuted: (isDark: boolean) =>
    isDark ? 'rgba(255, 255, 255, 0.5)' : chartColors.gray[500],
  getBorder: (isDark: boolean) =>
    isDark ? 'rgba(255, 255, 255, 0.08)' : chartColors.gray[200],
  getBackground: (isDark: boolean) =>
    isDark ? 'rgba(26, 34, 49, 0.7)' : 'rgba(255, 255, 255, 0.7)',
};
