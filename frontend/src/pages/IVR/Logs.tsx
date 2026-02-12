import { useState } from 'react';
import { motion } from 'motion/react';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  DocumentArrowDownIcon,
  PhoneIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

interface CallLog {
  id: string;
  timestamp: string;
  cliente: string;
  telefono: string;
  duracion: string;
  resultado: 'completed' | 'transferred' | 'error';
  transcript: string;
  voiceTags: string[];
  toolsCalled: string[];
}

export default function CallLogsMetrics() {
  const [logs] = useState<CallLog[]>([
    {
      id: '1',
      timestamp: '2026-02-12 14:32:15',
      cliente: 'María González',
      telefono: '305-123-4567',
      duracion: '3:42',
      resultado: 'transferred',
      transcript: 'Bot: Bienvenido a Unity Financial Network...\nCliente: Hubo un incendio...',
      voiceTags: ['<Concerned>', '<Serious>', '<Patient>'],
      toolsCalled: ['buscar_cliente', 'guardar_contexto', 'transfer_to_number'],
    },
    {
      id: '2',
      timestamp: '2026-02-12 13:15:42',
      cliente: 'Carlos Ramírez',
      telefono: '786-345-6789',
      duracion: '2:18',
      resultado: 'completed',
      transcript: 'Bot: Bienvenido...\nCliente: Consulta sobre mi póliza...',
      voiceTags: ['<Enthusiastic>', '<Patient>'],
      toolsCalled: ['buscar_cliente'],
    },
    {
      id: '3',
      timestamp: '2026-02-12 12:08:33',
      cliente: 'Ana Martínez',
      telefono: '954-456-7890',
      duracion: '4:55',
      resultado: 'transferred',
      transcript: 'Bot: Bienvenido...\nCliente: Tengo agua en mi casa...',
      voiceTags: ['<Concerned>', '<Patient>', '<Disappointed>'],
      toolsCalled: ['buscar_cliente', 'guardar_contexto', 'transfer_to_number'],
    },
    {
      id: '4',
      timestamp: '2026-02-12 11:22:10',
      cliente: 'Unknown',
      telefono: '555-999-8888',
      duracion: '0:45',
      resultado: 'error',
      transcript: 'Bot: Bienvenido...\n[Connection lost]',
      voiceTags: [],
      toolsCalled: [],
    },
    {
      id: '5',
      timestamp: '2026-02-12 10:45:22',
      cliente: 'Roberto Torres',
      telefono: '305-987-6543',
      duracion: '5:30',
      resultado: 'transferred',
      transcript: 'Bot: Bienvenido...\nCliente: Quiero cancelar mi póliza...',
      voiceTags: ['<Concerned>', '<Patient>', '<Enthusiastic>'],
      toolsCalled: ['buscar_cliente', 'guardar_contexto', 'transfer_to_number'],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterResult, setFilterResult] = useState<'all' | 'completed' | 'transferred' | 'error'>('all');
  const [viewingTranscript, setViewingTranscript] = useState<CallLog | null>(null);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.telefono.includes(searchTerm);
    const matchesFilter = filterResult === 'all' || log.resultado === filterResult;
    return matchesSearch && matchesFilter;
  });

  const getResultColor = (resultado: string) => {
    switch (resultado) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'transferred':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300';
    }
  };

  const handleExportLogs = () => {
    const csv = [
      ['Timestamp', 'Cliente', 'Teléfono', 'Duración', 'Resultado'].join(','),
      ...logs.map((log) =>
        [log.timestamp, log.cliente, log.telefono, log.duracion, log.resultado].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-logs-${new Date().toISOString()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Call Logs & Metrics
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            View call transcripts and performance metrics
          </p>
        </div>
        <button
          onClick={handleExportLogs}
          className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
        >
          <DocumentArrowDownIcon className="h-5 w-5" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Calls
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {logs.length}
              </p>
            </div>
            <PhoneIcon className="h-8 w-8 text-brand-600 dark:text-brand-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Completed
              </p>
              <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
                {logs.filter((l) => l.resultado === 'completed').length}
              </p>
            </div>
            <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Transferred
              </p>
              <p className="mt-2 text-3xl font-bold text-blue-600 dark:text-blue-400">
                {logs.filter((l) => l.resultado === 'transferred').length}
              </p>
            </div>
            <svg className="h-8 w-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Errors</p>
              <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                {logs.filter((l) => l.resultado === 'error').length}
              </p>
            </div>
            <XCircleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="glass-card p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {/* Filter */}
          <div className="flex items-center space-x-2">
            <FunnelIcon className="h-5 w-5 text-gray-400" />
            {(['all', 'completed', 'transferred', 'error'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterResult(filter)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterResult === filter
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Timestamp
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Duración
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Resultado
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <motion.tr
                  key={log.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {log.timestamp}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {log.cliente}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {log.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-white">
                      {log.duracion}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getResultColor(
                        log.resultado
                      )}`}
                    >
                      {log.resultado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setViewingTranscript(log)}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 flex items-center space-x-1 ml-auto"
                    >
                      <EyeIcon className="h-5 w-5" />
                      <span>View</span>
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transcript Modal */}
      {viewingTranscript && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Call Transcript
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {viewingTranscript.cliente} • {viewingTranscript.timestamp}
                  </p>
                </div>
                <button
                  onClick={() => setViewingTranscript(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Transcript */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Conversation
                </h4>
                <div className="p-4 bg-gray-900 dark:bg-black rounded-lg">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                    {viewingTranscript.transcript}
                  </pre>
                </div>
              </div>

              {/* Voice Tags */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Voice Tags Used
                </h4>
                <div className="flex flex-wrap gap-2">
                  {viewingTranscript.voiceTags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 text-sm font-mono bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools Called */}
              <div>
                <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  Tools Called
                </h4>
                <div className="space-y-2">
                  {viewingTranscript.toolsCalled.map((tool, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-2 p-2 glass-element rounded-lg"
                    >
                      <svg className="h-5 w-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">
                        {tool}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
