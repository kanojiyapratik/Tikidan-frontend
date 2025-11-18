import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Reports from './pages/Reports';
import Team from './pages/Team';
import Projects from './pages/Projects';
import Clients from './pages/Clients';
import Employees from './pages/Employees';
import Profile from './pages/Profile';
import Meetings from './pages/Meetings';
import PlaceholderPage from './pages/PlaceholderPage';
import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

// Role-based Protected Route Component
const RoleProtectedRoute = ({
  children,
  allowedRoles
}: {
  children: React.ReactNode,
  allowedRoles: string[]
}) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  
  if (!token || !userData) {
    return <Navigate to="/login" replace />;
  }

  const user = JSON.parse(userData);
  const hasAccess = allowedRoles.includes(user.role);

  return hasAccess ? <>{children}</> : <Navigate to="/reports" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Protected Routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  {/* Main Menu */}
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/team" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'user', 'vice_admin', 'senior_manager', 'team_lead', 'project_manager', 'hr_manager', 'finance_manager', 'operations_manager', 'marketing_manager', 'it_manager', 'executive', 'assistant_manager']}>
                      <Team />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/meetings" element={
                    <RoleProtectedRoute allowedRoles={['sales_manager']}>
                      <Meetings />
                    </RoleProtectedRoute>
                  } />
                  
                  {/* Expenses Menu */}
                  <Route path="/expenses" element={<PlaceholderPage />} />
                  <Route path="/review-expenses" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'sales_manager', 'vice_admin', 'senior_manager', 'team_lead', 'project_manager', 'hr_manager', 'finance_manager', 'operations_manager', 'marketing_manager', 'it_manager', 'executive', 'assistant_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/approved-expenses" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'sales_manager', 'vice_admin', 'senior_manager', 'team_lead', 'project_manager', 'hr_manager', 'finance_manager', 'operations_manager', 'marketing_manager', 'it_manager', 'executive', 'assistant_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/rejected-expenses" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'sales_manager', 'vice_admin', 'senior_manager', 'team_lead', 'project_manager', 'hr_manager', 'finance_manager', 'operations_manager', 'marketing_manager', 'it_manager', 'executive', 'assistant_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/expenses-report" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'sales_manager', 'vice_admin', 'senior_manager', 'team_lead', 'project_manager', 'hr_manager', 'finance_manager', 'operations_manager', 'marketing_manager', 'it_manager', 'executive', 'assistant_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/payment-pending" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'finance_manager', 'operations_manager', 'vice_admin', 'senior_manager', 'assistant_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/expense-paid" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'finance_manager', 'operations_manager', 'vice_admin', 'senior_manager', 'assistant_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/manage-categories" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'finance_manager', 'vice_admin', 'senior_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/expense-settings" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'finance_manager', 'vice_admin']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  
                  {/* Company Menu */}
                  <Route path="/company" element={<PlaceholderPage />} />
                  <Route path="/attendance" element={<PlaceholderPage />} />
                  <Route path="/employees" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'hr_manager', 'vice_admin', 'senior_manager']}>
                      <Employees />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/categories" element={<PlaceholderPage />} />
                  <Route path="/department" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'hr_manager', 'vice_admin', 'senior_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/branches" element={<PlaceholderPage />} />
                  <Route path="/holiday" element={<PlaceholderPage />} />
                  <Route path="/billing" element={
                    <RoleProtectedRoute allowedRoles={['admin', 'finance_manager', 'vice_admin', 'senior_manager']}>
                      <PlaceholderPage />
                    </RoleProtectedRoute>
                  } />
                  <Route path="/company-profile" element={<PlaceholderPage />} />
                  
                  {/* My Account Menu */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-leave" element={<PlaceholderPage />} />
                  <Route path="/team-leave" element={<PlaceholderPage />} />
                  <Route path="/leave-settings" element={<PlaceholderPage />} />
                  
                  {/* Catch all - redirect to reports */}
                  <Route path="*" element={<Navigate to="/reports" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
