import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePlan from "./pages/CreatePlan";
import MyPlans from "./pages/MyPlans";
import Races from "./pages/Races";
import Navbar from "./components/Navbar";
import './styles.css';

function App() {
  return (
    <Router>
      {/* Prikazivanje Navbar-a samo ako nismo na login/register stranici */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ostale stranice gde Navbar treba da se prikazuje */}
        <Route
          path="/"
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
