import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { GlassChartCard } from "../ui/glass-card";
import { useChartTheme } from "../../hooks/useChartTheme";
import { chartColors } from "../../lib/charts";
import { ChartWrapper } from "../charts/shared/ChartWrapper";

export default function SessionChart() {
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlassChartCard className="p-5 sm:p-6">
      <div className="flex items-center justify-between mb-9">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Sessions By Device</h3>
        <div className="relative inline-block">
          <button className="dropdown-toggle" onClick={() => setIsOpen(!isOpen)}>
            <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-6" />
          </button>
          <Dropdown isOpen={isOpen} onClose={() => setIsOpen(false)} className="w-40 p-2">
            <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">View More</DropdownItem>
            <DropdownItem onItemClick={() => setIsOpen(false)} className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300">Delete</DropdownItem>
          </Dropdown>
        </div>
      </div>
      <ChartWrapper animation="scale">
        <div className="flex justify-center mx-auto">
          <Chart options={options} series={series} type="donut" height={290} />
        </div>
      </ChartWrapper>
    </GlassChartCard>
  );
}
