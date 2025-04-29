import { useState, FormEvent} from 'react';
import { useAuthStore } from '../stores/authStore';
import Layout from '../components/Layout/Layout';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface RegisterFormData {
    email: string;
    password: string;
    confirmPassword: string;
    full_name: string;
    is_active: boolean;
}

const UserRegisterPage = ()=>{
    const [formData, setFormData] = useState<RegisterFormData>({
      email: '',
      password: '',
      confirmPassword: '',
      full_name: '',
      is_active: true
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [statusMessage, setStatusMessage] = useState<string>('');

    // obtener la funcion register del store
    const register = useAuthStore(state => state.register);
    const isLoading = useAuthStore(state => state.isLoading);

    const validateForm = (): boolean =>{
        const newErrors: Record<string, string> = {};

        if (!formData.email) {
          newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          newErrors.email = 'El email no es válido';
        }
          
        if (!formData.password) {
          newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
          newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
          
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
          
        if (!formData.full_name) {
          newErrors.full_name = 'El nombre completo es obligatorio';
        }
          
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
          ...prev,
          [name]: type === 'checkbox' ? checked : value
      }));
        
      // Limpiar error del campo cuando se modifica
      if (errors[name]) {
          setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
          });
      }
    };

    
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    setSubmitStatus('loading');

    // Función para registrar usuario
    const registerUser = async (userData: Omit<RegisterFormData, 'confirmPassword'>) => {
        try {
          // Si estamos usando el store directamente
          if (register) {
            await register(userData);
            return;
          }
          
          // Alternativa: llamada directa a la API
          const response = await fetch('http://localhost:8000/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Error al registrar usuario');
          }
        } catch (error) {
          console.error('Error registrando usuario:', error);
          throw error;
        }
        };

      try {
        // Llamar a la API para registrar usuario
        await registerUser({
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        is_active: formData.is_active
        });
        
        setSubmitStatus('success');
        setStatusMessage('Usuario registrado con éxito');
        
        // Resetear formulario
        setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        full_name: '',
        is_active: true
        });
        
      } catch (error) {
        setSubmitStatus('error');
        setStatusMessage(error instanceof Error ? error.message : 'Error al registrar usuario');
      };
    }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-6">Registrar Nuevo Usuario</h1>
          
          {submitStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md flex items-center">
              <CheckCircle size={20} className="mr-2" />
              <span>{statusMessage}</span>
            </div>
          )}
          
          {submitStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md flex items-center">
              <AlertCircle size={20} className="mr-2" />
              <span>{statusMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full rounded-md px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`block w-full rounded-md px-3 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`block w-full rounded-md px-3 py-2 border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Nombre Completo
              </label>
              <input
                id="full_name"
                name="full_name"
                type="text"
                value={formData.full_name}
                onChange={handleChange}
                className={`block w-full rounded-md px-3 py-2 border ${errors.full_name ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-600">{errors.full_name}</p>
              )}
            </div>
            
            <div className="flex items-center">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                Usuario activo
              </label>
            </div>
            
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading || submitStatus === 'loading'}
                className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
              >
                {isLoading || submitStatus === 'loading' ? 'Registrando...' : 'Registrar Usuario'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default UserRegisterPage;