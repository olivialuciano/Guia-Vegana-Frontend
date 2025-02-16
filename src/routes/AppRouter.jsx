import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home/Home";
import NotFound from "../pages/NotFound/NotFound";
import About from "../pages/About/About";
import Business from "../pages/Business/BusinessList";
import BusinessDetail from "../pages/Business/BusinessDetail";
import Activism from "../pages/Activism/Activism";
import ActivismDetail from "../pages/Activism/ActivismDetail";
import HealthProfessional from "../pages/HealthProfessional/HealthProfessional";
import HealthProfessionalDetail from "../pages/HealthProfessional/HealthProfessionalDetail";
import InformativeResource from "../pages/InformativeResource/InformativeResource";
import InformativeResourceDetail from "../pages/InformativeResource/InformativeResourceDetail";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/business" element={<Business />} />
      <Route path="/business/:id" element={<BusinessDetail />} />
      <Route path="/activism" element={<Activism />} />
      <Route path="/activism/:id" element={<ActivismDetail />} />
      <Route path="/healthprofessional" element={<HealthProfessional />} />
      <Route
        path="/healthprofessional/:id"
        element={<HealthProfessionalDetail />}
      />
      <Route path="/informativeresource" element={<InformativeResource />} />
      <Route
        path="/informativeresource/:id"
        element={<InformativeResourceDetail />}
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
