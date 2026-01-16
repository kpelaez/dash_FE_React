// src/pages/Inventory/AssetFormPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import CurrencyInput from '../../components/UI/CurrencyInput';
import {
  Save,
  X,
  Tag,
  AlertCircle,
  Laptop,
  Loader2,
} from 'lucide-react';
import {useInventoryStore} from '../../stores/inventoryStore';
import { TechAssetCreate, TechAssetUpdate, AssetCategory, AssetStatus } from '../../types/inventory';
import inventoryApi from '../../services/inventoryApi';


const initialFormData: TechAssetCreate = {
  name: '',
  category: AssetCategory.NOTEBOOK,
  brand: '',
  model: '',
  serial_number: '',
  asset_tag: '',
  status: AssetStatus.AVAILABLE,
  purchase_date: '',
  purchase_price: 0,
  location: '',
  description: '',
  //
  supplier: '',
  invoice: '',
  warranty_expiry:'',
  specifications: '',
  notes: '',
};

const categories = [
  { value: 'Notebook', label: 'Notebook' },
  { value: 'Desktop', label: 'PC Desktop' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Impresora', label: 'Impresora' },
  { value: 'Celular', label: 'Celular' },
  { value: 'Servidor', label: 'Servidor' },
  { value: 'Accessorio', label: 'Accesorio' },
  { value: 'Tablet', label: 'Tablet'},
  { value: 'Mouse', label: 'Mouse'},
  { value: 'Teclado', label: 'Teclado'},
  { value: 'Kit_teclado_mouse', label: 'Kit de teclado y mouse'},
  { value: 'Software', label: 'Software'},
  { value: 'Cable', label: 'Cable'},
  { value: 'Router', label: 'Router'},
  { value: 'Otro', label: 'Otro'},
];


const statuses = [
  { value: 'available', label: 'Disponible' },
  { value: 'assigned', label: 'Asignado' },
  { value: 'in_maintenance', label: 'En Mantenimiento' },
  { value: 'retired', label: 'Retirado' },
  { value: 'out_of_order', label: 'Fuera de Servicio'},
];


// BUG FIX #2: Conversión de fechas ISO a formato YYYY-MM-DD para inputs
/**
 * Convierte una fecha ISO string a formato YYYY-MM-DD para input type="date"
 * @param isoDate Fecha en formato ISO (ej: "2024-01-15T00:00:00Z")
 * @returns Fecha en formato YYYY-MM-DD (ej: "2024-01-15") o string vacío si es inválido
 */
const formatDateForInput = (isoDate: string | undefined | null): string => {
  if (!isoDate){
    return '';
  }

  try {
    // Extraer solo la parte de la fecha (YYYY-MM-DD) ignorando la hora
    const datePart = isoDate.split('T')[0];
    return datePart;
  } catch (error) {
    console.error('Error formateando fecha:', error);
    return '';
  }
};

const AssetFormPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<TechAssetCreate>(initialFormData);
  const [errors, setErrors] = useState<Partial<TechAssetCreate>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingTag, setIsGeneratingTag] = useState(false);


  const createTechAsset = useInventoryStore(state => state.createTechAsset);
  const updateTechAsset = useInventoryStore(state => state.updateTechAsset);
  const techAssets = useInventoryStore(state => state.techAssets)
  const error = useInventoryStore(state => state.error)


  // Cargar datos del activo si estamos editando
  useEffect(() => {

    if (isEditing && id) {
      const asset = techAssets.find(a => a.id === parseInt(id));
      

      if (asset) {
        setFormData({
          name: asset.name || '',
          category: asset.category || AssetCategory.OTRO,
          brand: asset.brand || '',
          model: asset.model || '',
          serial_number: asset.serial_number || '',
          asset_tag: asset.asset_tag || '',
          status: asset.status || AssetStatus.AVAILABLE,
          purchase_date: formatDateForInput(asset.purchase_date),
          purchase_price: asset.purchase_price || 0,
          location: asset.location || '',
          description: asset.description || '',
          supplier: asset.supplier || '',
          invoice: asset.invoice || '',
          warranty_expiry: formatDateForInput(asset.warranty_expiry),
          specifications: asset.specifications || '',
          notes: asset.notes || '',
          });
        } else {
          console.log('❌ No se encontró el asset con id:', id);
        }
    }
  }, [isEditing, id, techAssets]);

  const validateForm = (): boolean => {
    const newErrors: Partial<TechAssetCreate> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.category) {
      newErrors.category = AssetCategory._ERROR_MESSAGE;
    }

    if (!formData.brand.trim()) {
      newErrors.brand = 'La marca es requerida';
    }

    if (!formData.model.trim()) {
      newErrors.model = 'El modelo es requerido';
    }

    if (!formData.serial_number.trim()) {
      newErrors.serial_number = 'El número de serie es requerido';
    }

    if (!formData.asset_tag) {
      newErrors.asset_tag = 'La etiqueta del activo es requerida';
    }

    if (!formData.purchase_date) {
      newErrors.purchase_date = 'La fecha de compra es requerida';
    }

    if (!formData.purchase_price || formData.purchase_price <= 0) {
      newErrors.purchase_price = -1 //'El precio de compra debe ser mayor a 0';
    }

    if (!formData.location || !formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if(name != 'purchase_price') {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'purchase_price' ? parseFloat(value) || 0 : value
      }));
    }

    // Limpiar error del campo si existe
    if (errors[name as keyof TechAssetCreate]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handlePriceChange = (name: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // limpiar error del campo si existe
    if (errors[name as keyof TechAssetCreate]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const generateAssetTag = async () => {
    if (!formData.category) {
      alert('Primero selecciona una categoría');
      return;
    }
    console.log("La categoria enviada es: ", formData.category); //debug

    setIsGeneratingTag(true);
    try {
      const response = await inventoryApi.generateAssetTag(formData.category);

      setFormData(prev => ({
      ...prev,
      asset_tag: response.asset_tag
      }));

      // Limpiar error si existía
      if (errors.asset_tag) {
        setErrors(prev => ({
          ...prev,
          asset_tag: undefined
        }));
      }
    } catch (error) {
      console.error('Error generando asset tag: ',error);
      alert(`Error al generar el codigo del activo: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    } finally {
      setIsGeneratingTag(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Asegurar que los datos están en el formato correcto
      const dataToSubmit: TechAssetCreate = {
        name: formData.name.trim(),
        category: formData.category,
        brand: formData.brand.trim(),
        model: formData.model.trim(),
        serial_number: formData.serial_number.trim(),
        asset_tag: formData.asset_tag?.trim(),
        status: formData.status,
        purchase_date: new Date(formData.purchase_date).toISOString(),
        purchase_price: Number(formData.purchase_price) || 0,
        location: formData.location?.trim(),
        description: formData.description || '',
        supplier: formData.supplier || '',
        invoice: formData.invoice || '',
        warranty_expiry: formData.warranty_expiry && formData.warranty_expiry.trim() ? new Date(formData.warranty_expiry).toISOString() : undefined,
        specifications: formData.specifications || '',
        notes:  formData.notes || '',
      };

      console.log('Datos limpios a enviar:', dataToSubmit) // Para debug

      if (isEditing && id) {
        // Para actualizar, crear objeto con solo los campos que pueden cambiar
        const updateData: TechAssetUpdate = {
          name: dataToSubmit.name,
          category: dataToSubmit.category,
          brand: dataToSubmit.brand,
          model: dataToSubmit.model,
          serial_number: dataToSubmit.serial_number,
          asset_tag: dataToSubmit.asset_tag,
          status: dataToSubmit.status,
          purchase_date: dataToSubmit.purchase_date,
          purchase_price: dataToSubmit.purchase_price,
          location: dataToSubmit.location,
          description: dataToSubmit.description,
          supplier: dataToSubmit.supplier,
          invoice: dataToSubmit.invoice,
          warranty_expiry:formData.warranty_expiry && formData.warranty_expiry.trim() ? new Date(formData.warranty_expiry).toISOString() : undefined,
          specifications: dataToSubmit.specifications,
          notes: dataToSubmit.notes,
        };
        
        await updateTechAsset(parseInt(id), updateData);
      } else {
        await createTechAsset(dataToSubmit);
      }

      navigate('/inventory/tech-assets');
    } catch (error) {
      console.error('Error al guardar activo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/inventory/tech-assets');
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <Laptop className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEditing ? 'Editar Activo' : 'Nuevo Activo Tecnológico'}
              </h1>
              <p className="text-sm text-gray-500">
                {isEditing 
                  ? 'Modifica la información del activo tecnológico'
                  : 'Registra un nuevo activo tecnológico en el inventario'
                }
              </p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información General</h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Nombre */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nombre del Activo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.name ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder=" Ej: MacBook Pro 13 inch"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Categoría */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Categoría *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.category ? 'border-red-300 ring-red-500' : ''
                    }`}
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.category}
                    </p>
                  )}
                </div>

                {/* Marca */}
                <div>
                  <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                    Marca *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.brand ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder=" Ej: Apple, Dell, HP"
                  />
                  {errors.brand && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.brand}
                    </p>
                  )}
                </div>

                {/* Modelo */}
                <div>
                  <label htmlFor="model" className="block text-sm font-medium text-gray-700">
                    Modelo *
                  </label>
                  <input
                    type="text"
                    id="model"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.model ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder=" Ej: MacBook Pro M2"
                  />
                  {errors.model && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.model}
                    </p>
                  )}
                </div>

                {/* Número de Serie */}
                <div>
                  <label htmlFor="serial_number" className="block text-sm font-medium text-gray-700">
                    Número de Serie *
                  </label>
                  <input
                    type="text"
                    id="serial_number"
                    name="serial_number"
                    value={formData.serial_number}
                    onChange={handleInputChange}
                    className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.serial_number ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder=" Número de serie del dispositivo"
                  />
                  {errors.serial_number && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.serial_number}
                    </p>
                  )}
                </div>

                {/* Etiqueta del Activo */}
                <div>
                  <label htmlFor="asset_tag" className="block text-sm font-medium text-gray-700">
                    Etiqueta del Activo *
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      type="text"
                      id="asset_tag"
                      name="asset_tag"
                      value={formData.asset_tag}
                      onChange={handleInputChange}
                      className={`flex-1 rounded-l-md border-gray-300 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.asset_tag ? 'border-red-300 ring-red-500' : ''
                      }`}
                      placeholder=" Ej: LAP-001234"
                      readOnly={isGeneratingTag}
                    />
                    <button
                      type="button"
                      onClick={generateAssetTag}
                      disabled={isGeneratingTag || !formData.category}
                      title="Generar etiqueta automaticamente"
                      className="inline-flex items-center px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500 text-sm hover:bg-gray-100"
                    >
                      {isGeneratingTag ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Tag className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.asset_tag && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.asset_tag}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Información de Compra */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Información de Compra</h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Fecha de Compra */}
                <div>
                  <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                    Fecha de Compra *
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      id="purchase_date"
                      name="purchase_date"
                      value={formData.purchase_date}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.purchase_date ? 'border-red-300 ring-red-500' : ''
                      }`}
                    />
                  </div>
                  {errors.purchase_date && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.purchase_date}
                    </p>
                  )}
                </div>

                {/* Precio de Compra */}
                <div>
                  <CurrencyInput
                    id="purchase_price"
                    name="purchase_price"
                    value={formData.purchase_price || 0}
                    onChange={handlePriceChange}
                    error={errors.purchase_price}
                    label="Precio de Compra"
                    placeholder="0,00"
                    required
                  />
                </div>

                {/* Proveedor */}
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                    Proveedor
                  </label>
                  <div className='mt-1 relative'>
                    <input
                      type="text"
                      id="supplier"
                      name="supplier"
                      value={formData.supplier}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder=" Proveedor del activo"
                    />
                  </div>
                </div>

                {/* Numero de Factura */}
                <div>
                  <label htmlFor="supplier" className="block text-sm font-medium text-gray-700">
                    Número de Factura
                  </label>
                  <div className='mt-1 relative'>
                    <input
                      type="text"
                      id="invoice"
                      name="invoice"
                      value={formData.invoice}
                      onChange={handleInputChange}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500`}
                      placeholder=" A-****-********"
                    />
                  </div>
                </div>

                {/* Fecha de Garantia */}
                <div>
                  <label htmlFor="purchase_date" className="block text-sm font-medium text-gray-700">
                    Fecha de Vencimiento Garantia
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="date"
                      id="warranty_expiry"
                      name="warranty_expiry"
                      value={formData.warranty_expiry}
                      onChange={handleInputChange}
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500`}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Ubicación y Descripción */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Ubicación y Detalles</h3>
            </div>
            <div className="px-6 py-4 space-y-6">
              {/* Estado */}
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  >
                    {statuses.map(status => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>

              {/* Ubicación */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Ubicación Física del Activo
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className={`block w-full pl-10 rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500 ${
                      errors.location ? 'border-red-300 ring-red-500' : ''
                    }`}
                    placeholder="Ej: Oficina Principal, Piso 2, Sala de Reuniones"
                  />
                </div>
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.location}
                  </p>
                )}
              </div>

              {/* Especificaciones */}
                <div className="sm:col-span-2">
                  <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
                    Especificaciones Técnicas
                  </label>
                  <textarea
                    id="specifications"
                    name="specifications"
                    rows={3}
                    value={formData.specifications}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                    placeholder=" RAM, procesador, almacenamiento, etc."
                  />
                </div>

              {/* Notas */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción Extendida
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder=" Información adicional sobre el activo (especificaciones, configuración, etc.)"
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
              {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar Activo' : 'Crear Activo'}
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

export default AssetFormPage;