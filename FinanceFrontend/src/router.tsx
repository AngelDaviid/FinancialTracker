import { useAuthStore } from './stores/auth.store.ts';
import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';

function PrivateRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Outlet /> : <Navigate to={'/login'} replace />;
}

function PublicRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <Navigate to={'/dashboard'} replace /> : <Outlet />;
}

export const router = createBrowserRouter([
  {
    element: <PublicRoute/>
    children: [
      {
        path: '/login',
        lazy: () => import('./pages/Login/login-page').then(m => ({ Component: m.default }))
      },
      {
        path: '/register',
        lazy: () => import('./pages/Register/register-page').then(m => ({ Component: m.default }))
      },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        path: '/',
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: '/dashboard',
        lazy: () => import('./pages/Dashboard/dashboard-page').then(m => ({ Component: m.default })),
      },
      {
        path: '/accounts',
        lazy: () => import('./pages/Accounts/accounts-page').then(m => ({ Component: m.default })),
      },
      {
        path: '/transactions',
        lazy: () => import('./pages/Transactions/transactions-page').then(m => ({ Component: m.default })),
      },
      {
        path: '/budgets',
        lazy: () => import('./pages/Budgets/budgets-page').then(m => ({ Component: m.default })),
      },
      {
        path: '/goals',
        lazy: () => import('./pages/Goals/goals-page').then(m => ({ Component: m.default })),
      },
      {
        path: '/reports',
        lazy: () => import('./pages/Reports/reports-page').then(m => ({ Component: m.default })),
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
])