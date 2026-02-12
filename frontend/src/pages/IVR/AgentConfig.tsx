import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

interface AgentConfig {
  agentId: string;
  model: string;
  language: string;
  temperature: number;
  latencyOptimization: number;
  voiceTags: boolean;
  prompt: string;
}

export default function AgentConfig() {
  const [config, setConfig] = useState<AgentConfig>({
    agentId: 'agent_4801kg64ffw3f4q8vdytf5j7yz85',
    model: 'claude-haiku-4-5',
    language: 'es',
    temperature: 0.5,
    latencyOptimization: 4,
    voiceTags: true,
    prompt: '', // Will be loaded from server
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [activeTab, setActiveTab] = useState<'basic' | 'prompt' | 'advanced'>('basic');

  const models = [
    { value: 'claude-haiku-4-5', label: 'Claude Haiku 4.5 (Fastest)', recommended: true },
    { value: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5 (Balanced)' },
    { value: 'claude-opus-4-6', label: 'Claude Opus 4.6 (Most Capable)' },
  ];

  const languages = [
    { value: 'es', label: 'Español (Latino)' },
    { value: 'en', label: 'English' },
    { value: 'es-MX', label: 'Español (México)' },
  ];

  // Load prompt on mount
  useEffect(() => {
    const loadDefaultPrompt = async () => {
      try {
        const response = await fetch('/default-prompt.txt');
        const text = await response.text();
        setConfig((prev) => ({ ...prev, prompt: text }));
      } catch (error) {
        console.error('Error loading default prompt:', error);
      }
    };
    loadDefaultPrompt();
  }, []);

  const handleLoadPrompt = async () => {
    setIsLoading(true);
    try {
      // TODO: Load from file or API
      const response = await fetch('/api/ivr/agent/prompt');
      const data = await response.json();
      setConfig((prev) => ({ ...prev, prompt: data.prompt }));
    } catch (error) {
      console.error('Error loading prompt:', error);
      // Load local default
      setConfig((prev) => ({
        ...prev,
        prompt: '### IDENTIDAD - ACENTO LATINO\n\nEres **Unity**, asistente virtual...',
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // TODO: Implement API call to update agent
      const response = await fetch('/api/ivr/agent/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (response.ok) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        throw new Error('Failed to update agent');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestAgent = async () => {
    // TODO: Implement test call
    window.open(`tel:${'+17542739829'}`, '_self');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Agent Configuration
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Update your IVR agent settings and prompt
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleTestAgent}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Test Call
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isSaving ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </button>
        </div>
      </div>

      {/* Save Status Alert */}
      {saveStatus !== 'idle' && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`glass-card p-4 flex items-center space-x-3 ${
            saveStatus === 'success'
              ? 'border-l-4 border-green-500'
              : 'border-l-4 border-red-500'
          }`}
        >
          {saveStatus === 'success' ? (
            <>
              <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span className="text-sm text-gray-900 dark:text-white">
                Agent configuration updated successfully!
              </span>
            </>
          ) : (
            <>
              <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
              <span className="text-sm text-gray-900 dark:text-white">
                Error updating agent. Please try again.
              </span>
            </>
          )}
        </motion.div>
      )}

      {/* Tabs */}
      <div className="glass-card p-1">
        <div className="flex space-x-2">
          {['basic', 'prompt', 'advanced'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                activeTab === tab
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)} Settings
            </button>
          ))}
        </div>
      </div>

      {/* Basic Settings */}
      {activeTab === 'basic' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 space-y-6"
        >
          {/* Agent ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Agent ID
            </label>
            <input
              type="text"
              value={config.agentId}
              disabled
              className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-500 dark:text-gray-400 cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Agent ID cannot be changed
            </p>
          </div>

          {/* Model Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              LLM Model
            </label>
            <select
              value={config.model}
              onChange={(e) => setConfig({ ...config, model: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              {models.map((model) => (
                <option key={model.value} value={model.value}>
                  {model.label} {model.recommended ? '⭐ Recommended' : ''}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Haiku 4.5 is fastest (2-3x faster than Sonnet)
            </p>
          </div>

          {/* Language */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Language
            </label>
            <select
              value={config.language}
              onChange={(e) => setConfig({ ...config, language: e.target.value })}
              className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature: {config.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.temperature}
              onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>More consistent</span>
              <span>More creative</span>
            </div>
          </div>

          {/* Voice Tags */}
          <div className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Voice Expression Tags (V3)
              </label>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Enable emotional voice tags like &lt;Excited&gt;, &lt;Concerned&gt;
              </p>
            </div>
            <button
              onClick={() => setConfig({ ...config, voiceTags: !config.voiceTags })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.voiceTags ? 'bg-brand-600' : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.voiceTags ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </motion.div>
      )}

      {/* Prompt Editor */}
      {activeTab === 'prompt' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 space-y-4"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                System Prompt
              </h3>
            </div>
            <button
              onClick={handleLoadPrompt}
              disabled={isLoading}
              className="px-3 py-1 text-sm text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg flex items-center space-x-2"
            >
              {isLoading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <ArrowPathIcon className="h-4 w-4" />
                  <span>Load from File</span>
                </>
              )}
            </button>
          </div>

          <textarea
            value={config.prompt}
            onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
            placeholder="Enter system prompt here..."
            rows={20}
            className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-sm font-mono text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 resize-y"
          />

          <div className="flex items-start space-x-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex-shrink-0 mt-0.5">
              <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p className="font-medium mb-1">Tips for writing effective prompts:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Use voice tags for emotional expression: &lt;Excited&gt;, &lt;Concerned&gt;, &lt;Patient&gt;</li>
                <li>Include clear keywords for product detection</li>
                <li>Define validation rules to prevent hallucinations</li>
                <li>Specify transfer protocols and context management</li>
              </ul>
            </div>
          </div>
        </motion.div>
      )}

      {/* Advanced Settings */}
      {activeTab === 'advanced' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card p-6 space-y-6"
        >
          {/* Latency Optimization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Latency Optimization: Level {config.latencyOptimization}
            </label>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={config.latencyOptimization}
              onChange={(e) => setConfig({ ...config, latencyOptimization: parseInt(e.target.value) })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>Balanced</span>
              <span>Maximum (Level 4)</span>
            </div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              Level 4: Fastest response, target &lt;2s
            </p>
          </div>

          {/* TTS Settings */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Cog6ToothIcon className="h-5 w-5 mr-2" />
              Text-to-Speech Settings
            </h4>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice Model
                </label>
                <select className="w-full px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500">
                  <option>eleven_v3_conversational</option>
                  <option>eleven_multilingual_v2</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Stability: 0.6
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  defaultValue="0.6"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Similarity Boost: 0.85
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  defaultValue="0.85"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="border-t border-red-200 dark:border-red-800 pt-6">
            <h4 className="text-sm font-semibold text-red-600 dark:text-red-400 mb-4">
              Danger Zone
            </h4>
            <button className="px-4 py-2 text-sm font-medium text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20">
              Reset to Default Configuration
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
