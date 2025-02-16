import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar/Navbar";
import AppRouter from "./routes/AppRouter";

function App() {
  return (
    <>
      <></>
      <Router>
        <Navbar />
        <AppRouter />
      </Router>
    </>
  );
}

export default App;
