import { useMemo } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useChartTheme } from "../../../hooks/useChartTheme";
import { chartColors } from "../../../lib/charts";
import { ChartWrapper } from "../shared/ChartWrapper";

export default function PieChartOne() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(
    () => ({
      colors: [chartColors.primary[500], chartColors.primary[300], chartColors.primary[200]],
      labels: ["Desktop", "Mobile", "Tablet"],
      chart: {
        fontFamily: "Poppins, sans-serif",
        type: "donut",
        width: 445,
        height: 290,
        background: "transparent",
        animations: { enabled: !prefersReducedMotion, speed: 600, animateGradually: { enabled: true, delay: 150 } },
      },
      plotOptions: {
        pie: {
          donut: {
            size: "65%",
            background: "transparent",
            labels: { show: true, value: { show: true, offsetY: 0, color: isDarkMode ? "rgba(255,255,255,0.9)" : chartColors.gray[900] } },
          },
        },
      },
      states: { hover: { filter: { type: "none" } }, active: { allowMultipleDataPointsSelection: false, filter: { type: "darken" } } },
      dataLabels: { enabled: false },
      tooltip: { enabled: true, theme: isDarkMode ? "dark" : "light", cssClass: "glass-tooltip", style: { fontSize: "12px", fontFamily: "Poppins, sans-serif" } },
      stroke: { show: true, width: 4, colors: [isDarkMode ? "rgba(17,17,27,0.8)" : "#ffffff"] },
      legend: {
        show: true, position: "bottom", horizontalAlign: "center", fontFamily: "Poppins", fontSize: "14px", fontWeight: 400,
        labels: { colors: isDarkMode ? "rgba(255,255,255,0.7)" : chartColors.gray[700] },
        markers: { size: 4, shape: "circle", strokeWidth: 0 },
        itemMargin: { horizontal: 10, vertical: 0 },
      },
      responsive: [{ breakpoint: 640, options: { chart: { width: 370, height: 290 } } }],
    }),
    [isDarkMode, prefersReducedMotion]
  );

  const series = [45, 65, 25];

  return (
    <ChartWrapper animation="scale">
      <div className="flex justify-center">
        <div id="chartDarkStyle">
          <Chart options={options} series={series} type="donut" height={290} />
        </div>
      </div>
    </ChartWrapper>
  );
}
