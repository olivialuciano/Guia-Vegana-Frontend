import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import ReportsTable from '../../components/ReportsTable/ReportsTable';
import { 
  faChartBar, 
  faChartLine, 
  faChartPie, 
  faUsers, 
  faStore, 
  faLeaf,
  faCalendarAlt,
  faTrophy,
  faArrowLeft,
  faDownload,
  faTable,
  faArrowUp
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './ReportDetail.css';

const ReportDetail = () => {
  const { reportId } = useParams();
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reports, setReports] = useState({
    businessByUser: [],
    topUsersLastMonth: [],
    businessWithMostVeganOptions: [],
    topBusinessesByVeganOptions: [],
    monthlyStats: {},
    userActivity: [],
    allBusinesses: [],
    allUsers: []
  });
  const [showTable, setShowTable] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'Sysadmin') {
      setError('Acceso no autorizado');
      setLoading(false);
      return;
    }
    fetchReports();
  }, [user]);

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch all data in parallel
      const [
        businessesResponse,
        usersResponse,
        veganOptionsResponse
      ] = await Promise.all([
        fetch('https://localhost:7032/api/Business', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://localhost:7032/api/User', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('https://localhost:7032/api/VeganOption', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);

      if (!businessesResponse.ok || !usersResponse.ok || !veganOptionsResponse.ok) {
        throw new Error('Error al cargar los datos');
      }

      const businesses = await businessesResponse.json();
      const users = await usersResponse.json();
      const veganOptions = await veganOptionsResponse.json();

      // Process data for reports
      const processedReports = processReportData(businesses, users, veganOptions);
      setReports(processedReports);
    } catch (err) {
      setError('Error al cargar los reportes: ' + err.message);
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const processReportData = (businesses, users, veganOptions) => {
    // Business by User
    const businessByUser = users.map(user => {
      const userBusinesses = businesses.filter(b => b.userId === user.id);
      return {
        userName: user.name,
        userEmail: user.email,
        businessCount: userBusinesses.length,
        businesses: userBusinesses,
        isActive: user.isActive,
        role: user.role
      };
    }).filter(item => item.businessCount > 0);

    // Top Users Last Month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const topUsersLastMonth = users.map(user => {
      const userBusinesses = businesses.filter(b => 
        b.userId === user.id && new Date(b.createdAt || b.dateCreated) >= lastMonth
      );
      return {
        userName: user.name,
        userEmail: user.email,
        businessCount: userBusinesses.length,
        businesses: userBusinesses,
        isActive: user.isActive,
        role: user.role
      };
    }).filter(item => item.businessCount > 0)
      .sort((a, b) => b.businessCount - a.businessCount)
      .slice(0, 10);

    // Business with Most Vegan Options
    const businessWithMostVeganOptions = businesses.map(business => {
      const businessVeganOptions = veganOptions.filter(vo => vo.businessId === business.id);
      return {
        businessName: business.name,
        businessZone: business.zone,
        businessType: business.businessType,
        veganOptionsCount: businessVeganOptions.length,
        business: business,
        veganOptions: businessVeganOptions
      };
    }).filter(item => item.veganOptionsCount > 0)
      .sort((a, b) => b.veganOptionsCount - a.veganOptionsCount);

    // Top 10 Businesses by Vegan Options
    const topBusinessesByVeganOptions = businessWithMostVeganOptions.slice(0, 10);

    // Monthly Stats
    const monthlyStats = {
      totalBusinesses: businesses.length,
      totalUsers: users.length,
      totalVeganOptions: veganOptions.length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length,
      averageVeganOptionsPerBusiness: businesses.length > 0 ? (veganOptions.length / businesses.length).toFixed(1) : 0
    };

    // User Activity (last 6 months)
    const userActivity = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthName = date.toLocaleString('es-ES', { month: 'long' });
      const monthBusinesses = businesses.filter(b => {
        const businessDate = new Date(b.createdAt || b.dateCreated);
        return businessDate.getMonth() === date.getMonth() && 
               businessDate.getFullYear() === date.getFullYear();
      });
      userActivity.push({
        month: monthName,
        businessCount: monthBusinesses.length
      });
    }

    return {
      businessByUser,
      topUsersLastMonth,
      businessWithMostVeganOptions,
      topBusinessesByVeganOptions,
      monthlyStats,
      userActivity,
      allBusinesses: businesses,
      allUsers: users
    };
  };

  const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]).filter(key => key !== 'businesses' && key !== 'veganOptions');
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getReportConfig = () => {
    switch (reportId) {
      case 'overview':
        return {
          title: 'Resumen General',
          icon: faChartBar,
          color: '#4CAF50',
          description: 'Estadísticas generales del sistema'
        };
      case 'businessByUser':
        return {
          title: 'Negocios por Usuario',
          icon: faUsers,
          color: '#2196F3',
          description: 'Análisis de cuántos negocios creó cada usuario'
        };
      case 'topUsersLastMonth':
        return {
          title: 'Top Usuarios del Mes',
          icon: faCalendarAlt,
          color: '#FF9800',
          description: 'Usuarios más activos en el último mes'
        };
      case 'topBusinessesByVeganOptions':
        return {
          title: 'Top Negocios por Opciones Veganas',
          icon: faLeaf,
          color: '#4CAF50',
          description: 'Los 10 negocios con más opciones veganas'
        };
      case 'userActivity':
        return {
          title: 'Actividad de Usuarios',
          icon: faChartLine,
          color: '#9C27B0',
          description: 'Tendencias de actividad en los últimos 6 meses'
        };
      default:
        return {
          title: 'Reporte',
          icon: faChartBar,
          color: '#666',
          description: 'Reporte del sistema'
        };
    }
  };

  const renderOverview = () => (
    <div className="overview-section">
      <h2>Resumen General</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faStore} />
          </div>
          <div className="stat-content">
            <h3>{reports.monthlyStats.totalBusinesses}</h3>
            <p>Total de Negocios</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-content">
            <h3>{reports.monthlyStats.totalUsers}</h3>
            <p>Total de Usuarios</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faLeaf} />
          </div>
          <div className="stat-content">
            <h3>{reports.monthlyStats.totalVeganOptions}</h3>
            <p>Opciones Veganas</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="stat-content">
            <h3>{reports.monthlyStats.activeUsers}</h3>
            <p>Usuarios Activos</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faChartPie} />
          </div>
          <div className="stat-content">
            <h3>{reports.monthlyStats.averageVeganOptionsPerBusiness}</h3>
            <p>Promedio Opciones/Negocio</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FontAwesomeIcon icon={faUsers} />
          </div>
          <div className="stat-content">
            <h3>{reports.monthlyStats.inactiveUsers}</h3>
            <p>Usuarios Inactivos</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessByUser = () => {
    const tableColumns = [
      { key: 'userName', header: 'Usuario' },
      { key: 'userEmail', header: 'Email' },
      { key: 'businessCount', header: 'Negocios Creados' },
      { key: 'role', header: 'Rol' },
      { key: 'isActive', header: 'Estado', render: (value) => value ? 'Activo' : 'Inactivo' }
    ];

    return (
      <div className="report-section">
        <div className="report-header">
          <h2>Negocios por Usuario</h2>
          <div className="report-actions">
            <button 
              className="action-btn"
              onClick={() => setShowTable(!showTable)}
            >
              <FontAwesomeIcon icon={faTable} />
              {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}
            </button>
            <button 
              className="action-btn"
              onClick={() => exportToCSV(reports.businessByUser, 'negocios_por_usuario')}
            >
              <FontAwesomeIcon icon={faDownload} />
              Exportar CSV
            </button>
          </div>
        </div>
        
        <div className="chart-container">
          <div className="bar-chart">
            {reports.businessByUser.map((item, index) => (
              <div key={index} className="bar-item">
                <div className="bar-label">{item.userName}</div>
                <div className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ width: `${(item.businessCount / Math.max(...reports.businessByUser.map(i => i.businessCount))) * 100}%` }}
                  >
                    <span className="bar-value">{item.businessCount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showTable && (
          <ReportsTable
            data={reports.businessByUser}
            columns={tableColumns}
            title="Detalle de Negocios por Usuario"
          />
        )}
      </div>
    );
  };

  const renderTopUsersLastMonth = () => {
    const tableColumns = [
      { key: 'userName', header: 'Usuario' },
      { key: 'userEmail', header: 'Email' },
      { key: 'businessCount', header: 'Negocios Creados' },
      { key: 'role', header: 'Rol' },
      { key: 'isActive', header: 'Estado', render: (value) => value ? 'Activo' : 'Inactivo' }
    ];

    return (
      <div className="report-section">
        <div className="report-header">
          <h2>Top Usuarios del Último Mes</h2>
          <div className="report-actions">
            <button 
              className="action-btn"
              onClick={() => setShowTable(!showTable)}
            >
              <FontAwesomeIcon icon={faTable} />
              {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}
            </button>
            <button 
              className="action-btn"
              onClick={() => exportToCSV(reports.topUsersLastMonth, 'top_usuarios_mes')}
            >
              <FontAwesomeIcon icon={faDownload} />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="ranking-list">
          {reports.topUsersLastMonth.map((user, index) => (
            <div key={index} className="ranking-item">
              <div className="ranking-position">
                <FontAwesomeIcon icon={faTrophy} className={index < 3 ? 'trophy' : ''} />
                <span>{index + 1}</span>
              </div>
              <div className="ranking-info">
                <h4>{user.userName}</h4>
                <p>{user.businessCount} negocios creados</p>
              </div>
              <div className="ranking-arrow">
                <FontAwesomeIcon icon={faArrowUp} />
              </div>
            </div>
          ))}
        </div>

        {showTable && (
          <ReportsTable
            data={reports.topUsersLastMonth}
            columns={tableColumns}
            title="Detalle de Top Usuarios del Mes"
          />
        )}
      </div>
    );
  };

  const renderTopBusinessesByVeganOptions = () => {
    const tableColumns = [
      { key: 'businessName', header: 'Negocio' },
      { key: 'businessZone', header: 'Zona' },
      { key: 'businessType', header: 'Tipo' },
      { key: 'veganOptionsCount', header: 'Opciones Veganas' }
    ];

    return (
      <div className="report-section">
        <div className="report-header">
          <h2>Top 10 Negocios por Opciones Veganas</h2>
          <div className="report-actions">
            <button 
              className="action-btn"
              onClick={() => setShowTable(!showTable)}
            >
              <FontAwesomeIcon icon={faTable} />
              {showTable ? 'Ocultar Tabla' : 'Mostrar Tabla'}
            </button>
            <button 
              className="action-btn"
              onClick={() => exportToCSV(reports.topBusinessesByVeganOptions, 'top_negocios_opciones_veganas')}
            >
              <FontAwesomeIcon icon={faDownload} />
              Exportar CSV
            </button>
          </div>
        </div>

        <div className="business-ranking">
          {reports.topBusinessesByVeganOptions.map((business, index) => (
            <div key={index} className="business-item">
              <div className="business-rank">#{index + 1}</div>
              <div className="business-info">
                <h4>{business.businessName}</h4>
                <p>{business.veganOptionsCount} opciones veganas</p>
              </div>
              <div className="business-score">
                <div className="score-bar">
                  <div 
                    className="score-fill" 
                    style={{ width: `${(business.veganOptionsCount / reports.topBusinessesByVeganOptions[0].veganOptionsCount) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showTable && (
          <ReportsTable
            data={reports.topBusinessesByVeganOptions}
            columns={tableColumns}
            title="Detalle de Top Negocios por Opciones Veganas"
          />
        )}
      </div>
    );
  };

  const renderUserActivity = () => (
    <div className="report-section">
      <h2>Actividad de Usuarios (Últimos 6 Meses)</h2>
      <div className="activity-chart">
        <div className="chart-bars">
          {reports.userActivity.map((item, index) => (
            <div key={index} className="activity-bar">
              <div className="activity-value">{item.businessCount}</div>
              <div 
                className="activity-fill"
                style={{ height: `${(item.businessCount / Math.max(...reports.userActivity.map(i => i.businessCount))) * 200}px` }}
              ></div>
              <div className="activity-label">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReportContent = () => {
    switch (reportId) {
      case 'overview':
        return renderOverview();
      case 'businessByUser':
        return renderBusinessByUser();
      case 'topUsersLastMonth':
        return renderTopUsersLastMonth();
      case 'topBusinessesByVeganOptions':
        return renderTopBusinessesByVeganOptions();
      case 'userActivity':
        return renderUserActivity();
      default:
        return <div>Reporte no encontrado</div>;
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!user || user.role !== 'Sysadmin') {
    return (
      <div className="unauthorized-container">
        <h2>Acceso No Autorizado</h2>
        <p>Solo los administradores pueden acceder a esta página.</p>
      </div>
    );
  }

  const reportConfig = getReportConfig();

  return (
    <div className="report-detail">
      <Header 
        title={reportConfig.title}
        icon={reportConfig.icon}
        showRating={false}
        rating={null}
      />
      
      <div className="report-detail-content">
        <div className="report-detail-header">
          <button 
            className="back-btn"
            onClick={() => navigate('/reports')}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            Volver a Reportes
          </button>
          <div className="report-info">
            <h2>{reportConfig.title}</h2>
            <p>{reportConfig.description}</p>
          </div>
        </div>

        <div className="report-detail-main">
          {renderReportContent()}
        </div>
      </div>
    </div>
  );
};

export default ReportDetail; 