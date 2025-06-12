// BusinessList.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import CardGrid from "../../components/CardGrid/CardGrid";
import Loading from "../../components/Loading/Loading";
import NewBusinessForm from "../../components/NewBusinessForm/NewBusinessForm";
import "./BusinessList.css";

const BusinessList = () => {
  const { role } = useContext(AuthContext);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("https://localhost:7032/api/Business")
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data);
      })
      .catch((e) => console.error("Error fetching businesses:", e))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="business-list-container">
      <div className="business-header">
        <h1 className="business-title">Negocios</h1>
        <p className="business-description">
          Bares, restaurantes, heladerías, dietéticas, panaderías y mercados.
        </p>
      </div>
      {role === "admin" && (
        <button className="add-button" onClick={() => setIsFormOpen(true)}>
          +
        </button>
      )}
      <CardGrid businesses={businesses} />
      {isFormOpen && <NewBusinessForm onClose={() => setIsFormOpen(false)} />}
    </div>
  );
};

export default BusinessList;
