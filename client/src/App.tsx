import { RouterProvider, createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Home from "./pages/Home";
import Programs from "./pages/Programs";
import Sessions from "./pages/Sessions";
import SessionId from "./pages/SessionID";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "exercises", element: <Exercises /> },
      { path: "programs", element: <Programs /> },
      { path: "history", element: <History /> },
      { path: "sessions", element: <Sessions /> },
      { path: "sessions/:id", element: <SessionId /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
