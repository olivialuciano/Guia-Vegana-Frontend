import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import Loading from '../../components/Loading/Loading';
import { 
  faChartBar, 
  faUsers, 
  faStore, 
  faLeaf, 
  faCalendarAlt, 
  faChartLine, 
  faChartPie, 
  faTrophy, 
  faArrowRight 
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Reports.css';
import { API } from '../../services/api';

const Reports = () => {
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
        fetch(`${API}/Business`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API}/User`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`${API}/VeganOption`, {
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
      setError("Error al cargar reportes");
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

  const reportCards = [
    {
      id: 'overview',
      title: 'Resumen General',
      description: 'Estadísticas generales del sistema',
      icon: faChartBar,
      color: '#4CAF50',
      stats: [
        { label: 'Negocios', value: reports.monthlyStats.totalBusinesses, icon: faStore },
        { label: 'Usuarios', value: reports.monthlyStats.totalUsers, icon: faUsers },
        { label: 'Opciones Veganas', value: reports.monthlyStats.totalVeganOptions, icon: faLeaf }
      ]
    },
    {
      id: 'businessByUser',
      title: 'Negocios por Usuario',
      description: 'Análisis de cuántos negocios creó cada usuario',
      icon: faUsers,
      color: '#2196F3',
      stats: [
        { label: 'Usuarios Activos', value: reports.businessByUser.length, icon: faUsers },
        { label: 'Total Negocios', value: reports.businessByUser.reduce((sum, item) => sum + item.businessCount, 0), icon: faStore },
        { label: 'Promedio', value: reports.businessByUser.length > 0 ? (reports.businessByUser.reduce((sum, item) => sum + item.businessCount, 0) / reports.businessByUser.length).toFixed(1) : 0, icon: faChartPie }
      ]
    },
    {
      id: 'topUsersLastMonth',
      title: 'Top Usuarios del Mes',
      description: 'Usuarios más activos en el último mes',
      icon: faCalendarAlt,
      color: '#FF9800',
      stats: [
        { label: 'Usuarios Activos', value: reports.topUsersLastMonth.length, icon: faUsers },
        { label: 'Negocios Creados', value: reports.topUsersLastMonth.reduce((sum, item) => sum + item.businessCount, 0), icon: faStore },
        { label: 'Mejor Usuario', value: reports.topUsersLastMonth.length > 0 ? reports.topUsersLastMonth[0].businessCount : 0, icon: faTrophy }
      ]
    },
    {
      id: 'topBusinessesByVeganOptions',
      title: 'Top Negocios por Opciones Veganas',
      description: 'Los 10 negocios con más opciones veganas',
      icon: faLeaf,
      color: '#4CAF50',
      stats: [
        { label: 'Negocios Analizados', value: reports.topBusinessesByVeganOptions.length, icon: faStore },
        { label: 'Total Opciones', value: reports.topBusinessesByVeganOptions.reduce((sum, item) => sum + item.veganOptionsCount, 0), icon: faLeaf },
        { label: 'Mejor Negocio', value: reports.topBusinessesByVeganOptions.length > 0 ? reports.topBusinessesByVeganOptions[0].veganOptionsCount : 0, icon: faTrophy }
      ]
    },
    {
      id: 'userActivity',
      title: 'Actividad de Usuarios',
      description: 'Tendencias de actividad en los últimos 6 meses',
      icon: faChartLine,
      color: '#9C27B0',
      stats: [
        { label: 'Meses Analizados', value: reports.userActivity.length, icon: faCalendarAlt },
        { label: 'Total Negocios', value: reports.userActivity.reduce((sum, item) => sum + item.businessCount, 0), icon: faStore },
        { label: 'Promedio Mensual', value: reports.userActivity.length > 0 ? (reports.userActivity.reduce((sum, item) => sum + item.businessCount, 0) / reports.userActivity.length).toFixed(1) : 0, icon: faChartPie }
      ]
    }
  ];

  const handleCardClick = (reportId) => {
    navigate(`/reports/${reportId}`);
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

  return (
    <div className="reports-container">
      <div className="reports">
        <div className="reports-content">
          {/* Header de la página */}
          <div className="page-header">
            <h1 className="page-title">Reportes y Estadísticas</h1>

          </div>

          <div className="reports-header">
            <h2>Panel de Reportes</h2>
            <p>Selecciona un reporte para ver el análisis detallado</p>
          </div>

          <div className="reports-grid">
            {reportCards.map((card) => (
              <div 
                key={card.id} 
                className="report-card"
                onClick={() => handleCardClick(card.id)}
              >
                <div className="card-header" style={{ backgroundColor: card.color }}>
                  <div className="card-icon">
                    <FontAwesomeIcon icon={card.icon} />
                  </div>
                  <div className="card-title">
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </div>
                
                <div className="card-stats">
                  {card.stats.map((stat, index) => (
                    <div key={index} className="stat-item">
                      <div className="stat-icon">
                        <FontAwesomeIcon icon={stat.icon} />
                      </div>
                      <div className="stat-content">
                        <span className="stat-value">{stat.value}</span>
                        <span className="stat-label">{stat.label}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="card-actions">
                  <button className="view-details-btn">
                    <FontAwesomeIcon icon={faArrowRight} />
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports; 