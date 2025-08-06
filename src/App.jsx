import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Earth from "./components/Earth";
import LocationWeatherInfo from "./pages/LocationWeatherInfo";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <Earth />,
    },
    {
      path: "/locationWeatherInfo",
      element: <LocationWeatherInfo />,
    },
  ]);
  return <RouterProvider router={routes} />;
}
