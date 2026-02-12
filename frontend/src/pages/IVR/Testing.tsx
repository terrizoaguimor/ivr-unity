import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PlayIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  DocumentArrowDownIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/outline';

interface Test {
  id: number;
  name: string;
  description: string;
  category: 'basic' | 'pc';
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: string;
  logs?: string[];
}

export default function TestingSuite() {
  const [tests, setTests] = useState<Test[]>([
    {
      id: 1,
      name: 'Acento Latino',
      description: 'Validar uso de "tú" en lugar de "vosotros"',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Velocidad de Respuesta',
      description: 'Claude Haiku 4.5 < 2 segundos',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Voice Tags V3',
      description: 'Validar tags emocionales funcionan',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 4,
      name: 'Retención Completa',
      description: 'Script de cancelación con empatía',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 5,
      name: 'Siniestros con Heridos',
      description: 'Prioriza seguridad y llama 911',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 6,
      name: 'Siniestros sin Heridos',
      description: 'Recopila información completa',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 7,
      name: 'Múltiples Productos',
      description: 'Prioriza correctamente',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 8,
      name: 'Errores de Audio',
      description: 'Protocolo 3 intentos',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 9,
      name: 'Anti-Alucinación',
      description: 'No inventa información',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 10,
      name: 'Context Handoff',
      description: 'Transfiere con contexto completo',
      category: 'basic',
      status: 'pending',
    },
    {
      id: 11,
      name: 'Incendio en Hogar',
      description: 'Seguridad primero, gastos hotel',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 12,
      name: 'Robo sin Reporte Policial',
      description: 'Insiste en reporte obligatorio',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 13,
      name: 'Inundación sin Flood',
      description: 'Explica póliza separada requerida',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 14,
      name: 'Agua Interna Cubierta',
      description: 'Distingue agua interna vs externa',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 15,
      name: 'Múltiples Productos P&C',
      description: 'Identifica Auto + Home + Umbrella',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 16,
      name: 'Umbrella Explanation',
      description: 'Explica responsabilidad extendida',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 17,
      name: 'Keywords P&C',
      description: 'Detecta correctamente tipo siniestro',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 18,
      name: 'Plazos de Reporte',
      description: 'Valida plazos AUTO/HOME/FLOOD',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 19,
      name: 'Gastos de Hotel',
      description: 'Explica cobertura subsistencia',
      category: 'pc',
      status: 'pending',
    },
    {
      id: 20,
      name: 'Póliza Vencida',
      description: 'Detecta y comunica sin cobertura',
      category: 'pc',
      status: 'pending',
    },
  ]);

  const [expandedTest, setExpandedTest] = useState<number | null>(null);
  const [isRunningAll, setIsRunningAll] = useState(false);

  const handleRunTest = async (testId: number) => {
    setTests((prev) =>
      prev.map((t) =>
        t.id === testId
          ? { ...t, status: 'running', logs: ['Starting test...', 'Calling IVR...'] }
          : t
      )
    );

    // Simulate test execution
    setTimeout(() => {
      const passed = Math.random() > 0.2; // 80% pass rate
      setTests((prev) =>
        prev.map((t) =>
          t.id === testId
            ? {
                ...t,
                status: passed ? 'passed' : 'failed',
                duration: `${(Math.random() * 3 + 1).toFixed(1)}s`,
                logs: [
                  'Starting test...',
                  'Calling IVR +1 (754) 273-9829...',
                  'Connected successfully',
                  'Bot responded in 1.2s',
                  passed
                    ? '✓ All validations passed'
                    : '✗ Validation failed: Expected "tú" but got "vosotros"',
                  'Test completed',
                ],
              }
            : t
        )
      );
    }, 3000);
  };

  const handleRunAllTests = async () => {
    setIsRunningAll(true);
    for (const test of tests) {
      await new Promise((resolve) => {
        handleRunTest(test.id);
        setTimeout(resolve, 3500);
      });
    }
    setIsRunningAll(false);
  };

  const handleExportResults = () => {
    const results = tests.map((t) => ({
      name: t.name,
      status: t.status,
      duration: t.duration || 'N/A',
    }));
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ivr-test-results-${new Date().toISOString()}.json`;
    a.click();
  };

  const stats = {
    total: tests.length,
    passed: tests.filter((t) => t.status === 'passed').length,
    failed: tests.filter((t) => t.status === 'failed').length,
    pending: tests.filter((t) => t.status === 'pending').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Testing Suite
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Execute and monitor end-to-end tests
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleExportResults}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center space-x-2"
          >
            <DocumentArrowDownIcon className="h-5 w-5" />
            <span>Export</span>
          </button>
          <button
            onClick={handleRunAllTests}
            disabled={isRunningAll}
            className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 disabled:opacity-50 flex items-center space-x-2"
          >
            <PlayIcon className="h-5 w-5" />
            <span>{isRunningAll ? 'Running...' : 'Run All Tests'}</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Total Tests
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
            {stats.total}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Passed</p>
          <p className="mt-2 text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.passed}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Failed</p>
          <p className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.failed}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Pending
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-600 dark:text-gray-400">
            {stats.pending}
          </p>
        </motion.div>
      </div>

      {/* Tests List */}
      <div className="space-y-4">
        {/* Basic Tests */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Tests (1-10)
          </h2>
          <div className="space-y-3">
            {tests
              .filter((t) => t.category === 'basic')
              .map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-element p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          #{test.id}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {test.name}
                        </h3>
                        {test.status === 'passed' && (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        {test.status === 'failed' && (
                          <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        {test.status === 'running' && (
                          <div className="h-5 w-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {test.description}
                      </p>
                      {test.duration && (
                        <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <ClockIcon className="h-4 w-4" />
                          <span>{test.duration}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {expandedTest === test.id ? (
                        <button
                          onClick={() => setExpandedTest(null)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <ChevronUpIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setExpandedTest(test.id)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          disabled={!test.logs}
                        >
                          <ChevronDownIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRunTest(test.id)}
                        disabled={test.status === 'running'}
                        className="px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg disabled:opacity-50 flex items-center space-x-1"
                      >
                        <PlayIcon className="h-4 w-4" />
                        <span>Run</span>
                      </button>
                    </div>
                  </div>

                  {/* Logs */}
                  {expandedTest === test.id && test.logs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-3 bg-gray-900 dark:bg-black rounded-lg overflow-hidden"
                    >
                      <div className="space-y-1 font-mono text-xs">
                        {test.logs.map((log, idx) => (
                          <div
                            key={idx}
                            className={
                              log.includes('✓')
                                ? 'text-green-400'
                                : log.includes('✗')
                                ? 'text-red-400'
                                : 'text-gray-400'
                            }
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>

        {/* P&C Tests */}
        <div className="glass-card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            P&C Tests (11-20)
          </h2>
          <div className="space-y-3">
            {tests
              .filter((t) => t.category === 'pc')
              .map((test) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="glass-element p-4 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-mono text-gray-500 dark:text-gray-400">
                          #{test.id}
                        </span>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {test.name}
                        </h3>
                        {test.status === 'passed' && (
                          <CheckCircleIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                        )}
                        {test.status === 'failed' && (
                          <XCircleIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                        )}
                        {test.status === 'running' && (
                          <div className="h-5 w-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
                        )}
                      </div>
                      <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                        {test.description}
                      </p>
                      {test.duration && (
                        <div className="mt-2 flex items-center space-x-1 text-xs text-gray-500 dark:text-gray-400">
                          <ClockIcon className="h-4 w-4" />
                          <span>{test.duration}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {expandedTest === test.id ? (
                        <button
                          onClick={() => setExpandedTest(null)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                        >
                          <ChevronUpIcon className="h-5 w-5" />
                        </button>
                      ) : (
                        <button
                          onClick={() => setExpandedTest(test.id)}
                          className="p-1 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                          disabled={!test.logs}
                        >
                          <ChevronDownIcon className="h-5 w-5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleRunTest(test.id)}
                        disabled={test.status === 'running'}
                        className="px-3 py-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-900/20 rounded-lg disabled:opacity-50 flex items-center space-x-1"
                      >
                        <PlayIcon className="h-4 w-4" />
                        <span>Run</span>
                      </button>
                    </div>
                  </div>

                  {expandedTest === test.id && test.logs && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 p-3 bg-gray-900 dark:bg-black rounded-lg overflow-hidden"
                    >
                      <div className="space-y-1 font-mono text-xs">
                        {test.logs.map((log, idx) => (
                          <div
                            key={idx}
                            className={
                              log.includes('✓')
                                ? 'text-green-400'
                                : log.includes('✗')
                                ? 'text-red-400'
                                : 'text-gray-400'
                            }
                          >
                            {log}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
