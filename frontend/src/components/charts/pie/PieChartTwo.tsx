import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useChartTheme } from "../../../hooks/useChartTheme";
import { chartColors } from "../../../lib/charts";
import { ChartWrapper } from "../shared/ChartWrapper";

export default function PieChartTwo() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(
    () => ({
      colors: [chartColors.primary[500], chartColors.accent[500], chartColors.accent[400], chartColors.success[400]],
      labels: ["Downloads", "Apps", "Documents", "Media"],
      chart: {
        fontFamily: "Poppins, sans-serif",
        type: "donut",
        background: "transparent",
        animations: { enabled: !prefersReducedMotion, speed: 600, animateGradually: { enabled: true, delay: 150 } },
      },
      stroke: { show: true, width: 4, colors: [isDarkMode ? "rgba(17,17,27,0.8)" : "#ffffff"] },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: {
              show: true,
              name: { show: true, offsetY: -10, color: isDarkMode ? "#ffffff" : chartColors.gray[900], fontSize: "14px", fontWeight: "500" },
              value: { show: true, offsetY: 10, color: isDarkMode ? "rgba(255,255,255,0.6)" : chartColors.gray[500], fontSize: "12px", fontWeight: "400", formatter: () => "Used of 135 GB" },
              total: { show: true, label: "Total 135 GB", color: isDarkMode ? "#ffffff" : "#000000", fontSize: "16px", fontWeight: "bold" },
            },
          },
          expandOnClick: false,
        },
      },
      dataLabels: { enabled: false },
      tooltip: { enabled: true, theme: isDarkMode ? "dark" : "light", cssClass: "glass-tooltip", style: { fontSize: "12px", fontFamily: "Poppins, sans-serif" } },
      legend: {
        show: true, position: "bottom", horizontalAlign: "left", fontFamily: "Poppins, sans-serif", fontSize: "14px", fontWeight: 400,
        labels: { colors: isDarkMode ? "rgba(255,255,255,0.7)" : chartColors.gray[700] },
        markers: { size: 6, shape: "circle", strokeWidth: 0 },
        itemMargin: { horizontal: 10, vertical: 6 },
      },
      responsive: [{ breakpoint: 640, options: { chart: { width: 320 }, legend: { itemMargin: { horizontal: 7, vertical: 5 }, fontSize: "12px" } } }],
    }),
    [isDarkMode, prefersReducedMotion]
  );

  const series = [45, 65, 25, 25];

  return (
    <ChartWrapper animation="scale">
      <div className="flex justify-center">
        <div id="chartDarkStyle">
          <Chart options={options} series={series} type="donut" width="400" />
        </div>
      </div>
    </ChartWrapper>
  );
}
