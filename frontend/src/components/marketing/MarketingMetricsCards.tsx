import { DollarLineIcon, GroupIcon, ShootingStarIcon } from "../../icons";
import { GlassMetricCard } from "../ui/glass-card";

export default function MarketingMetricsCards() {
  return (
    <div className="grid-fluid-sm">
      {/* <!-- Metric Item Start --> */}
      <GlassMetricCard highlighted={true}>
        <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/[0.90]">
          <ShootingStarIcon className="size-6" />
        </div>

        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Avg. Client Rating
        </p>

        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              7.8/10
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
              +20%
            </span>

            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </GlassMetricCard>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <GlassMetricCard>
        <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/[0.90]">
          <GroupIcon className="size-6" />
        </div>

        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Instagram Followers
        </p>

        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              5,934
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-error-50 px-2 py-0.5 text-theme-xs font-medium text-error-600 dark:bg-error-500/15 dark:text-error-500">
              -3.59%
            </span>

            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </GlassMetricCard>
      {/* <!-- Metric Item End --> */}

      {/* <!-- Metric Item Start --> */}
      <GlassMetricCard>
        <div className="mb-6 flex h-[52px] w-[52px] items-center justify-center rounded-xl bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-white/[0.90]">
          <DollarLineIcon className="size-6" />
        </div>
        <p className="text-gray-500 text-theme-sm dark:text-gray-400">
          Total Revenue
        </p>

        <div className="flex items-end justify-between mt-3">
          <div>
            <h4 className="font-bold text-gray-800 text-title-sm dark:text-white/90">
              $9,758
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <span className="flex items-center gap-1 rounded-full bg-success-50 px-2 py-0.5 text-theme-xs font-medium text-success-600 dark:bg-success-500/15 dark:text-success-500">
              +15%
            </span>

            <span className="text-gray-500 text-theme-xs dark:text-gray-400">
              Vs last month
            </span>
          </div>
        </div>
      </GlassMetricCard>
      {/* <!-- Metric Item End --> */}
    </div>
  );
}
