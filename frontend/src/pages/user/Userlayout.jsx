import Layout from "../../layouts/Layout";
import UserSidebar  from "./components/UserSidebar";
import UserTopbar from "./components/UserTopbar";



export default function UserLayout() {
  return <Layout sidebar={<UserSidebar />} topbar={<UserTopbar />} />;
}
