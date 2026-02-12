import { useMemo } from 'react';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useChartTheme } from '../../../hooks/useChartTheme';
import { chartColors, gradientPresets } from '../../../lib/charts';
import { ChartWrapper } from '../shared/ChartWrapper';

export default function BarChartOne() {
  const { isDarkMode, prefersReducedMotion } = useChartTheme();

  const options = useMemo<ApexOptions>(() => ({
    colors: [chartColors.primary[500]],
    chart: {
      fontFamily: "Poppins, sans-serif",
      type: "bar",
      height: 180,
      background: 'transparent',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: !prefersReducedMotion,
        speed: 350,
        animateGradually: {
          enabled: true,
          delay: 80,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 6,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'vertical',
        shadeIntensity: 0.3,
        gradientToColors: [chartColors.primary[300]],
        opacityFrom: gradientPresets.vibrant.opacityFrom,
        opacityTo: gradientPresets.vibrant.opacityTo,
        stops: [0, 100],
      },
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      ],
      labels: {
        style: {
          colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
      fontFamily: "Poppins",
      labels: {
        colors: isDarkMode ? 'rgba(255, 255, 255, 0.7)' : chartColors.gray[700],
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? 'rgba(255, 255, 255, 0.6)' : chartColors.gray[500],
          fontSize: '12px',
          fontFamily: 'Poppins, sans-serif',
        },
        formatter: (val: number) => {
          if (val >= 1000) return `${(val / 1000).toFixed(1)}K`;
          return val.toString();
        },
      },
      title: {
        text: undefined,
      },
    },
    grid: {
      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.08)' : chartColors.gray[200],
      strokeDashArray: 4,
      yaxis: {
        lines: {
          show: true,
        },
      },
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: isDarkMode ? 'dark' : 'light',
      cssClass: 'glass-tooltip',
      style: {
        fontSize: '12px',
        fontFamily: 'Poppins, sans-serif',
      },
      x: {
        show: true,
      },
      y: {
        formatter: (val: number) => `$${val.toLocaleString()}`,
      },
      marker: {
        show: true,
      },
    },
    states: {
      hover: {
        filter: {
          type: 'lighten',
        },
      },
      active: {
        filter: {
          type: 'darken',
        },
      },
    },
  }), [isDarkMode, prefersReducedMotion]);

  const series = [
    {
      name: "Sales",
      data: [168, 385, 201, 298, 187, 195, 291, 110, 215, 390, 280, 112],
    },
  ];

  return (
    <ChartWrapper animation="fade-up">
      <div className="max-w-full overflow-x-auto custom-scrollbar">
        <div id="chartOne" className="min-w-[1000px]">
          <Chart options={options} series={series} type="bar" height={180} />
        </div>
      </div>
    </ChartWrapper>
  );
}
