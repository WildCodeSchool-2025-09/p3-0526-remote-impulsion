import { RouterProvider, createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Programs from "./pages/Programs";
import SessionId from "./pages/SessionID";
import Sessions from "./pages/Sessions";

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
      { path: "profile", element: <Profile /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
