import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Eye,
  ArrowLeftRight,
  RotateCcw,
  Calendar,
  User,
  Package,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';
import useInventoryStore from '../../stores/inventoryStore';
import { Link, useSearchParams } from 'react-router-dom';
import { AssetAssignment } from '../../types/inventory';


const statusColors = {
  active: 'bg-blue-100 text-blue-800',
  returned: 'bg-green-100 text-green-800',
  transferred: 'bg-purple-100 text-purple-800',
  lost: 'bg-fuchsia-100 text-fuchsia-800',
  damaged: 'bg-red-100 text-red-800',
};

const statusLabels = {
  active: 'Activa',
  returned: 'Devuelta',
  transferred: 'Transferida',
  lost: 'Perdido',
  damaged: 'Dañado'
};

const AssignmentsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAssignments, setSelectedAssignments] = useState<number[]>([]);

  const assignments = useInventoryStore(state => state.assignments);
  const fetchAssignments = useInventoryStore(state => state.fetchAssignments);
  const returnAsset = useInventoryStore(state => state.returnAsset);
  const transferAsset = useInventoryStore(state => state.transferAsset);
  const isLoading = useInventoryStore(state => state.isLoading);
  const error = useInventoryStore(state => state.error);
  const clearError = useInventoryStore(state => state.clearError);

  // Cargar asignaciones al montar el componente
  useEffect(() => {
    fetchAssignments();
  }, [fetchAssignments]);

  // Manejar parámetros de URL
  useEffect(() => {
    const status = searchParams.get('status');
    if (status) setSelectedStatus(status);
  }, [searchParams]);

  // Filtrar asignaciones
  const filteredAssignments = assignments.filter((assignment: AssetAssignment) => {
    const matchesSearch = 
      assignment.tech_asset_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.tech_asset_serial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assigned_to_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assigned_by_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !selectedStatus || assignment.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleReturnAsset = async (assignmentId: number) => {
    const notes = prompt('Notas sobre la devolucion (opcional): ');

    try {
        await returnAsset(assignmentId, {
            return_date: new Date().toISOString().split('T')[0],
            condition: 'good',
            notes: notes || ''
        });
    } catch (error) {
        console.error('Error al devolver activo:', error);
    }
  };

  const handleTransferAsset = async (assignmentId: number) => {
    const newUserId = prompt('ID del nuevo usuario')
    if (!newUserId) return;

    const notes = prompt('Notas sobre la transferencia (opcional):');

    try {
        await transferAsset(assignmentId, parseInt(newUserId), notes || '');
    } catch (error) {
        console.error('Error al transferir activo: ', error);
    }
  };

  const toggleAssignmentSelection = (assignmentId: number) => {
    setSelectedAssignments(prev =>
      prev.includes(assignmentId)
        ? prev.filter(id => id !== assignmentId)
        : [...prev, assignmentId]
    );
  };

  const toggleSelectAll = () => {
    setSelectedAssignments(
      selectedAssignments.length === filteredAssignments.length
        ? []
        : filteredAssignments.map((assignment: AssetAssignment) => assignment.id)
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4" />;
      case 'returned':
        return <CheckCircle className="h-4 w-4" />;
      case 'transferred':
        return <ArrowLeftRight className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  if (error) {
    return (
      <Layout>
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => {
                    clearError();
                    fetchAssignments();
                  }}
                  className="text-sm font-medium text-red-600 hover:text-red-500"
                >
                  Reintentar
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Gestión de Asignaciones</h2>
            <p className="mt-1 text-sm text-gray-500">
              Administra las asignaciones de activos tecnológicos a usuarios
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Link
              to="/inventory/assignments/new"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Asignación
            </Link>
          </div>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por activo, usuario o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Botón de filtros */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </button>

            {/* Exportar */}
            <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              <Download className="h-4 w-4" />
            </button>
          </div>

          {/* Panel de filtros expandible */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="">Todos los estados</option>
                    <option value="active">Activa</option>
                    <option value="returned">Devuelta</option>
                    <option value="transferred">Transferida</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSelectedStatus('');
                      setSearchTerm('');
                    }}
                    className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Acciones masivas */}
        {selectedAssignments.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-sm text-blue-800">
                  {selectedAssignments.length} asignación(es) seleccionada(s)
                </span>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-md">
                  Exportar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tabla de asignaciones */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
            </div>
          ) : filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay asignaciones</h3>
              <p className="mt-1 text-sm text-gray-500">
                {assignments.length === 0 
                  ? 'Comienza creando tu primera asignación de activo.'
                  : 'No se encontraron asignaciones que coincidan con los filtros aplicados.'
                }
              </p>
              <div className="mt-6">
                <Link
                  to="/inventory/assignments/new"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Asignación
                </Link>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedAssignments.length === filteredAssignments.length}
                        onChange={toggleSelectAll}
                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Fecha Asignación
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Asignado Por
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAssignments.map((assignment: AssetAssignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedAssignments.includes(assignment.id)}
                          onChange={() => toggleAssignmentSelection(assignment.id)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                              <Package className="h-5 w-5 text-gray-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.tech_asset_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.tech_asset_serial}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-emerald-600" />
                            </div>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {assignment.assigned_by_name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {assignment.assigned_to_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[assignment.status]}`}>
                          {getStatusIcon(assignment.status)}
                          <span className="ml-1">{statusLabels[assignment.status]}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          {new Date(assignment.assigned_date).toLocaleDateString('es-AR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {assignment.assigned_by_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <Link
                            to={`/inventory/assignments/${assignment.id}`}
                            className="text-emerald-600 hover:text-emerald-900"
                            title="Ver detalles"
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                          
                          {assignment.status === 'active' && (
                            <>
                              <button
                                onClick={() => handleReturnAsset(assignment.id)}
                                className="text-green-600 hover:text-green-900"
                                title="Devolver activo"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleTransferAsset(assignment.id)}
                                className="text-blue-600 hover:text-blue-900"
                                title="Transferir activo"
                              >
                                <ArrowLeftRight className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Estadísticas resumidas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Resumen de Asignaciones</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {filteredAssignments.length}
              </div>
              <div className="text-sm text-gray-500">
                {filteredAssignments.length === assignments.length ? 'Total' : 'Filtradas'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {filteredAssignments.filter((a: AssetAssignment) => a.status === 'active').length}
              </div>
              <div className="text-sm text-gray-500">Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {filteredAssignments.filter((a: AssetAssignment) => a.status === 'returned').length}
              </div>
              <div className="text-sm text-gray-500">Devueltas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {filteredAssignments.filter((a: AssetAssignment) => a.status === 'transferred').length}
              </div>
              <div className="text-sm text-gray-500">Transferidas</div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentsPage;