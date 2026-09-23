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
import ViewProfile from "./pages/user/ViewProfile";
import AccountSettings from "./pages/user/AccountSettings";
import NotificationPreferences from "./pages/user/NotificationPreferences.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectDetail from "./pages/user/ProjectDetail";
//Super Admin
import SuperAdminLayout from "./pages/superadmin/SUperAdminLayout.jsx";
import { SUPERADMIN_ROUTES } from "./utils/routes";
import SuperAdminSidebar from "./pages/superadmin/components/SuperAdminSidebar.jsx";
import UserManagement from "./pages/superadmin/UserManagement.jsx";
import  SuperAdminDashboard from "./pages/superadmin/Dashboard.jsx"
import ProjectOversight from "./pages/superadmin/ProjectOversight.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

<Route path="/user" element={<ProtectedRoute allowedRoles={["Member"]}> <UserLayout /> </ProtectedRoute>}>      
        <Route path={USER_ROUTES.dashboard} element={<Dashboard />} />
        <Route path={USER_ROUTES.myTasks} element={<MyTasks />} />
        <Route path={USER_ROUTES.projects} element={<Projects />} />
        <Route path={USER_ROUTES.reports} element={<Reports/>}/>
        <Route path={USER_ROUTES.files} element={<Files/>}/>
        <Route path={USER_ROUTES.messages} element={<Messages/>}/>
        <Route path={USER_ROUTES.calendar} element={<Calendar/>}/>
        <Route path={USER_ROUTES.notifications} element={<Notifications/>}/>
        <Route path={USER_ROUTES.viewProfile} element={<ViewProfile/>}/>
        <Route path={USER_ROUTES.accountSettings} element={<AccountSettings/>}/>
        <Route path={USER_ROUTES.notificationPreferences} element={<NotificationPreferences/>}/>
        <Route path={USER_ROUTES.projectDetail} element={<ProjectDetail />} />

      </Route>
<Route path="/superadmin" element={<ProtectedRoute allowedRoles={["SuperAdmin"]}>
  <SuperAdminLayout/>
</ProtectedRoute>
}>
<Route path={SUPERADMIN_ROUTES.userManagement} element={<UserManagement/>}/>
<Route path={SUPERADMIN_ROUTES.dashboard} element={<SuperAdminDashboard/>}/>
<Route path={SUPERADMIN_ROUTES.projects} element={<ProjectOversight />} />

</Route>
    </Routes>
  );
}

export default App;