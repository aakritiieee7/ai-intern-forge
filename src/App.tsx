import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import MentorDashboard from "./pages/MentorDashboard";
import AddIntern from "./pages/admin/AddIntern";
import AssignMentor from "./pages/admin/AssignMentor";
import AddMentor from "./pages/admin/AddMentor";
import Certificates from "./pages/admin/Certificates";
import Projects from "./pages/admin/Projects";
import Analytics from "./pages/admin/Analytics"; 
import InternRequests from "./pages/mentor/InternRequests";
import OngoingProjects from "./pages/mentor/OngoingProjects";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'mentor' }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/mentor'} replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-intern" element={
              <ProtectedRoute requiredRole="admin">
                <AddIntern />
              </ProtectedRoute>
            } />
            <Route path="/admin/assign-mentor" element={
              <ProtectedRoute requiredRole="admin">
                <AssignMentor />
              </ProtectedRoute>
            } />
            <Route path="/admin/add-mentor" element={
              <ProtectedRoute requiredRole="admin">
                <AddMentor />
              </ProtectedRoute>
            } />
            <Route path="/admin/certificates" element={
              <ProtectedRoute requiredRole="admin">
                <Certificates />
              </ProtectedRoute>
            } />
            <Route path="/admin/projects" element={
              <ProtectedRoute requiredRole="admin">
                <Projects />
              </ProtectedRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedRoute requiredRole="admin">
                <Analytics />
              </ProtectedRoute>
            } />
            
            {/* Mentor Routes */}
            <Route path="/mentor" element={
              <ProtectedRoute requiredRole="mentor">
                <MentorDashboard />
              </ProtectedRoute>
            } />
            <Route path="/mentor/requests" element={
              <ProtectedRoute requiredRole="mentor">
                <InternRequests />
              </ProtectedRoute>
            } />
            <Route path="/mentor/projects" element={
              <ProtectedRoute requiredRole="mentor">
                <OngoingProjects />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;