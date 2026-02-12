/**
 * BarLineCombo Component
 * Combined bar and line chart with dual Y-axis support
 */

import { useMemo } from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import { useChartTheme } from '../../../hooks/useChartTheme';
import { useChartInteraction } from '../../../hooks/useChartInteraction';
import { chartColors, gradientPresets, createMixedChartOptions } from '../../../lib/charts';
import { ChartWrapper } from '../shared/ChartWrapper';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface BarLineComboSeries {
  name: string;
  type: 'bar' | 'line';
  data: number[];
}

export interface BarLineComboProps {
  /** Series data - array of bar and line series */
  series: BarLineComboSeries[];
  /** X-axis categories */
  categories: string[];
  /** Chart height */
  height?: number;
  /** Colors for each series */
  colors?: string[];
  /** Show legend */
  showLegend?: boolean;
  /** Legend position */
  legendPosition?: 'top' | 'bottom';
  /** Enable zoom */
  enableZoom?: boolean;
  /** Show toolbar */
  showToolbar?: boolean;
  /** Left Y-axis title */
  yAxisLeftTitle?: string;
  /** Right Y-axis title */
  yAxisRightTitle?: string;
  /** Stagger index for animation */
  staggerIndex?: number;
  /** Additional class names */
  className?: string;
  /** Data point click handler */
  onDataPointClick?: (point: { seriesIndex: number; dataPointIndex: number; value: number }) => void;
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

export function BarLineCombo({
  series,
  categories,
  height = 350,
  colors = [chartColors.primary[500], chartColors.accent[500]],
  showLegend = true,
  legendPosition = 'top',
  enableZoom = false,
  showToolbar = false,
  yAxisLeftTitle,
  yAxisRightTitle,
  staggerIndex = 0,
  className,
  onDataPointClick,
}: BarLineComboProps) {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();
  const { events } = useChartInteraction({
    enableZoom,
    onDataPointClick: onDataPointClick
      ? (point) =>
          onDataPointClick({
            seriesIndex: point.seriesIndex,
            dataPointIndex: point.dataPointIndex,
            value: point.value as number,
          })
      : undefined,
  });

  // Determine stroke widths based on series types
  const strokeWidths = useMemo(
    () => series.map((s) => (s.type === 'bar' ? 0 : 3)),
    [series]
  );

  // Determine fill opacities based on series types
  const fillOpacities = useMemo(
    () => series.map((s) => (s.type === 'bar' ? 0.85 : 1)),
    [series]
  );

  // Determine marker sizes based on series types
  const markerSizes = useMemo(
    () => series.map((s) => (s.type === 'bar' ? 0 : 5)),
    [series]
  );

  const options = useMemo<ApexOptions>(() => {
    const baseOptions = createMixedChartOptions({
      colors,
      height,
      showLegend,
      legendPosition,
      showToolbar,
    });

    // Count bar and line series for Y-axis assignment
    const hasBar = series.some((s) => s.type === 'bar');
    const hasLine = series.some((s) => s.type === 'line');
    const needsDualAxis = hasBar && hasLine;

    return {
      ...baseOptions,
      chart: {
        ...baseOptions.chart,
        type: 'line',
        stacked: false,
        fontFamily: 'Poppins, sans-serif',
        background: 'transparent',
        toolbar: showToolbar
          ? {
              show: true,
              tools: {
                download: true,
                selection: enableZoom,
                zoom: enableZoom,
                zoomin: enableZoom,
                zoomout: enableZoom,
                pan: false,
                reset: enableZoom,
              },
            }
          : { show: false },
        zoom: enableZoom
          ? {
              enabled: true,
              type: 'x',
              autoScaleYaxis: true,
            }
          : { enabled: false },
        events,
        animations: {
          enabled: !prefersReducedMotion,
          speed: 400,
          animateGradually: {
            enabled: true,
            delay: 150,
          },
        },
      },
      colors,
      stroke: {
        width: strokeWidths,
        curve: 'smooth',
      },
      fill: {
        opacity: fillOpacities,
        type: series.map((s) => (s.type === 'bar' ? 'gradient' : 'solid')),
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.3,
          opacityFrom: gradientPresets.subtle.opacityFrom,
          opacityTo: gradientPresets.subtle.opacityTo,
          stops: [0, 100],
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          borderRadius: 6,
          borderRadiusApplication: 'end',
        },
      },
      markers: {
        size: markerSizes,
        strokeWidth: 2,
        strokeColors: '#fff',
        hover: {
          size: 7,
        },
      },
      grid: {
        borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.gray[200],
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      xaxis: {
        categories,
        labels: {
          style: {
            colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
            fontSize: '12px',
            fontFamily: 'Poppins, sans-serif',
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      yaxis: needsDualAxis
        ? [
            {
              title: {
                text: yAxisLeftTitle,
                style: {
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
                },
              },
              labels: {
                style: {
                  colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                },
                formatter: (val: number) => {
                  if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                  if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
                  return val.toFixed(0);
                },
              },
            },
            {
              opposite: true,
              title: {
                text: yAxisRightTitle,
                style: {
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                  color: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
                },
              },
              labels: {
                style: {
                  colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
                  fontSize: '12px',
                  fontFamily: 'Poppins, sans-serif',
                },
                formatter: (val: number) => `${val}%`,
              },
            },
          ]
        : {
            labels: {
              style: {
                colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
                fontSize: '12px',
                fontFamily: 'Poppins, sans-serif',
              },
            },
          },
      legend: {
        show: showLegend,
        position: legendPosition,
        horizontalAlign: 'left',
        labels: {
          colors: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[700],
        },
        fontFamily: 'Poppins, sans-serif',
        fontSize: '13px',
        markers: {
          size: 8,
          offsetX: -4,
        },
        itemMargin: {
          horizontal: 16,
          vertical: 8,
        },
      },
      tooltip: {
        enabled: true,
        shared: true,
        intersect: false,
        theme: isDarkMode ? 'dark' : 'light',
        cssClass: 'glass-tooltip',
        style: {
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
        y: {
          formatter: (val: number, { seriesIndex }: { seriesIndex: number }) => {
            const seriesType = series[seriesIndex]?.type;
            if (seriesType === 'line') return `${val}%`;
            if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
            if (val >= 1000) return `$${(val / 1000).toFixed(1)}K`;
            return `$${val}`;
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
    };
  }, [
    colors,
    height,
    showLegend,
    legendPosition,
    showToolbar,
    categories,
    series,
    strokeWidths,
    fillOpacities,
    markerSizes,
    isDarkMode,
    prefersReducedMotion,
    enableZoom,
    events,
    yAxisLeftTitle,
    yAxisRightTitle,
  ]);

  return (
    <ChartWrapper staggerIndex={staggerIndex} animation="fade-up" className={className}>
      <Chart options={options} series={series} type="line" height={height} />
    </ChartWrapper>
  );
}

export default BarLineCombo;
