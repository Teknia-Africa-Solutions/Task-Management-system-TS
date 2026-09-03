import{Routes,Route} from "react-router-dom"
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Login/login";
import RegisterPage from "./pages/Register/register"

function App() {
  return(
  <Routes>
     <Route path="/" element={<LandingPage />} />
     <Route path="/login" element={<LoginPage />} />
     <Route path="/register" element={<RegisterPage />} />

     </Routes>
  );
}

export default App;