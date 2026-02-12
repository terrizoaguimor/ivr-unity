import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import { GlassChartCard } from "../ui/glass-card";
import { useChartTheme } from "../../hooks/useChartTheme";
import { chartColors, gradientPresets } from "../../lib/charts";
import { ChartWrapper } from "../charts/shared/ChartWrapper";

export default function AnalyticsBarChart() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(
    () => ({
      colors: [chartColors.primary[500]],
      chart: {
        fontFamily: "Poppins, sans-serif",
        type: "bar",
        height: 350,
        background: "transparent",
        toolbar: { show: false },
        animations: { enabled: !prefersReducedMotion, speed: 350, animateGradually: { enabled: true, delay: 50 } },
      },
      plotOptions: { bar: { horizontal: false, columnWidth: "45%", borderRadius: 5, borderRadiusApplication: "end" } },
      dataLabels: { enabled: false },
      stroke: { show: true, width: 4, colors: ["transparent"] },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.3,
          gradientToColors: [chartColors.primary[300]],
          opacityFrom: gradientPresets.vibrant.opacityFrom,
          opacityTo: gradientPresets.vibrant.opacityTo,
          stops: [0, 100],
        },
      },
      xaxis: {
        categories: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23","24","25","26","27","28","29","30"],
        labels: { style: { colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontSize: "12px", fontFamily: "Poppins, sans-serif" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      legend: {
        show: true, position: "top", horizontalAlign: "left", fontFamily: "Poppins",
        labels: { colors: isDarkMode ? "rgba(255,255,255,0.7)" : chartColors.gray[700] },
      },
      yaxis: {
        labels: { style: { colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontSize: "12px", fontFamily: "Poppins, sans-serif" } },
      },
      grid: {
        borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : chartColors.gray[200],
        strokeDashArray: 4,
        yaxis: { lines: { show: true } },
      },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        cssClass: "glass-tooltip",
        style: { fontSize: "12px", fontFamily: "Poppins, sans-serif" },
        x: { show: false },
        y: { formatter: (val: number) => `${val}` },
        marker: { show: true },
      },
      states: { hover: { filter: { type: "lighten" } }, active: { filter: { type: "darken" } } },
    }),
    [isDarkMode, prefersReducedMotion]
  );

  const series = [{
    name: "Sales",
    data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112, 123, 212, 270, 190, 310, 115, 90, 380, 112, 223, 292, 170, 290, 110, 115, 290, 380, 312],
  }];

  return (
    <GlassChartCard className="px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">Analytics</h3>
          <span className="block text-gray-500 text-theme-sm dark:text-gray-400">Visitor analytics of last 30 days</span>
        </div>
        <ChartTab />
      </div>
      <ChartWrapper animation="fade-up">
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[1300px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="bar" height={350} />
          </div>
        </div>
      </ChartWrapper>
    </GlassChartCard>
  );
}
