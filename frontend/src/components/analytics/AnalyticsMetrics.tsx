import React from "react";
import Badge from "../ui/badge/Badge";
import { GlassMetricCard } from "../ui/glass-card";

const mockData = [
  {
    id: 1,
    title: "Unique Visitors",
    value: "24.7K",
    change: "+20%",
    direction: "up",
    comparisonText: "Vs last month",
  },
  {
    id: 2,
    title: "Total Pageviews",
    value: "55.9K",
    change: "+4%",
    direction: "up",
    comparisonText: "Vs last month",
  },
  {
    id: 3,
    title: "Bounce Rate",
    value: "54%",
    change: "-1.59%",
    direction: "down",
    comparisonText: "Vs last month",
  },
  {
    id: 4,
    title: "Visit Duration",
    value: "2m 56s",
    change: "+7%",
    direction: "up",
    comparisonText: "Vs last month",
  },
];

const AnalyticsMetrics: React.FC = () => {
  return (
    <div className="grid-fluid-sm">
      {/* <!-- Metric Item Start --> */}
      {mockData.map((item, index) => (
        <GlassMetricCard
          key={item.id}
          highlighted={index === 0}
          className="p-5"
        >
          <p className="text-gray-500 text-theme-sm dark:text-gray-400">
            {item.title}
          </p>
          <div className="flex items-end justify-between mt-3">
            <div>
              <h4 className="text-2xl font-bold text-gray-800 dark:text-white/90">
                {item.value}
              </h4>
            </div>
            <div className="flex items-center gap-1">
              <Badge
                color={
                  item.direction === "up"
                    ? "success"
                    : item.direction === "down"
                    ? "error"
                    : "warning"
                }
              >
                <span className="text-xs"> {item.change}</span>
              </Badge>
              <span className="text-gray-500 text-theme-xs dark:text-gray-400">
                {item.comparisonText}
              </span>
            </div>
          </div>
        </GlassMetricCard>
      ))}

      {/* <!-- Metric Item End --> */}
    </div>
  );
};

export default AnalyticsMetrics;
