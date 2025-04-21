import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";


const Header = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = ()=>{
    logout();
    navigate('/login');
  }

  return (
    <header className="app-header">
      <div className="logo">
        <h1>Panel de Visualización</h1>
      </div>
      {isAuthenticated && (
        <nav className="main-nav">
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/dashboards">Dashboards</a></li>
            <li><a href="/about">Acerca de</a></li>
            <li>
              <button
                onClick={handleLogout}
                className="logout-button"
              >
                Cerrar sesión
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}

export default Header;