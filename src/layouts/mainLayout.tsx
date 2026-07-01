import { Outlet } from "react-router-dom";
import SiteHeader from "../islands/navigation/site-header";

export default function MainLayout() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      
    </>
  );
}