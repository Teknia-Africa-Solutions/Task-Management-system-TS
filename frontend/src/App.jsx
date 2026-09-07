import { Routes, Route } from "react-router-dom";
import LandingPage from "./pages/Landing/LandingPage";
import LoginPage from "./pages/Login/login";
import RegisterPage from "./pages/Register/register";
import UserLayout from "./pages/user/Userlayout";
import Dashboard from "./pages/user/Dashboard";
import MyTasks from "./pages/user/Mytasks";
import { USER_ROUTES } from "./utils/routes";
import Projects from "./pages/user/Projects";
import Reports from "./pages/user/Reports";
import Files from "./pages/user/Files";
import Messages from "./pages/user/Messages";
import Calendar from "./pages/user/Calendar";
import  Notifications from "./pages/user/Notifications";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/user" element={<UserLayout />}>
        <Route path={USER_ROUTES.dashboard} element={<Dashboard />} />
        <Route path={USER_ROUTES.myTasks} element={<MyTasks />} />
        <Route path={USER_ROUTES.projects} element={<Projects />} />
        <Route path={USER_ROUTES.reports} element={<Reports/>}/>
        <Route path={USER_ROUTES.files} element={<Files/>}/>
        <Route path={USER_ROUTES.messages} element={<Messages/>}/>
        <Route path={USER_ROUTES.calendar} element={<Calendar/>}/>
        <Route path={USER_ROUTES.notifications} element={<Notifications/>}/>

      </Route>
    </Routes>
  );
}

export default App;