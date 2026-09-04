import { RouterProvider, createBrowserRouter } from "react-router";

import Exercises from "./pages/Exercises";

const router = createBrowserRouter([
  {
    path: "/exercises",
    element: <Exercises />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
