import * as React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Navigator, Outlet } from 'react-router-dom';
import type { Navigation } from '@toolpad/core';
const NAVIGATION : Navigation= [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    title: 'Dashboard',
    segment: 'home',
    icon: <DashboardIcon />,
  },
  {
    segment: 'home/orders',
    title: 'Orders',
    icon: <ShoppingCartIcon />,
  },
];

const BRANDING = {
  title: 'My Toolpad Core App',
};

export default function App() {
  return (
    <ReactRouterAppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </ReactRouterAppProvider>
  );
}