import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import Home from "./pages/Home/Home";
import BusinessList from "./pages/Business/BusinessList";
import BusinessDetail from "./pages/Business/BusinessDetail";
import VeganOption from "./components/VeganOption/VeganOption";
import OpeningHour from "./components/OpeningHour/OpeningHour";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="app-main">
          <Routes>
            {/* Home page */}
            <Route path="/" element={<Home />} />

            {/* Business-related pages */}
            <Route path="/business" element={<BusinessList />} />
            <Route path="/business/:id" element={<BusinessDetail />} />

            {/* Additional components for details (used within other pages) */}
            <Route
              path="/business/:id/opening-hours"
              element={<OpeningHour />}
            />
            <Route
              path="/business/:id/vegan-options"
              element={<VeganOption />}
            />

            {/* Default route */}
            <Route path="*" element={<h1>404: Página no encontrada</h1>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
