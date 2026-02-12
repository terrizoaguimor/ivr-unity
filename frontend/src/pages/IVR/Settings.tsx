import { useState } from 'react';
import { motion } from 'motion/react';
import {
  KeyIcon,
  GlobeAltIcon,
  BellIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
  XCircleIcon,
  CogIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

interface APIKey {
  name: string;
  key: string;
  status: 'active' | 'inactive' | 'testing';
  lastUsed: string;
}

interface Webhook {
  id: string;
  name: string;
  url: string;
  status: 'active' | 'inactive';
  lastCall: string;
  description: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api-keys' | 'webhooks' | 'general'>('api-keys');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({
    elevenlabs: false,
    telnyx: false,
    monday: false,
  });

  const [apiKeys, setApiKeys] = useState<Record<string, APIKey>>({
    elevenlabs: {
      name: 'ElevenLabs',
      key: 'sk_******************************************',
      status: 'active',
      lastUsed: '2 hours ago',
    },
    telnyx: {
      name: 'Telnyx',
      key: 'KEY******************************************',
      status: 'active',
      lastUsed: '5 hours ago',
    },
    monday: {
      name: 'Monday.com',
      key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9******************',
      status: 'inactive',
      lastUsed: 'Never',
    },
  });

  const [webhooks] = useState<Webhook[]>([
    {
      id: '1',
      name: 'buscar_cliente',
      url: 'https://unity-ivr-api.ondigitalocean.app/api/elevenlabs/buscar-cliente',
      status: 'active',
      lastCall: '5 minutes ago',
      description: 'Busca información del cliente por teléfono',
    },
    {
      id: '2',
      name: 'guardar_contexto',
      url: 'https://unity-ivr-api.ondigitalocean.app/api/elevenlabs/guardar-contexto',
      status: 'active',
      lastCall: '1 hour ago',
      description: 'Guarda contexto antes de transferir a agente humano',
    },
    {
      id: '3',
      name: 'crear_siniestro',
      url: 'https://unity-ivr-api.ondigitalocean.app/api/elevenlabs/crear-siniestro',
      status: 'active',
      lastCall: '3 hours ago',
      description: 'Crea un nuevo número de siniestro',
    },
  ]);

  const [testingKey, setTestingKey] = useState<string | null>(null);
  const [testingWebhook, setTestingWebhook] = useState<string | null>(null);

  const toggleShowKey = (keyName: string) => {
    setShowKeys((prev) => ({
      ...prev,
      [keyName]: !prev[keyName],
    }));
  };

  const handleTestAPIKey = async (keyName: string) => {
    setTestingKey(keyName);
    // Simulate API test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setApiKeys((prev) => ({
      ...prev,
      [keyName]: {
        ...prev[keyName],
        status: 'active',
      },
    }));
    setTestingKey(null);
  };

  const handleTestWebhook = async (webhookId: string) => {
    setTestingWebhook(webhookId);
    // Simulate webhook test
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setTestingWebhook(null);
  };

  const handleExportConfig = () => {
    const config = {
      apiKeys,
      webhooks,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ivr-config-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IVR Settings</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Configure API keys, webhooks, and general settings
        </p>
      </div>

      {/* Tabs */}
      <div className="glass-card">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'api-keys', label: 'API Keys', icon: KeyIcon },
              { id: 'webhooks', label: 'Webhooks', icon: GlobeAltIcon },
              { id: 'general', label: 'General', icon: CogIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-brand-600 text-brand-600 dark:text-brand-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* API Keys Tab */}
          {activeTab === 'api-keys' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  API Keys
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Manage your API keys for external services. Keys are encrypted and stored securely.
                </p>
              </div>

              <div className="space-y-4">
                {Object.entries(apiKeys).map(([keyName, keyData]) => (
                  <div key={keyName} className="glass-element p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-brand-100 dark:bg-brand-900/30 rounded-lg">
                          <KeyIcon className="h-5 w-5 text-brand-600 dark:text-brand-400" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {keyData.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Last used: {keyData.lastUsed}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            keyData.status === 'active'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                          }`}
                        >
                          {keyData.status === 'active' ? (
                            <CheckCircleIcon className="h-3 w-3 mr-1" />
                          ) : (
                            <XCircleIcon className="h-3 w-3 mr-1" />
                          )}
                          {keyData.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className="relative flex-1">
                        <input
                          type={showKeys[keyName] ? 'text' : 'password'}
                          value={keyData.key}
                          readOnly
                          className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                        />
                        <button
                          onClick={() => toggleShowKey(keyName)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {showKeys[keyName] ? (
                            <EyeSlashIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      <button
                        onClick={() => handleTestAPIKey(keyName)}
                        disabled={testingKey === keyName}
                        className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {testingKey === keyName ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Testing...</span>
                          </>
                        ) : (
                          <span>Test Connection</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Webhooks Tab */}
          {activeTab === 'webhooks' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Webhooks
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  Configure webhooks for real-time integrations with ElevenLabs conversational AI.
                </p>
              </div>

              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="glass-element p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                          <GlobeAltIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {webhook.name}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {webhook.description}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                            Last call: {webhook.lastCall}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          webhook.status === 'active'
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300'
                        }`}
                      >
                        {webhook.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={webhook.url}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-mono text-sm"
                      />
                      <button
                        onClick={() => handleTestWebhook(webhook.id)}
                        disabled={testingWebhook === webhook.id}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                      >
                        {testingWebhook === webhook.id ? (
                          <>
                            <svg
                              className="animate-spin h-4 w-4"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            <span>Testing...</span>
                          </>
                        ) : (
                          <span>Test Webhook</span>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Webhook Logs */}
              <div className="glass-element p-6">
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Webhook Calls
                </h4>
                <div className="space-y-3">
                  {[
                    {
                      webhook: 'buscar_cliente',
                      timestamp: '2026-02-12 10:45:23',
                      status: 200,
                      duration: '234ms',
                    },
                    {
                      webhook: 'guardar_contexto',
                      timestamp: '2026-02-12 09:12:45',
                      status: 200,
                      duration: '156ms',
                    },
                    {
                      webhook: 'crear_siniestro',
                      timestamp: '2026-02-12 07:34:12',
                      status: 200,
                      duration: '312ms',
                    },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">
                          {log.webhook}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {log.timestamp}
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {log.duration}
                        </span>
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                          {log.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* General Tab */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Company Info */}
              <div className="glass-element p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Company Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Unity Financial Network"
                      className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Company Logo
                    </label>
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center">
                        <span className="text-2xl font-bold text-brand-600 dark:text-brand-400">
                          U
                        </span>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 flex items-center space-x-2">
                        <CloudArrowUpIcon className="h-5 w-5" />
                        <span>Upload New Logo</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="glass-element p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <BellIcon className="h-5 w-5" />
                  <span>Notifications</span>
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      id: 'email',
                      label: 'Email Alerts',
                      description: 'Receive email notifications for important events',
                      enabled: true,
                    },
                    {
                      id: 'sms',
                      label: 'SMS Alerts',
                      description: 'Receive SMS notifications for critical issues',
                      enabled: false,
                    },
                    {
                      id: 'slack',
                      label: 'Slack Integration',
                      description: 'Post notifications to Slack channel',
                      enabled: true,
                    },
                  ].map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {notification.label}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {notification.description}
                        </p>
                      </div>
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notification.enabled ? 'bg-brand-600' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notification.enabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Backup & Export */}
              <div className="glass-element p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Backup & Export
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Export Configuration
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Download all settings, API keys, and webhooks as JSON
                      </p>
                    </div>
                    <button
                      onClick={handleExportConfig}
                      className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 flex items-center space-x-2"
                    >
                      <ArrowDownTrayIcon className="h-5 w-5" />
                      <span>Export</span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        Import Configuration
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Restore settings from a previously exported file
                      </p>
                    </div>
                    <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2">
                      <ArrowUpTrayIcon className="h-5 w-5" />
                      <span>Import</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button className="px-6 py-3 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
                  Save All Settings
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
