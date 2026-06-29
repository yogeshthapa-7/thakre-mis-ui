import { createBrowserRouter } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import ErrorPage from "./pages/error-pages/error-page";
import { LandingPage } from "./pages/landing-page";
import  GisProfilePage  from "./pages/gis-profile";

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
];

const router = createBrowserRouter(routes);

export default router;
export { routes };

