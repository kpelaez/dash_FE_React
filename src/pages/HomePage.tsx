import { Laptop, ShieldCheck, PlaneTakeoff, ChevronRight } from 'lucide-react';

const ComingSoonSection = ()=> {
  const upcomingFeatures = [
    {
      icon:<Laptop size={20} color={'#1bbb60'} /> ,
      title: "Gestión de activos tecnologicos",
      description: "Control detallado del inventario de articulos tecnologicos de la compañia con sus ubicaciones y su gestion de mantenimientos",
      estimatedDate: "Q2 2025",
      status: "Planificado",
    },
    {
      icon:<ShieldCheck size={20} color={'#1bbb60'} />,
      title: "Administración de roles avanzados",
      description: "Permisos granulares y personalizables para diferentes áreas del sistema.",
      estimatedDate: "Q2 2025",
      status: "En diseño"
    },
    {
      icon:<PlaneTakeoff size={20} color={'#1bbb60'} />,
      title: "Tracker de importaciones",
      description: "Linea de tiempo con P.O. solicitadas y fechas estimadas de llegada al país y Omnimedica",
      estimatedDate: "Q2 2025",
      status: "En Planificacion"
    },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md p-6 mt-8'>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2x1 font-bold text-gray-900">Próximamente en Omnimedica</h2>
        <span className="bg-emerald-100 text-emerald-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Roadmap 2025</span>
      </div>

      <p className="text-gray-600 mb-6">
        Estamos trabajando constantemente para mejorar nuestro sistema. Estas son algunas de las funcionalidades que pronto estarán disponibles:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {upcomingFeatures.map((feature,index) => (
          <div 
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-300 bg-white relative overflow-hidden"
            >
              {/* Indicador de estado  */}
              <div className={`absolute top-0 right-0 px-2 py-1 text-xs font-semibold rounded-bl-lg
                ${feature.status === 'En desarrollo' && 'bg-green-100 text-green-800'}
                ${feature.status === 'Planificado' && 'bg-blue-100 text-blue-800'}
                ${feature.status === 'En diseño' && 'bg-purple-100 text-purple-800'}
                ${feature.status === 'En investigación' && 'bg-amber-100 text-amber-800'}
                `}>
                  {feature.status}
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 p-2 bg-gray-50 rounded-lg mr-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {feature.description}
                  </p>
                  <div className="flex items-center mt-3 text-xs text-gray-500">
                    <span className="flex items-center">
                      Previsto: {feature.estimatedDate}
                    </span>
                  </div>
                </div>
              </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <button className="inline-flex items-center text-emerald-600 hover:text-emerald-800 font-medium">
          Ver roadmap completo <ChevronRight size={16} className="ml-1"/>
        </button>
      </div> 
    </div>
  );
}

const HomePage = () => {
  return (
      <div className="p-6 h-full overflow-y-auto">
      <section className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bienvenido a StoneFixer
        </h1>
      </section>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Características
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-emerald-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Visualizaciones Interactivas
            </h3>
            <p className="text-gray-600">
              Explora datos a través de gráficos y tablas interactivas
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-emerald-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Múltiples Dashboards
            </h3>
            <p className="text-gray-600">
              Accede a diferentes paneles de información según tus necesidades
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-emerald-300 transition-colors">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Diseño Responsive
            </h3>
            <p className="text-gray-600">
              Visualiza los dashboards en cualquier dispositivo
            </p>
          </div>
        </div>
      </section>
      
      <ComingSoonSection />
    </div>
  )
}

export default HomePage;