import { useState } from 'react';
import { motion } from 'motion/react';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  HomeIcon,
  BuildingOfficeIcon,
} from '@heroicons/react/24/outline';

interface MockClient {
  id: string;
  telefono: string;
  nombre: string;
  tipo_cliente: string;
  productos: string[];
  estado: 'active' | 'expired';
}

export default function MockDataManager() {
  const [clients, setClients] = useState<MockClient[]>([
    {
      id: '1',
      telefono: '3051234567',
      nombre: 'María González',
      tipo_cliente: 'cliente_pc_home',
      productos: ['Homeowners'],
      estado: 'active',
    },
    {
      id: '2',
      telefono: '7863456789',
      nombre: 'Carlos Ramírez',
      tipo_cliente: 'cliente_pc_renters',
      productos: ['Renters'],
      estado: 'active',
    },
    {
      id: '3',
      telefono: '9544567890',
      nombre: 'Ana Martínez',
      tipo_cliente: 'cliente_pc_multi',
      productos: ['Homeowners', 'Flood'],
      estado: 'active',
    },
    {
      id: '4',
      telefono: '3059876543',
      nombre: 'Roberto Torres',
      tipo_cliente: 'cliente_pc_multi',
      productos: ['Auto', 'Homeowners', 'Umbrella'],
      estado: 'active',
    },
    {
      id: '5',
      telefono: '7542223344',
      nombre: 'Laura Díaz',
      tipo_cliente: 'cliente_pc_home',
      productos: ['Homeowners'],
      estado: 'expired',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'expired'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [, setEditingClient] = useState<MockClient | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch =
      client.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.telefono.includes(searchTerm);
    const matchesStatus = filterStatus === 'all' || client.estado === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getProductIcon = (producto: string) => {
    switch (producto.toLowerCase()) {
      case 'homeowners':
      case 'home':
        return <HomeIcon className="h-4 w-4" />;
      case 'renters':
        return <BuildingOfficeIcon className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getProductColor = (producto: string) => {
    switch (producto.toLowerCase()) {
      case 'homeowners':
      case 'home':
        return 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300';
      case 'renters':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300';
      case 'flood':
        return 'bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300';
      case 'auto':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
      case 'umbrella':
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300';
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300';
    }
  };

  const handleDeleteClient = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este cliente MOCK?')) {
      setClients(clients.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Mock Data Manager
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage test clients for P&C products
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700 flex items-center space-x-2"
        >
          <PlusIcon className="h-5 w-5" />
          <span>Add Client</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Clients
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {clients.length}
              </p>
            </div>
            <div className="p-3 bg-brand-100 dark:bg-brand-900/30 rounded-full">
              <UserGroupIcon className="h-6 w-6 text-brand-600 dark:text-brand-400" />
            </div>
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
                Active Policies
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {clients.filter((c) => c.estado === 'active').length}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-full">
              <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
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
                Expired Policies
              </p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                {clients.filter((c) => c.estado === 'expired').length}
              </p>
            </div>
            <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
              <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filters & Search */}
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

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            {(['all', 'active', 'expired'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  filterStatus === status
                    ? 'bg-brand-600 text-white'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredClients.map((client) => (
                <motion.tr
                  key={client.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-brand-100 dark:bg-brand-900/30 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-brand-600 dark:text-brand-400">
                          {client.nombre.split(' ').map((n) => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {client.nombre}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {client.tipo_cliente.replace('cliente_pc_', '')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white font-mono">
                      {client.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {client.productos.map((producto, idx) => (
                        <span
                          key={idx}
                          className={`inline-flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full ${getProductColor(
                            producto
                          )}`}
                        >
                          {getProductIcon(producto)}
                          <span>{producto}</span>
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        client.estado === 'active'
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}
                    >
                      {client.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => setEditingClient(client)}
                      className="text-brand-600 dark:text-brand-400 hover:text-brand-900 dark:hover:text-brand-300 mr-4"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteClient(client.id)}
                      className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>

          {filteredClients.length === 0 && (
            <div className="text-center py-12">
              <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No clients found
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal would go here */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-2xl w-full p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Add New Client
            </h3>
            {/* Add form fields here */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
              >
                Cancel
              </button>
              <button className="px-4 py-2 text-sm font-medium text-white bg-brand-600 rounded-lg hover:bg-brand-700">
                Add Client
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
