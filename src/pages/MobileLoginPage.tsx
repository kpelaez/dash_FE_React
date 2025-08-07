import React, { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

const MobileLoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(credentials);
    } catch (err) {
      console.error('Error de login: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-white flex flex-col">
      {/* Header con logo */}
      <div className="flex-shrink-0 pt-8 pb-4">
        <div className="text-center">
          <img
            alt="Omnimedica Logo"
            src="/LOGO OMNIMEDICA.png"
            className="mx-auto h-20 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-900">
            Bienvenido a StoneFixer
          </h1>
          <p className="text-gray-600 mt-1">
            Ingresa tus credenciales para continuar
          </p>
        </div>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex items-start justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Campo Email */}
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Correo electrónico
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={credentials.email}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`
                      block w-full px-4 py-3 rounded-xl border text-base
                      ${focusedField === 'email' 
                        ? 'border-emerald-500 ring-2 ring-emerald-200' 
                        : 'border-gray-300'
                      }
                      placeholder:text-gray-400 focus:outline-none
                      transition-all duration-200
                    `}
                    placeholder="tu@email.com"
                  />
                </div>
              </div>

              {/* Campo Contraseña */}
              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={credentials.password}
                    onChange={handleChange}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`
                      block w-full px-4 py-3 pr-12 rounded-xl border text-base
                      ${focusedField === 'password' 
                        ? 'border-emerald-500 ring-2 ring-emerald-200' 
                        : 'border-gray-300'
                      }
                      placeholder:text-gray-400 focus:outline-none
                      transition-all duration-200
                    `}
                    placeholder="Tu contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botón de submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`
                    w-full py-3 px-4 rounded-xl text-base font-semibold text-white
                    ${isLoading 
                      ? 'bg-emerald-400 cursor-not-allowed' 
                      : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                    }
                    transition-colors duration-200
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500
                  `}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                      Iniciando sesión...
                    </div>
                  ) : (
                    'Iniciar sesión'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿Problemas para acceder?{' '}
              <button className="text-emerald-600 hover:text-emerald-700 font-medium">
                Contacta soporte
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Footer con información */}
      <div className="flex-shrink-0 p-6 text-center">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} StoneFixer by Omnimedica. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
};

export default MobileLoginPage;