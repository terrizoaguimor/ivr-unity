import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useChartTheme } from "../../../hooks/useChartTheme";
import { chartColors } from "../../../lib/charts";
import { ChartWrapper } from "../shared/ChartWrapper";

export default function BarChartTwo() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(
    () => ({
      colors: ["#421f6a", chartColors.primary[500], chartColors.primary[300], chartColors.primary[200]],
      chart: {
        fontFamily: "Poppins, sans-serif",
        type: "bar",
        stacked: true,
        height: 315,
        background: "transparent",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: { enabled: !prefersReducedMotion, speed: 400, animateGradually: { enabled: true, delay: 80 } },
      },
      plotOptions: { bar: { horizontal: false, columnWidth: "39%", borderRadius: 10, borderRadiusApplication: "end", borderRadiusWhenStacked: "last" } },
      dataLabels: { enabled: false },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
        labels: { style: { colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontSize: "12px", fontFamily: "Poppins, sans-serif" } },
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      legend: {
        show: true, position: "top", horizontalAlign: "left", fontFamily: "Poppins", fontSize: "14px", fontWeight: 400,
        labels: { colors: isDarkMode ? "rgba(255,255,255,0.7)" : chartColors.gray[700] },
        markers: { size: 5, shape: "circle", strokeWidth: 0 },
        itemMargin: { horizontal: 10, vertical: 0 },
      },
      yaxis: { labels: { style: { colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontSize: "12px", fontFamily: "Poppins, sans-serif" } }, title: { text: undefined } },
      grid: { borderColor: isDarkMode ? "rgba(255,255,255,0.08)" : chartColors.gray[200], strokeDashArray: 4, yaxis: { lines: { show: true } } },
      fill: { opacity: 1 },
      tooltip: {
        theme: isDarkMode ? "dark" : "light",
        cssClass: "glass-tooltip",
        style: { fontSize: "12px", fontFamily: "Poppins, sans-serif" },
        x: { show: false },
        y: { formatter: (val: number) => val.toString() },
        marker: { show: true },
      },
      states: { hover: { filter: { type: "lighten" } }, active: { filter: { type: "darken" } } },
    }),
    [isDarkMode, prefersReducedMotion]
  );

  const series = [
    { name: "Direct", data: [44, 55, 41, 67, 22, 43, 55, 41] },
    { name: "Referral", data: [13, 23, 20, 8, 13, 27, 13, 23] },
    { name: "Organic Search", data: [11, 17, 15, 15, 21, 14, 18, 20] },
    { name: "Social", data: [21, 7, 25, 13, 22, 8, 18, 20] },
  ];

  return (
    <ChartWrapper animation="fade-up">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartSix" className="min-w-[1000px]">
          <Chart options={options} series={series} type="bar" height={315} />
        </div>
      </div>
    </ChartWrapper>
  );
}
