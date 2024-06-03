import { Dashboard } from '../Pages/Dashboard';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Settings from '../Pages/Settings';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />,
  },
  {
    path: '/settings',
    loader: async () => {
      return { default: Settings };
    },
    element: (
      <Settings initialFormData={{ rounding_accuracy: 0, length_offset: 0 }} />
    ),
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}

export default App;
