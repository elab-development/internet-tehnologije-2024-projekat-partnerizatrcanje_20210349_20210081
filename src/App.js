import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import CreatePlan from "./pages/CreatePlan";
import MyPlans from "./pages/MyPlans";
import Races from "./pages/Races";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-plan" element={<CreatePlan />} />
        <Route path="/my-plans" element={<MyPlans />} />
        <Route path="/races" element={<Races />} /> 
      </Routes>
    </Router>
  );
}

export default App;

