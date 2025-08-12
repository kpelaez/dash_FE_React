import { useState } from 'react';
import ResponsiveLayout from '../components/Layout/ResponsiveLayout';
import { 
  Laptop, 
  ShieldCheck, 
  PlaneTakeoff, 
  ChevronRight, 
  BarChart3, 
  Users, 
  Settings,
  Clock,
  Star
} from 'lucide-react';

const MobileHomePage = () => {
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const upcomingFeatures = [
    {
      icon: <Laptop size={24} className="text-emerald-600" />,
      title: "Gestión de activos tecnológicos",
      description: "Control detallado del inventario de artículos tecnológicos de la compañía con sus ubicaciones y gestión de mantenimientos",
      estimatedDate: "Q2 2025",
      status: "Planificado",
      statusColor: "bg-blue-100 text-blue-800",
      priority: "Alta"
    },
    {
      icon: <ShieldCheck size={24} className="text-emerald-600" />,
      title: "Administración de roles avanzados",
      description: "Permisos granulares y personalizables para diferentes áreas del sistema.",
      estimatedDate: "Q2 2025",
      status: "En diseño",
      statusColor: "bg-purple-100 text-purple-800",
      priority: "Media"
    },
    {
      icon: <PlaneTakeoff size={24} className="text-emerald-600" />,
      title: "Tracker de importaciones",
      description: "Línea de tiempo con P.O. solicitadas y fechas estimadas de llegada al país y Omnimedica",
      estimatedDate: "Q2 2025",
      status: "En planificación",
      statusColor: "bg-amber-100 text-amber-800",
      priority: "Alta"
    },
  ];

  const quickStats = [
    { label: "Dashboards", value: "5", icon: <BarChart3 size={20} />, color: "bg-blue-500" },
    { label: "Usuarios activos", value: "24", icon: <Users size={20} />, color: "bg-green-500" },
    { label: "Sectores", value: "6", icon: <Settings size={20} />, color: "bg-purple-500" },
  ];

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  return (
    <ResponsiveLayout>
      <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">¡Bienvenido a StoneFixer!</h1>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Tu plataforma integral para la gestión empresarial inteligente
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 mt-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                <div className={`${stat.color} w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <div className="text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-lg font-bold">{stat.value}</div>
                <div className="text-xs text-emerald-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Características principales</h2>
            <Star className="text-yellow-500" size={20} />
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 p-2 rounded-lg">
                  <BarChart3 className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Visualizaciones Interactivas</h3>
                  <p className="text-sm text-gray-600">Explora datos a través de gráficos dinámicos</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 p-2 rounded-lg">
                  <Settings className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Múltiples Dashboards</h3>
                  <p className="text-sm text-gray-600">Acceso a paneles especializados por sector</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="bg-purple-500 p-2 rounded-lg">
                  <Users className="text-white" size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Diseño Responsive</h3>
                  <p className="text-sm text-gray-600">Optimizado para cualquier dispositivo</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap Section */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Próximamente</h2>
              <p className="text-sm text-gray-600">Nuevas funcionalidades en desarrollo</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-3 py-1 rounded-full">
              Roadmap 2025
            </span>
          </div>

          <div className="space-y-3">
            {upcomingFeatures.map((feature, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleCard(index)}
                  className="w-full p-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 p-2 bg-emerald-50 rounded-lg">
                        {feature.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm">{feature.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${feature.statusColor}`}>
                            {feature.status}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center">
                            <Clock size={12} className="mr-1" />
                            {feature.estimatedDate}
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight 
                      size={16} 
                      className={`text-gray-400 transform transition-transform ${
                        expandedCard === index ? 'rotate-90' : ''
                      }`} 
                    />
                  </div>
                </button>
                
                {expandedCard === index && (
                  <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                    <div className="pt-3">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {feature.description}
                      </p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-gray-500">
                          Prioridad: <span className="font-medium">{feature.priority}</span>
                        </span>
                        <button className="text-xs text-emerald-600 font-medium hover:text-emerald-700">
                          Más detalles →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium text-sm">
              Ver roadmap completo
              <ChevronRight size={16} className="ml-1" />
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones rápidas</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 rounded-xl text-center transition-colors">
              <BarChart3 className="text-emerald-600 mx-auto mb-2" size={24} />
              <span className="text-sm font-medium text-emerald-800">Ver Dashboards</span>
            </button>
            
            <button className="p-4 bg-blue-50 hover:bg-blue-100 active:bg-blue-200 rounded-xl text-center transition-colors">
              <Users className="text-blue-600 mx-auto mb-2" size={24} />
              <span className="text-sm font-medium text-blue-800">Explorar Sectores</span>
            </button>
            
            <button className="p-4 bg-purple-50 hover:bg-purple-100 active:bg-purple-200 rounded-xl text-center transition-colors">
              <Settings className="text-purple-600 mx-auto mb-2" size={24} />
              <span className="text-sm font-medium text-purple-800">Configuración</span>
            </button>
            
            <button className="p-4 bg-amber-50 hover:bg-amber-100 active:bg-amber-200 rounded-xl text-center transition-colors">
              <Clock className="text-amber-600 mx-auto mb-2" size={24} />
              <span className="text-sm font-medium text-amber-800">Actividad Reciente</span>
            </button>
          </div>
        </div>
      </div>
    </ResponsiveLayout>
  );
};

export default MobileHomePage;