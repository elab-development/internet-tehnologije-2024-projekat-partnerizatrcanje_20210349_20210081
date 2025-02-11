import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePlan from "./pages/CreatePlan";
import MyPlans from "./pages/MyPlans";
import Races from "./pages/Races";
import Navbar from "./components/Navbar";
import './styles/styles-main.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Početna stranica preusmerava na login */}
        <Route path="/" element={<Navigate to="/login" />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ostale stranice sa Navbar-om */}
        <Route
          path="/home"
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
        />
        <Route
          path="/profile"
          element={
            <>
              <Navbar />
              <Profile />
            </>
          }
        />
        <Route
          path="/create-plan"
          element={
            <>
              <Navbar />
              <CreatePlan />
            </>
          }
        />
        <Route
          path="/my-plans"
          element={
            <>
              <Navbar />
              <MyPlans />
            </>
          }
        />
        <Route
          path="/races"
          element={
            <>
              <Navbar />
              <Races />
            </>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
