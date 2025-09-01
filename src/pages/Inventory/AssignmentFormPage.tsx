import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
  CheckCircle,
  Loader2,
  MapPin
} from 'lucide-react';
import {useInventoryStore} from '../../stores/inventoryStore';
import { AssetAssignmentCreate, TechAsset, AssignmentStatus, AssetStatus } from '../../types/inventory';
import inventoryApi from '../../services/inventoryApi';

interface UserOption {
  id: number;
  full_name: string;
  email: string;
  department?: string;
}

interface AssetOption {
  id: number;
  name: string;
  asset_tag?: string;
  brand: string;
  model: string;
  category: string;
  status: string;
}


// interface AssignmentFormData {
//   tech_asset_id: number | '';
//   user_id: number | '';
//   assigned_date: string;
//   expected_return_date: string;
//   notes: string;
//   location: string;
//   condition_at_assignment: string;
// }

interface User {
  id: number;
  full_name: string;
  email: string;
  is_active: boolean;
}

const initialFormData: AssetAssignmentCreate = {
  tech_asset_id: 0,
  assigned_to_user_id: 0,
  expected_return_date: '',
  assignment_reason: '',
  location_of_use: '',
  condition_at_assignment: 'good',
  assignment_notes: '',
  assigned_date: '',
};


const AssignmentFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState<AssetAssignmentCreate>(initialFormData);
  const [errors, setErrors] = useState<Partial<AssetAssignmentCreate>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  
  const [users, setUsers] = useState<UserOption[]>([]);
  const [availableAssets, setAvailableAssets] = useState<AssetOption[]>([]);
  const [selectedAssets, setSelectedAssets] = useState<number[]>([]);

  // Estados para búsqueda
  const [assetSearch, setAssetSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  
  const createAssignment = useInventoryStore(state => state.createAssignment);
  const error = useInventoryStore(state => state.error);
  
  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const usersData = await inventoryApi.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const loadAvailableAssets = async () => {
    setIsLoadingAssets(true);
    try {
      const assetsData = await inventoryApi.getTechAssets({ status: AssetStatus.AVAILABLE });
      setAvailableAssets(assetsData);
    } catch (error) {
      console.error('Error loading assets:', error);
    } finally {
      setIsLoadingAssets(false);
    }
  };

  // Cargar usuarios y activos al montar el componente
  useEffect(() => {
    loadUsers();
    loadAvailableAssets();
    
    // Verificar si hay parámetros de URL
    const assetId = searchParams.get('asset_id');
    const assetIds = searchParams.get('asset_ids');
    
    if (assetId) {
      const id = parseInt(assetId);
      setSelectedAssets([id]);
      setFormData(prev => ({ ...prev, tech_asset_id: id }));
    } else if (assetIds) {
      const ids = assetIds.split(',').map(id => parseInt(id));
      setSelectedAssets(ids);
    }
  }, [searchParams]);


  // Filtrar activos disponibles
  const filteredAssets = availableAssets.filter(asset =>
     asset?.name.toLowerCase().includes(assetSearch.toLowerCase()) ||
     (asset.asset_tag && asset.asset_tag.toLowerCase().includes(assetSearch.toLowerCase())) ||
     asset?.brand.toLowerCase().includes(assetSearch.toLowerCase()) ||
     asset?.model.toLowerCase().includes(assetSearch.toLowerCase()));

  // Filtrar usuarios activos
  const filteredUsers = users.filter(user =>
    user.full_name.toLowerCase().includes(userSearch.toLowerCase()) ||
    user.email.toLowerCase().includes(userSearch.toLowerCase()) ||
    (user.department && user.department.toLowerCase().includes(userSearch.toLowerCase()))
  );

  const validateForm = (): boolean => {
    const newErrors: Partial<AssetAssignmentCreate> = {};

    if (selectedAssets.length === 0 && !formData.tech_asset_id) {
      newErrors.tech_asset_id = 0; // Usar 0 como indicador de error
    }

    if (!formData.assigned_to_user_id) {
      newErrors.assigned_to_user_id = 0;
    }

    if (!formData.assignment_reason || !formData.assignment_reason.trim()) {
      newErrors.assignment_reason = 'La razón de asignación es requerida';
    }

    if (!formData.location_of_use || !formData.location_of_use.trim()) {
      newErrors.location_of_use = 'La ubicación de uso es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'assigned_to_user_id' || name === 'tech_asset_id' 
        ? parseInt(value) || 0 
        : value
    }));

    // Limpiar error del campo si existe
    if (errors[name as keyof AssetAssignmentCreate]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar error del campo si existe
    if (errors[name as keyof AssetAssignmentCreate]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleAssetToggle = (assetId: number) => {
    setSelectedAssets(prev => {
      const newSelection = prev.includes(assetId)
        ? prev.filter(id => id !== assetId)
        : [...prev, assetId];
      
      // Si es asignación individual, actualizar formData
      if (newSelection.length === 1) {
        setFormData(prevForm => ({ ...prevForm, tech_asset_id: newSelection[0] }));
      }
      
      return newSelection;
    });
  };
// =============================================
  // const handleUserSelect = (user: User) => {
  //   setFormData(prev => ({
  //     ...prev,
  //     user_id: user.id
  //   }));
  //   setUserSearch(`${user.full_name} (${user.email})`);
  //   setShowUserDropdown(false);
    
  //   // Limpiar error si existe
  //   if (errors.user_id) {
  //     setErrors(prev => ({
  //       ...prev,
  //       user_id: undefined
  //     }));
  //   }
  // };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const assetsToAssign = selectedAssets.length > 0 ? selectedAssets : [formData.tech_asset_id];
      
      // Crear una asignación por cada activo seleccionado
      const assignmentPromises = assetsToAssign.map(assetId => {
        const assignmentData: AssetAssignmentCreate = {
          ...formData,
          tech_asset_id: assetId,
          expected_return_date: formData.expected_return_date 
            ? new Date(formData.expected_return_date).toISOString() 
            : undefined
        };
        
        return createAssignment(assignmentData);
      });

      await Promise.all(assignmentPromises);

      const message = assetsToAssign.length === 1 
        ? 'Activo asignado exitosamente' 
        : `${assetsToAssign.length} activos asignados exitosamente`;

      navigate('/inventory/assignments', { 
        state: { message } 
      });
    } catch (error) {
      console.error('Error al crear asignación:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-sm rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedAssets.length > 1 ? 'Asignar Múltiples Activos' : 'Asignar Activo'}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Asigna activos tecnológicos a usuarios de la organización
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4">
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

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Selección de Usuario */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Usuario Asignado *
                </label>
                
                {/* Búsqueda de usuarios */}
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Buscar usuario por nombre, email o departamento..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-md">
                  {isLoadingUsers ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No se encontraron usuarios
                    </div>
                  ) : (
                    filteredUsers.map((user) => (
                      <label key={user.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0">
                        <input
                          type="radio"
                          name="assigned_to_user_id"
                          value={user.id}
                          checked={formData.assigned_to_user_id === user.id}
                          onChange={handleInputChange}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.full_name}</div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                            {user.department && ` • ${user.department}`}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {errors.assigned_to_user_id && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Selecciona un usuario
                  </p>
                )}
              </div>

              {/* Selección de Activos */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Package className="inline h-4 w-4 mr-1" />
                  Activos a Asignar *
                </label>

                {selectedAssets.length > 0 && (
                  <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm text-blue-800 font-medium">
                      {selectedAssets.length} activo(s) preseleccionado(s)
                    </p>
                  </div>
                )}
                
                {/* Búsqueda de activos */}
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={assetSearch}
                    onChange={(e) => setAssetSearch(e.target.value)}
                    placeholder="Buscar activo por nombre, etiqueta, marca o modelo..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto border border-gray-300 rounded-md">
                  {isLoadingAssets ? (
                    <div className="flex justify-center items-center h-20">
                      <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
                    </div>
                  ) : filteredAssets.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No hay activos disponibles para asignar
                    </div>
                  ) : (
                    filteredAssets.map((asset) => (
                      <label key={asset.id} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-200 last:border-b-0">
                        <input
                          type="checkbox"
                          checked={selectedAssets.includes(asset.id)}
                          onChange={() => handleAssetToggle(asset.id)}
                          className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                        />
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {asset.name} • {asset.asset_tag}
                          </div>
                          <div className="text-sm text-gray-500">
                            {asset.brand} {asset.model} • {asset.category}
                          </div>
                        </div>
                      </label>
                    ))
                  )}
                </div>
                {errors.tech_asset_id !== undefined && selectedAssets.length === 0 && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    Selecciona al menos un activo
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {/* Razón de Asignación */}
                <div className="sm:col-span-2">
                  <label htmlFor="assignment_reason" className="block text-sm font-medium text-gray-700">
                    Razón de Asignación *
                  </label>
                  <select
                    id="assignment_reason"
                    name="assignment_reason"
                    value={formData.assignment_reason}
                    onChange={handleSelectChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.assignment_reason ? 'border-red-300 ring-red-500' : ''
                    }`}
                  >
                    <option value="">Selecciona una razón</option>
                    <option value="work_assignment">Asignación de trabajo</option>
                    <option value="home_office">Trabajo remoto/Home office</option>
                    <option value="project">Proyecto específico</option>
                    <option value="temporary_replacement">Reemplazo temporal</option>
                    <option value="permanent_assignment">Asignación permanente</option>
                    <option value="training">Capacitación/Training</option>
                    <option value="other">Otro</option>
                  </select>
                  {errors.assignment_reason && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.assignment_reason}
                    </p>
                  )}
                </div>

                {/* Ubicación de Uso */}
                <div>
                  <label htmlFor="location_of_use" className="block text-sm font-medium text-gray-700">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Ubicación de Uso *
                  </label>
                  <input
                    type="text"
                    id="location_of_use"
                    name="location_of_use"
                    value={formData.location_of_use}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.location_of_use ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder="Ej: Oficina Central, Casa del empleado, Sucursal Norte"
                  />
                  {errors.location_of_use && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.location_of_use}
                    </p>
                  )}
                </div>

                {/* Fecha de Retorno Esperada */}
                <div>
                  <label htmlFor="expected_return_date" className="block text-sm font-medium text-gray-700">
                    <Calendar className="inline h-4 w-4 mr-1" />
                    Fecha de Retorno Esperada
                  </label>
                  <input
                    type="date"
                    id="expected_return_date"
                    name="expected_return_date"
                    value={formData.expected_return_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Opcional. Fecha estimada para la devolución del activo.
                  </p>
                </div>

                {/* Condición del Activo */}
                <div>
                  <label htmlFor="condition_at_assignment" className="block text-sm font-medium text-gray-700">
                    Condición del Activo
                  </label>
                  <select
                    id="condition_at_assignment"
                    name="condition_at_assignment"
                    value={formData.condition_at_assignment}
                    onChange={handleSelectChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    <option value="excellent">Excelente</option>
                    <option value="good">Buena</option>
                    <option value="fair">Regular</option>
                    <option value="poor">Deficiente</option>
                    <option value="needs_repair">Necesita reparación</option>
                  </select>
                </div>

                {/* Notas de Asignación */}
                <div className="sm:col-span-2">
                  <label htmlFor="assignment_notes" className="block text-sm font-medium text-gray-700">
                    Notas de Asignación
                  </label>
                  <textarea
                    id="assignment_notes"
                    name="assignment_notes"
                    rows={3}
                    value={formData.assignment_notes}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder="Información adicional sobre la asignación..."
                  />
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="pt-5">
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/inventory/assignments')}
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    disabled={isSubmitting}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin -ml-1 mr-3 h-4 w-4" />
                        Asignando...
                      </>
                    ) : (
                      `Asignar ${selectedAssets.length > 1 ? `${selectedAssets.length} Activos` : 'Activo'}`
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AssignmentFormPage;