import { RouterProvider, createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Exercises from "./pages/Exercises";
import Session from "./pages/Session";
import Programs from "./pages/Programs";
import History from "./pages/History";

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