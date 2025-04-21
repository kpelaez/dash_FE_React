import Layout from '../components/Layout/Layout';


const HomePage = () => {
  return (
    <Layout>
      <div className="home-page">
        <section className="hero">
          <h1>Bienvenido al Visualizador de Dashboards</h1>
          <p>Explora análisis de datos interactivos creados con Dash y Plotly</p>
        </section>
        
        <section className="features">
          <h2>Características</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <h3>Visualizaciones Interactivas</h3>
              <p>Explora datos a través de gráficos y tablas interactivas</p>
            </div>
            <div className="feature-card">
              <h3>Múltiples Dashboards</h3>
              <p>Accede a diferentes paneles de información según tus necesidades</p>
            </div>
            <div className="feature-card">
              <h3>Diseño Responsive</h3>
              <p>Visualiza los dashboards en cualquier dispositivo</p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  )
}

export default HomePage;