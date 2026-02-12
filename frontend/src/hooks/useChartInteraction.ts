/**
 * useChartInteraction Hook
 * Manages chart interactivity: zoom, pan, selection, and data point clicks
 */

import { useState, useCallback, useMemo } from 'react';
import type { ApexOptions } from 'apexcharts';

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface ZoomState {
  xaxis: { min: number; max: number };
  yaxis?: { min: number; max: number };
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface DataPoint {
  seriesIndex: number;
  dataPointIndex: number;
  value: number | string | [number, number];
  seriesName?: string;
  category?: string;
}

export interface ChartInteractionOptions {
  /** Callback when a data point is clicked */
  onDataPointClick?: (dataPoint: DataPoint) => void;
  /** Callback when zoom level changes */
  onZoomChange?: (zoom: ZoomState | null) => void;
  /** Callback when a range is selected */
  onRangeSelect?: (range: DateRange) => void;
  /** Callback when chart is reset to default view */
  onReset?: () => void;
  /** Enable zoom functionality */
  enableZoom?: boolean;
  /** Enable range selection */
  enableSelection?: boolean;
  /** Zoom type: horizontal, vertical, or both */
  zoomType?: 'x' | 'y' | 'xy';
}

interface ZoomConfigType {
  enabled: boolean;
  type: 'x' | 'y' | 'xy';
  autoScaleYaxis: boolean;
  zoomedArea: {
    fill: { color: string; opacity: number };
    stroke: { color: string; opacity: number; width: number };
  };
}

interface SelectionConfigType {
  enabled: boolean;
  type: 'x';
  fill: { color: string; opacity: number };
  stroke: { color: string; opacity: number; width: number; dashArray: number };
}

export interface ChartInteractionReturn {
  /** Current zoom state */
  zoomState: ZoomState | null;
  /** Currently selected date range */
  selectedRange: DateRange | null;
  /** Last clicked data point */
  activePoint: DataPoint | null;
  /** Reset zoom to default */
  resetZoom: () => void;
  /** Clear selection */
  clearSelection: () => void;
  /** ApexCharts event handlers to spread into options */
  events: NonNullable<ApexOptions['chart']>['events'];
  /** Zoom configuration to spread into chart options */
  zoomConfig: ZoomConfigType;
  /** Selection configuration to spread into chart options */
  selectionConfig: SelectionConfigType;
}

// ─────────────────────────────────────────────────────────────
// Hook Implementation
// ─────────────────────────────────────────────────────────────

/**
 * Hook for managing chart interactivity
 *
 * @example
 * ```tsx
 * const { events, zoomConfig, resetZoom } = useChartInteraction({
 *   onDataPointClick: (point) => console.log('Clicked:', point),
 *   enableZoom: true,
 * });
 *
 * const options: ApexOptions = {
 *   chart: {
 *     events,
 *     zoom: zoomConfig,
 *   },
 * };
 * ```
 */
export function useChartInteraction(
  options: ChartInteractionOptions = {}
): ChartInteractionReturn {
  const {
    onDataPointClick,
    onZoomChange,
    onRangeSelect,
    onReset,
    enableZoom = false,
    enableSelection = false,
    zoomType = 'x',
  } = options;

  // State
  const [zoomState, setZoomState] = useState<ZoomState | null>(null);
  const [selectedRange, setSelectedRange] = useState<DateRange | null>(null);
  const [activePoint, setActivePoint] = useState<DataPoint | null>(null);

  // ─────────────────────────────────────────────────────────────
  // Event Handlers
  // ─────────────────────────────────────────────────────────────

  /**
   * Handle data point click/selection
   */
  const handleDataPointSelection = useCallback(
    (
      _event: MouseEvent,
      _chartContext: unknown,
      config: {
        seriesIndex: number;
        dataPointIndex: number;
        w: {
          config: {
            series: Array<{ name?: string; data: Array<number | [number, number]> }>;
            xaxis?: { categories?: string[] };
          };
        };
      }
    ) => {
      const { seriesIndex, dataPointIndex, w } = config;

      if (seriesIndex < 0 || dataPointIndex < 0) return;

      const series = w.config.series[seriesIndex];
      const value = series?.data?.[dataPointIndex];
      const seriesName = series?.name;
      const category = w.config.xaxis?.categories?.[dataPointIndex];

      const point: DataPoint = {
        seriesIndex,
        dataPointIndex,
        value,
        seriesName,
        category,
      };

      setActivePoint(point);
      onDataPointClick?.(point);
    },
    [onDataPointClick]
  );

  /**
   * Handle zoom event
   */
  const handleZoomed = useCallback(
    (
      _chartContext: unknown,
      { xaxis, yaxis }: { xaxis: { min: number; max: number }; yaxis?: { min: number; max: number } }
    ) => {
      const newZoom: ZoomState = { xaxis, yaxis };
      setZoomState(newZoom);
      onZoomChange?.(newZoom);
    },
    [onZoomChange]
  );

  /**
   * Handle range selection (brush)
   */
  const handleSelection = useCallback(
    (
      _chartContext: unknown,
      { xaxis }: { xaxis: { min: number; max: number } }
    ) => {
      const range: DateRange = {
        start: new Date(xaxis.min),
        end: new Date(xaxis.max),
      };
      setSelectedRange(range);
      onRangeSelect?.(range);
    },
    [onRangeSelect]
  );

  /**
   * Handle before zoom (for validation)
   */
  const handleBeforeZoom = useCallback(
    (
      _chartContext: unknown,
      { xaxis }: { xaxis: { min: number; max: number } }
    ) => {
      // Return the xaxis to allow zoom, or return false to prevent
      return { xaxis };
    },
    []
  );

  /**
   * Handle reset zoom
   */
  const handleResetZoom = useCallback(
    () => {
      setZoomState(null);
      setSelectedRange(null);
      onReset?.();
    },
    [onReset]
  );

  // ─────────────────────────────────────────────────────────────
  // Public Methods
  // ─────────────────────────────────────────────────────────────

  const resetZoom = useCallback(() => {
    setZoomState(null);
    onZoomChange?.(null);
    onReset?.();
  }, [onZoomChange, onReset]);

  const clearSelection = useCallback(() => {
    setSelectedRange(null);
    setActivePoint(null);
  }, []);

  // ─────────────────────────────────────────────────────────────
  // Configuration Objects
  // ─────────────────────────────────────────────────────────────

  const events = useMemo(
    () => ({
      dataPointSelection: handleDataPointSelection,
      zoomed: enableZoom ? handleZoomed : undefined,
      selection: enableSelection ? handleSelection : undefined,
      beforeZoom: enableZoom ? handleBeforeZoom : undefined,
      beforeResetZoom: handleResetZoom,
    }),
    [
      handleDataPointSelection,
      handleZoomed,
      handleSelection,
      handleBeforeZoom,
      handleResetZoom,
      enableZoom,
      enableSelection,
    ]
  );

  const zoomConfig = useMemo(
    () => ({
      enabled: enableZoom,
      type: zoomType,
      autoScaleYaxis: true,
      zoomedArea: {
        fill: {
          color: '#512783',
          opacity: 0.1,
        },
        stroke: {
          color: '#512783',
          opacity: 0.4,
          width: 1,
        },
      },
    }),
    [enableZoom, zoomType]
  );

  const selectionConfig = useMemo(
    () => ({
      enabled: enableSelection,
      type: 'x' as const,
      fill: {
        color: '#f18918',
        opacity: 0.15,
      },
      stroke: {
        color: '#f18918',
        opacity: 0.4,
        width: 1,
        dashArray: 3,
      },
    }),
    [enableSelection]
  );

  return {
    zoomState,
    selectedRange,
    activePoint,
    resetZoom,
    clearSelection,
    events,
    zoomConfig,
    selectionConfig,
  };
}

export default useChartInteraction;
