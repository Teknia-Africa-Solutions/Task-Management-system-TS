import Layout from "../../layouts/Layout";
import SuperAdminSidebar from "./components/SuperAdminSidebar";
import SuperAdminTopbar from "./components/superAdminTopbar";

export default function SuperAdminLayout() {
  return <Layout sidebar={<SuperAdminSidebar />} topbar={<SuperAdminTopbar />} />;
}