import Layout from '../components/Layout/Layout';

const AboutPage = () => {
  return (
    <Layout>
      <div className="about-page">
        <h1>Acerca del Proyecto</h1>
        <p>
          Esta aplicación fue creada para visualizar dashboards analíticos desarrollados 
          con Dash y Plotly. Permite a los usuarios acceder fácilmente a diferentes 
          paneles de datos interactivos.
        </p>
        
        <h2>Tecnologías Utilizadas</h2>
        <ul>
          <li>React con TypeScript para el frontend</li>
          <li>Dash y Plotly para los dashboards analíticos</li>
          <li>React Router para la navegación</li>
        </ul>
        
        <h2>Equipo</h2>
        <p>
          Desarrollada por [Tu nombre] en colaboración con [Nombre de tu compañero] 
          quien creó los dashboards con Dash y Plotly.
        </p>
      </div>
    </Layout>
  );
};

export default AboutPage;