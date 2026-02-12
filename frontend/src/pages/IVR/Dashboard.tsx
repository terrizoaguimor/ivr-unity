import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  PhoneIcon,
  CogIcon,
  ChartBarIcon,
  UserGroupIcon,
  ClipboardDocumentCheckIcon,
  BellAlertIcon,
} from '@heroicons/react/24/outline';

interface IVRStats {
  activeCalls: number;
  todayCalls: number;
  avgHandlingTime: string;
  fcr: string;
  csat: string;
  agentStatus: 'online' | 'offline' | 'maintenance';
}

export default function IVRDashboard() {
  const [stats, setStats] = useState<IVRStats>({
    activeCalls: 0,
    todayCalls: 127,
    avgHandlingTime: '3:42',
    fcr: '58%',
    csat: '4.6/5',
    agentStatus: 'online',
  });

  const [agentInfo] = useState({
    id: 'agent_4801kg64ffw3f4q8vdytf5j7yz85',
    name: 'Unity Agent Manager',
    phone: '+1 (754) 273-9829',
    model: 'Claude Haiku 4.5',
    language: 'Español Latino',
    products: ['Salud', 'Vida', 'Auto', 'Home', 'Renters', 'Flood', 'Umbrella'],
  });

  useEffect(() => {
    // Simular actualización de stats en tiempo real
    const interval = setInterval(() => {
      setStats((prev) => ({
        ...prev,
        activeCalls: Math.floor(Math.random() * 5),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const quickActions = [
    {
      title: 'Update Agent',
      description: 'Modify prompt & configuration',
      icon: CogIcon,
      href: '/ivr/agent-config',
      color: 'purple',
    },
    {
      title: 'Mock Data',
      description: 'Manage test clients',
      icon: UserGroupIcon,
      href: '/ivr/mock-data',
      color: 'blue',
    },
    {
      title: 'Run Tests',
      description: 'Execute end-to-end tests',
      icon: ClipboardDocumentCheckIcon,
      href: '/ivr/testing',
      color: 'green',
    },
    {
      title: 'View Logs',
      description: 'Call transcripts & metrics',
      icon: ChartBarIcon,
      href: '/ivr/logs',
      color: 'orange',
    },
  ];

  const recentActivity = [
    {
      type: 'call',
      message: 'Incoming call - María González (Home insurance)',
      time: '2 min ago',
      status: 'completed',
    },
    {
      type: 'test',
      message: 'Test completed: Incendio en hogar',
      time: '15 min ago',
      status: 'passed',
    },
    {
      type: 'config',
      message: 'Agent prompt updated with P&C expansion',
      time: '1 hour ago',
      status: 'success',
    },
    {
      type: 'alert',
      message: 'High call volume detected',
      time: '2 hours ago',
      status: 'warning',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          IVR Management
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Monitor and manage your Unity Financial IVR system
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Active Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 relative overflow-hidden"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Calls
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.activeCalls}
              </p>
            </div>
            <div className="p-3 bg-brand-100 dark:bg-brand-900/30 rounded-full">
              <PhoneIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="flex items-center text-green-600 dark:text-green-400">
              <span className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full mr-2 animate-pulse" />
              Live
            </span>
          </div>
        </motion.div>

        {/* Today's Calls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Today's Calls
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.todayCalls}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>↑ 12% from yesterday</span>
          </div>
        </motion.div>

        {/* Avg Handling Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Avg Handling Time
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.avgHandlingTime}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <span>↓ 48% improvement</span>
          </div>
        </motion.div>

        {/* FCR */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                First Call Resolution
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.fcr}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-gray-600 dark:text-gray-400">
            <span>Target: 60%</span>
          </div>
        </motion.div>

        {/* CSAT */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Customer Satisfaction
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {stats.csat}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600 dark:text-green-400">
            <span>↑ Excellent</span>
          </div>
        </motion.div>
      </div>

      {/* Agent Status & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Agent Status
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Status</span>
              <span className="flex items-center text-sm font-medium text-green-600 dark:text-green-400">
                <span className="h-2 w-2 bg-green-600 dark:bg-green-400 rounded-full mr-2 animate-pulse" />
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {agentInfo.phone}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Model</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {agentInfo.model}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Language</span>
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {agentInfo.language}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Products</p>
              <div className="flex flex-wrap gap-2">
                {agentInfo.products.map((product) => (
                  <span
                    key={product}
                    className="px-2 py-1 text-xs font-medium bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="glass-card p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {quickActions.map((action, index) => (
              <a
                key={index}
                href={action.href}
                className="glass-element p-4 hover:scale-105 transition-transform duration-200 cursor-pointer group"
              >
                <div className={`p-2 bg-${action.color}-100 dark:bg-${action.color}-900/30 rounded-lg w-fit mb-3`}>
                  <action.icon className={`h-5 w-5 text-${action.color}-600 dark:text-${action.color}-400`} />
                </div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                  {action.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {action.description}
                </p>
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.7 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Recent Activity
          </h2>
          <a
            href="/ivr/logs"
            className="text-sm text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300"
          >
            View all →
          </a>
        </div>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 glass-element rounded-lg"
            >
              <div className={`p-2 rounded-full ${
                activity.status === 'completed' || activity.status === 'passed' || activity.status === 'success'
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : activity.status === 'warning'
                  ? 'bg-orange-100 dark:bg-orange-900/30'
                  : 'bg-gray-100 dark:bg-gray-800'
              }`}>
                {activity.type === 'call' && <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {activity.type === 'test' && <ClipboardDocumentCheckIcon className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {activity.type === 'config' && <CogIcon className="h-4 w-4 text-green-600 dark:text-green-400" />}
                {activity.type === 'alert' && <BellAlertIcon className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.message}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
