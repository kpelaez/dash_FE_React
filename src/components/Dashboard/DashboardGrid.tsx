import DashboardViewer from './DashboardViewer';

interface DashboardConfig {
  id: string;
  title: string;
  url: string;
  description?: string;
  size?: 'small' | 'medium' | 'large'; // Para controlar tamaño del grid
}

interface DashboardGridProps {
  dashboards: DashboardConfig[];
}

const DashboardGrid = ({ dashboards }: DashboardGridProps) => {
  // Función para determinar las clases de grid según el tamaño
  const getSizeClasses = (size: 'small' | 'medium' | 'large' = 'medium') => {
    switch (size) {
      case 'small':
        return 'col-span-1';
      case 'medium':
        return 'col-span-1 md:col-span-2';
      case 'large':
        return 'col-span-1 md:col-span-3';
      default:
        return 'col-span-1 md:col-span-2';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {dashboards.map((dashboard) => (
        <div key={dashboard.id} className={getSizeClasses(dashboard.size)}>
          <DashboardViewer
            id={dashboard.id}
            url={dashboard.url}
            title={dashboard.title}
            description={dashboard.description}
            height={dashboard.size === 'small' ? '400px' : '600px'}
          />
        </div>
      ))}
    </div>
  );
};

export default DashboardGrid;