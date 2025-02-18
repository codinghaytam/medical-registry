import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './layouts/dashboard';
import DashboardPage from './pages';
import OrdersPage from './pages/orders';
import LoginForm from './pages/login-form';


const router = createBrowserRouter([
  {
    path: '/home',
    Component: App, // root layout route
    children: [
      {
        path: '',
        Component: Layout,
        children: [
          {
            path: '',
            Component: DashboardPage,
          },
          {
            path: 'home/orders',
            Component: OrdersPage,
          },
        ],
      },
      
    ],
  },
  {
    path: '/',
    Component: LoginForm
  }
]);
//...



ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
