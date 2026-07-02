import { createBrowserRouter } from "react-router-dom";
// import type { RouteObject } from "react-router-dom";
import ErrorPage from "./pages/error-pages/error-page";
import { LandingPage } from "./pages/landing-page";
import  GisProfilePage  from "./pages/gis-profile";
import CitizensServiceRequests from "./pages/citizens_services/citizens-service-requests";
import DevelopmentProjectTracker  from "./pages/citizens_services/development-project-tracker";
import MainLayout from "./layouts/mainLayout";
const routes = [
  {
    element: <MainLayout />,
    children: [
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/gis-profile",
    element: <GisProfilePage />, 
  },
  {
    path: "/citizens_services/citizens-service-requests",
    element: <CitizensServiceRequests />,
  },
  {
    path: "/citizens_services/development-project-tracker",
    element: <DevelopmentProjectTracker />,
    },
  ],
 },
];

const router = createBrowserRouter(routes);

export default router;
export { routes };

