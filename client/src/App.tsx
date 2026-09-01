import { RouterProvider, createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Session from "./pages/Session";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "exercises", element: <Exercises /> },
      { path: "session", element: <Session /> },
      { path: "programs", element: <Programs /> },
      { path: "history", element: <History /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
