import { useEffect, useRef, useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import flatpickr from "flatpickr";
import ChartTab from "../common/ChartTab";
import { CalenderIcon } from "../../icons";
import { GlassChartCard } from "../ui/glass-card";
import { useChartTheme } from "../../hooks/useChartTheme";
import { chartColors, gradientPresets } from "../../lib/charts";
import { ChartWrapper } from "../charts/shared/ChartWrapper";

export default function StatisticsChart() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();
  const datePickerRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!datePickerRef.current) return;

    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 6);

    const fp = flatpickr(datePickerRef.current, {
      mode: "range",
      static: true,
      monthSelectorType: "static",
      dateFormat: "M d",
      defaultDate: [sevenDaysAgo, today],
      clickOpens: true,
      prevArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.5 15L7.5 10L12.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      nextArrow:
        '<svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7.5 15L12.5 10L7.5 5" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    });

    return () => {
      if (!Array.isArray(fp)) {
        fp.destroy();
      }
    };
  }, []);

  const options = useMemo<ApexOptions>(
    () => ({
      legend: { show: false, position: "top", horizontalAlign: "left" },
      colors: [chartColors.primary[500], chartColors.primary[300]],
      chart: {
        fontFamily: "Poppins, sans-serif",
        height: 310,
        type: "line",
        background: "transparent",
        toolbar: { show: false },
        animations: { enabled: !prefersReducedMotion, speed: 400, animateGradually: { enabled: true, delay: 150 } },
      },
      stroke: { curve: "straight", width: [2, 2] },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: [chartColors.primary[200], chartColors.primary[100]],
          opacityFrom: gradientPresets.premium.opacityFrom,
          opacityTo: gradientPresets.premium.opacityTo,
          stops: [0, 90, 100],
        },
      },
      markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6 } },
      grid: {
        borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : chartColors.gray[200],
        strokeDashArray: 4,
        xaxis: { lines: { show: false } },
        yaxis: { lines: { show: true } },
      },
      dataLabels: { enabled: false },
      tooltip: {
        enabled: true,
        theme: isDarkMode ? "dark" : "light",
        cssClass: "glass-tooltip",
        style: { fontSize: "12px", fontFamily: "Poppins, sans-serif" },
        x: { format: "dd MMM yyyy" },
        marker: { show: true },
      },
      xaxis: {
        type: "category",
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        labels: { style: { colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontSize: "12px", fontFamily: "Poppins, sans-serif" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: { enabled: false },
      },
      yaxis: {
        labels: {
          style: { fontSize: "12px", colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontFamily: "Poppins, sans-serif" },
          formatter: (val: number) => { if (val >= 1000) return `${(val / 1000).toFixed(1)}K`; return val.toString(); },
        },
        title: { text: "", style: { fontSize: "0px" } },
      },
    }),
    [isDarkMode, prefersReducedMotion]
  );

  const series = [
    { name: "Sales", data: [180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235] },
    { name: "Revenue", data: [40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140] },
  ];

  return (
    <GlassChartCard className="px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Statistics</h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">Target you've set for each month</p>
        </div>
        <div className="flex items-center gap-3 sm:justify-end">
          <ChartTab />
          <div className="relative inline-flex items-center">
            <CalenderIcon className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:left-3 lg:top-1/2 lg:translate-x-0 lg:-translate-y-1/2 size-5 text-gray-500 dark:text-gray-400 pointer-events-none z-10" />
            <input
              ref={datePickerRef}
              className="h-10 w-10 lg:w-40 lg:h-auto lg:pl-10 lg:pr-3 lg:py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium text-transparent lg:text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:lg:text-gray-300 cursor-pointer"
              placeholder="Select date range"
            />
          </div>
        </div>
      </div>
      <ChartWrapper animation="fade-up">
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      </ChartWrapper>
    </GlassChartCard>
  );
}
