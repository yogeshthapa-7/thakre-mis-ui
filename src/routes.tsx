import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import ErrorPage from "./pages/error-pages/error-page";
import { LandingPage } from "./pages/landing-page";
import  GisProfilePage  from "./pages/gis-profile";
import CitizensServiceRequests from "./pages/citizens_services/citizens-service-requests";
import DevelopmentProjectTracker  from "./pages/citizens_services/development-project-tracker";
const routes: RouteObject[] = [
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
  //  {
  //   path: "/citizens_services/financial-transparency",
  //   element: <FinancialTransparency />,
  // },
  //  {
  //   path: "/citizens_services/emergency-alerts",
  //   element: <EmergencyAlerts />,
  // },
  //  {
  //   path: "/citizens_services/citizen-feedback-polls",
  //   element: <CitizenFeedbackPolls />,
  // },
];

const router = createBrowserRouter(routes);

export default router;
export { routes };

