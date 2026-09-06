import { RouterProvider, createBrowserRouter } from "react-router";

import ExercisesPage from "./pages/ExercisesPage";

const router = createBrowserRouter([
  {
    path: "/exercises",
    element: <ExercisesPage />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
