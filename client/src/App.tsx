import { RouterProvider, createBrowserRouter } from "react-router";

import Layout from "./components/Layout";
import AddExercisesToSession from "./pages/AddExercisesToSession";
import Exercises from "./pages/Exercises";
import History from "./pages/History";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import Programs from "./pages/Programs";
import Register from "./pages/Register";
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
      {
        path: "sessions/:id/exercises",
        element: <AddExercisesToSession />,
      },
      { path: "profile", element: <Profile /> },
      { path: "register", element: <Register /> },
      { path: "login", element: <Login /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
