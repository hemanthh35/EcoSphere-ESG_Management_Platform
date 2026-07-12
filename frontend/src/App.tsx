import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/modules/auth/AuthContext';
import { ProtectedRoute } from '@/modules/auth/components/ProtectedRoute';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';
import { ProfilePage } from '@/modules/auth/pages/ProfilePage';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage';
import { ChangePasswordPage } from '@/modules/auth/pages/ChangePasswordPage';
import { AccessDeniedPage } from '@/modules/auth/pages/AccessDeniedPage';
import { UnauthorizedPage } from '@/modules/auth/pages/UnauthorizedPage';
import { DepartmentsPage } from '@/modules/department/pages/DepartmentsPage';
import { DepartmentHierarchyPage } from '@/modules/department/pages/DepartmentHierarchyPage';
import { DepartmentDetailsPage } from '@/modules/department/pages/DepartmentDetailsPage';

import { SettingsLayout } from '@/modules/settings/layouts/SettingsLayout';
import { CategoriesPage } from '@/modules/settings/pages/CategoriesPage';
import EmployeesPage from '@/modules/settings/pages/EmployeesPage';
import ProductsPage from '@/modules/product-esg/pages/ProductsPage';
import { ESGConfigurationPage } from '@/modules/settings/pages/ESGConfigurationPage';
import { NotificationSettingsPage } from '@/modules/settings/pages/NotificationSettingsPage';

import { PublicLayout } from '@/layouts/PublicLayout';
import { LandingPage } from '@/pages/LandingPage';
import { EnvironmentalPage } from '@/modules/environmental/pages/EnvironmentalPage';
import GovernancePage from '@/modules/governance/pages/GovernancePage';
import GamificationPage from '@/modules/gamification/pages/GamificationPage';
import { SocialPage } from '@/modules/social/pages/SocialPage';
import ReportsPage from '@/modules/reports/pages/ReportsPage';

import { DashboardPage } from '@/modules/dashboard/pages/DashboardPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/403" element={<AccessDeniedPage />} />
            <Route path="/401" element={<UnauthorizedPage />} />
            
            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              
              {/* Settings Module */}
              <Route path="/settings" element={<SettingsLayout />}>
                <Route path="departments" element={<DepartmentsPage />} />
                <Route path="categories" element={<CategoriesPage />} />
                <Route path="employees" element={<EmployeesPage />} />
                <Route path="products" element={<ProductsPage />} />
                <Route path="configuration" element={<ESGConfigurationPage />} />
                <Route path="notifications" element={<NotificationSettingsPage />} />
              </Route>
              
              {/* Department Deep Links */}
              <Route path="/departments/hierarchy" element={<DepartmentHierarchyPage />} />
              <Route path="/departments/:id" element={<DepartmentDetailsPage />} />
              
              {/* Profile */}
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/profile/settings" element={<ChangePasswordPage />} />

              {/* Environmental Module */}
              <Route path="/environmental" element={<EnvironmentalPage />} />
              <Route path="/social" element={<SocialPage />} />
              <Route path="/governance" element={<GovernancePage />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/reports" element={<ReportsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}
