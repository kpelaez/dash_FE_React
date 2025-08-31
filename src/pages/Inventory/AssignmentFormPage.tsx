// src/pages/Inventory/AssignmentFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import {
  Users,
  Package,
  Calendar,
  Save,
  X,
  Search,
  AlertCircle,
  User,
  CheckCircle
} from 'lucide-react';
import {useInventoryStore} from '../../stores/inventoryStore';

interface AssignmentFormData {
  tech_asset_id: number | '';
  user_id: number | '';
  assigned_date: string;
  expected_return_date: string;
  notes: string;
  location: string;
  condition_at_assignment: string;
}

interface TechAsset {
  id: number;
  asset_tag: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  status: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

const initialFormData: AssignmentFormData = {
  tech_asset_id: '',
  user_id: '',
  assigned_date: new Date().toISOString().split('T')[0],
  expected_return_date: '',
  notes: '',
  location: '',
  condition_at_assignment: ''
};

type AssignmentFormErrors = {
  tech_asset_id?: string;
  user_id?: string;
  assigned_date?: string;
  expected_return_date?: string;
};


const AssignmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AssignmentFormData>(initialFormData);
  const [errors, setErrors] = useState<AssignmentFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Estados para búsqueda
  const [assetSearch, setAssetSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [showAssetDropdown, setShowAssetDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  
  // Mock data - En producción esto vendría de APIs
  const [availableAssets] = useState<TechAsset[]>([
    {
      id: 1,
      asset_tag: 'LAP-001',
      name: 'MacBook Pro 13"',
      category: 'laptop',
      brand: 'Apple',
      model: 'M2 Pro',
      status: 'available'
    },
    {
      id: 2,
      asset_tag: 'DES-002',
      name: 'iMac 24"',
      category: 'desktop',
      brand: 'Apple',
      model: 'M1',
      status: 'available'
    },
    {
      id: 3,
      asset_tag: 'MON-003',
      name: 'Monitor Dell',
      category: 'monitor',
      brand: 'Dell',
      model: 'UltraSharp 27"',
      status: 'available'
    }
  ]);

  const [availableUsers] = useState<User[]>([
    {
      id: 1,
      full_name: 'Juan Pérez',
      email: 'juan.perez@empresa.com',
      is_active: true
    },
    {
      id: 2,
      full_name: 'María González',
      email: 'maria.gonzalez@empresa.com',
      is_active: true
    },
    {
      id: 3,
      full_name: 'Carlos López',
      email: 'carlos.lopez@empresa.com',
      is_active: true
    }
  ]);

  const {
    createAssignment,
    isLoading,
    error
  } = useInventoryStore();

  // Filtrar activos disponibles
  const filteredAssets = availableAssets.filter(asset =>
    asset.status === 'available' &&
    (asset.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
     asset.asset_tag.toLowerCase().includes(assetSearch.toLowerCase()) ||
     asset.brand.toLowerCase().includes(assetSearch.toLowerCase()))
  );

  // Filtrar usuarios activos
  const filteredUsers = availableUsers.filter(user =>
    user.is_active &&
    (user.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
     user.email.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const validateForm = (): boolean => {
    const newErrors: AssignmentFormErrors = {};

    if (!formData.tech_asset_id) {
      newErrors.tech_asset_id = 'Debe seleccionar un activo';
    }

    if (!formData.user_id) {
      newErrors.user_id = 'Debe seleccionar un usuario';
    }

    if (!formData.assigned_date) {
      newErrors.assigned_date = 'La fecha de asignación es requerida';
    }

    // Validar que la fecha de asignación no sea futura
    if (formData.assigned_date && new Date(formData.assigned_date) > new Date()) {
      newErrors.assigned_date = 'La fecha de asignación no puede ser futura';
    }

    // Validar fecha de retorno esperada si está presente
    if (formData.expected_return_date && formData.assigned_date) {
      if (new Date(formData.expected_return_date) <= new Date(formData.assigned_date)) {
        newErrors.expected_return_date = 'La fecha de retorno debe ser posterior a la asignación';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo si existe
    if (errors[name as keyof AssignmentFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAssetSelect = (asset: TechAsset) => {
    setFormData(prev => ({
      ...prev,
      tech_asset_id: asset.id
    }));
    setAssetSearch(`${asset.asset_tag} - ${asset.name}`);
    setShowAssetDropdown(false);
    
    // Limpiar error si existe
    if (errors.tech_asset_id) {
      setErrors(prev => ({
        ...prev,
        tech_asset_id: undefined
      }));
    }
  };

  const handleUserSelect = (user: User) => {
    setFormData(prev => ({
      ...prev,
      user_id: user.id
    }));
    setUserSearch(`${user.full_name} (${user.email})`);
    setShowUserDropdown(false);
    
    // Limpiar error si existe
    if (errors.user_id) {
      setErrors(prev => ({
        ...prev,
        user_id: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createAssignment({
        tech_asset_id: formData.tech_asset_id as number,
        assigned_to_user_id: formData.user_id as number,
        expected_return_date: formData.expected_return_date || undefined,
        assignment_notes: formData.notes || undefined,
        assigned_date: formData.assigned_date,
      });

      navigate('/inventory/assignments');
    } catch (error) {
      console.error('Error al crear asignación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory/assignments');
  };

  const selectedAsset = availableAssets.find(asset => asset.id === formData.tech_asset_id);
  const selectedUser = availableUsers.find(user => user.id === formData.user_id);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Users className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Nueva Asignación de Activo</h1>
              <p className="text-sm text-gray-500">
                Asigna un activo tecnológico a un usuario
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Selección de Activo */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2" />
                Seleccionar Activo
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="relative">
                <label htmlFor="asset_search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Activo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="asset_search"
                    value={assetSearch}
                    onChange={(e) => {
                      setAssetSearch(e.target.value);
                      setShowAssetDropdown(true);
                    }}
                    onFocus={() => setShowAssetDropdown(true)}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.tech_asset_id ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder="Buscar por nombre, etiqueta o marca..."
                  />
                </div>

                {/* Dropdown de activos */}
                {showAssetDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                    {filteredAssets.length > 0 ? (
                      filteredAssets.map((asset) => (
                        <div
                          key={asset.id}
                          onClick={() => handleAssetSelect(asset)}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50"
                        >
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-3" />
                            <div>
                              <div className="font-medium text-gray-900">
                                {asset.asset_tag} - {asset.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {asset.brand} {asset.model} • {asset.category}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                        No se encontraron activos disponibles
                      </div>
                    )}
                  </div>
                )}

                {errors.tech_asset_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.tech_asset_id}
                  </p>
                )}

                {/* Vista previa del activo seleccionado */}
                {selectedAsset && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <div>
                        <div className="font-medium text-emerald-900">
                          Activo Seleccionado: {selectedAsset.asset_tag} - {selectedAsset.name}
                        </div>
                        <div className="text-sm text-emerald-700">
                          {selectedAsset.brand} {selectedAsset.model} • {selectedAsset.category}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Selección de Usuario */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2" />
                Seleccionar Usuario
              </h3>
            </div>
            <div className="px-6 py-4">
              <div className="relative">
                <label htmlFor="user_search" className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Usuario *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="user_search"
                    value={userSearch}
                    onChange={(e) => {
                      setUserSearch(e.target.value);
                      setShowUserDropdown(true);
                    }}
                    onFocus={() => setShowUserDropdown(true)}
                    className={`block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.user_id ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder="Buscar por nombre o email..."
                  />
                </div>

                {/* Dropdown de usuarios */}
                {showUserDropdown && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user)}
                          className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-emerald-50"
                        >
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                              <User className="h-4 w-4 text-emerald-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {user.full_name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="relative cursor-default select-none py-2 pl-3 pr-9 text-gray-500">
                        No se encontraron usuarios activos
                      </div>
                    )}
                  </div>
                )}

                {errors.user_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.user_id}
                  </p>
                )}

                {/* Vista previa del usuario seleccionado */}
                {selectedUser && (
                  <div className="mt-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <div>
                        <div className="font-medium text-emerald-900">
                          Usuario Seleccionado: {selectedUser.full_name}
                        </div>
                        <div className="text-sm text-emerald-700">
                          {selectedUser.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fechas y Notas */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Detalles de la Asignación
              </h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha de Asignación */}
                <div>
                  <label htmlFor="assigned_date" className="block text-sm font-medium text-gray-700">
                    Fecha de Asignación *
                  </label>
                  <input
                    type="date"
                    id="assigned_date"
                    name="assigned_date"
                    value={formData.assigned_date}
                    onChange={handleInputChange}
                    max={new Date().toISOString().split('T')[0]}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.assigned_date ? 'border-red-300 ring-red-500' : ''
                    }`}
                  />
                  {errors.assigned_date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.assigned_date}
                    </p>
                  )}
                </div>

                {/* Fecha de Retorno Esperada */}
                <div>
                  <label htmlFor="expected_return_date" className="block text-sm font-medium text-gray-700">
                    Fecha de Retorno Esperada (Opcional)
                  </label>
                  <input
                    type="date"
                    id="expected_return_date"
                    name="expected_return_date"
                    value={formData.expected_return_date}
                    onChange={handleInputChange}
                    min={formData.assigned_date}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.expected_return_date ? 'border-red-300 ring-red-500' : ''
                    }`}
                  />
                  {errors.expected_return_date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.expected_return_date}
                    </p>
                  )}
                </div>
              </div>

              {/* Notas */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notas de la Asignación
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  value={formData.notes}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Información adicional sobre la asignación (propósito, condiciones especiales, etc.)"
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? 'Creando...' : 'Crear Asignación'}
            </button>
          </div>
        </form>

        {/* Mostrar errores generales */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-md p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AssignmentFormPage;