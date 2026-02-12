import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useChartTheme } from "../../../hooks/useChartTheme";
import { chartColors, gradientPresets } from "../../../lib/charts";
import { ChartWrapper } from "../shared/ChartWrapper";

export default function LineChartTwo() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(
    () => ({
      legend: { show: false, position: "top", horizontalAlign: "left" },
      colors: [chartColors.primary[500], chartColors.primary[300]],
      chart: {
        fontFamily: "Poppins, sans-serif",
        height: 310,
        type: "area",
        background: "transparent",
        toolbar: { show: false },
        animations: {
          enabled: !prefersReducedMotion,
          speed: 400,
          animateGradually: { enabled: true, delay: 150 },
        },
      },
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
      stroke: { curve: "smooth", width: [2.5, 2.5] },
      markers: { size: 0, strokeColors: "#fff", strokeWidth: 2, hover: { size: 6, sizeOffset: 2 } },
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
        labels: { style: { fontSize: "12px", colors: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontFamily: "Poppins, sans-serif" } },
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
    <ChartWrapper animation="fade-up">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartEight" className="min-w-[1000px]">
          <Chart options={options} series={series} type="area" height={310} />
        </div>
      </div>
    </ChartWrapper>
  );
}
