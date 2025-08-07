import { useNavigate } from 'react-router-dom';
import { ExternalLink, BarChart3 } from 'lucide-react';

interface DashboardConfig {
  id: string;
  title: string;
  url: string;
  description?: string;
  size?: 'small' | 'medium' | 'large';
}

interface MobileDashboardGridProps {
  dashboards: DashboardConfig[];
}

const MobileDashboardGrid = ({ dashboards }: MobileDashboardGridProps) => {
  const navigate = useNavigate();

  const handleDashboardClick = (dashboard: DashboardConfig) => {
    navigate(`/dashboards/${dashboard.id}`);
  };

  return (
    <div className="space-y-4">
      {dashboards.map((dashboard) => (
        <div
          key={dashboard.id}
          onClick={() => handleDashboardClick(dashboard)}
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 active:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="flex-shrink-0 p-2 bg-emerald-100 rounded-lg">
                <BarChart3 size={20} className="text-emerald-600" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {dashboard.title}
                </h3>
                {dashboard.description && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {dashboard.description}
                  </p>
                )}
                
                <div className="mt-3 flex items-center text-xs text-emerald-600 font-medium">
                  <span>Ver dashboard</span>
                  <ExternalLink size={12} className="ml-1" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileDashboardGrid;