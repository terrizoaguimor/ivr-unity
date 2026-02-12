import { useMemo, useState } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import { GlassChartCard } from "../ui/glass-card";
import { useChartTheme } from "../../hooks/useChartTheme";
import { chartColors, gradientPresets } from "../../lib/charts";
import { ChartWrapper } from "../charts/shared/ChartWrapper";

export default function MonthlySalesChart() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(
    () => ({
      colors: [chartColors.primary[500]],
      chart: {
        fontFamily: "Poppins, sans-serif",
        type: "bar",
        height: 180,
        background: "transparent",
        toolbar: { show: false },
        animations: { enabled: !prefersReducedMotion, speed: 350, animateGradually: { enabled: true, delay: 80 } },
      },
      plotOptions: { bar: { horizontal: false, columnWidth: "39%", borderRadius: 5, borderRadiusApplication: "end" } },
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
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
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
        title: { text: undefined },
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
        y: { formatter: (val: number) => `$${val.toLocaleString()}` },
        marker: { show: true },
      },
      states: { hover: { filter: { type: "lighten" } }, active: { filter: { type: "darken" } } },
    }),
    [isDarkMode, prefersReducedMotion]
  );

  const series = [{ name: "Sales", data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112] }];
  const [isOpen, setIsOpen] = useState(false);

  return (
    <GlassChartCard className="overflow-hidden px-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">Monthly Sales</h3>
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
      <ChartWrapper animation="fade-up">
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="-ml-5 min-w-[650px] xl:min-w-full pl-2">
            <Chart options={options} series={series} type="bar" height={180} />
          </div>
        </div>
      </ChartWrapper>
    </GlassChartCard>
  );
}
