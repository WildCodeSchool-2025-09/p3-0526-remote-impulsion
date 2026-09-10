import { RouterProvider, createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Sessions from "./pages/Sessions";
import NewSession from "./pages/NewSession";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "exercises", element: <Exercises /> },
      { path: "sessions", element: <Sessions /> },
      { path: "programs", element: <Programs /> },
      { path: "history", element: <History /> },
      { path: "sessions/new", element: <NewSession /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
