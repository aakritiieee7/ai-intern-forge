import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  UserPlus,
  Users,
  ClipboardList,
  Award,
  UserCog,
  LogOut,
  BarChart3,
  FileText,
  Lightbulb,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      title: 'Add New Intern',
      description: 'Register new interns via form or bulk upload',
      icon: UserPlus,
      path: '/admin/add-intern',
      color: 'bg-blue-500',
    },
    {
      title: 'Assign Mentor',
      description: 'Assign mentors to pending interns',
      icon: Users,
      path: '/admin/assign-mentor',
      color: 'bg-green-500',
    },
    {
      title: 'Project Details',
      description: 'View ongoing and completed projects',
      icon: ClipboardList,
      path: '/admin/projects',
      color: 'bg-purple-500',
    },
    {
      title: 'Issue Certificate',
      description: 'Generate certificates for completed projects',
      icon: Award,
      path: '/admin/certificates',
      color: 'bg-yellow-500',
    },
    {
      title: 'Add Mentor',
      description: 'Create new mentor accounts',
      icon: UserCog,
      path: '/admin/add-mentor',
      color: 'bg-indigo-500',
    },
    {
      title: 'Analytics',
      description: 'View system analytics and reports',
      icon: BarChart3,
      path: '/admin/analytics',
      color: 'bg-pink-500',
    },
  ];

  const heroFeatures = [
    {
      title: 'AI-Enhanced',
      description: 'Smart matching, personalized learning paths & predictive insights for optimal talent development.',
      icon: Lightbulb,
      color: 'text-drdo-warning',
    },
    {
      title: 'Future-Ready Talent',
      description: 'Nurturing next-gen innovators with cutting-edge projects and skill development programs.',
      icon: GraduationCap,
      color: 'text-drdo-success',
    },
    {
      title: 'Secure & Compliant',
      description: 'Ensuring data integrity and adherence to DRDO\'s stringent security protocols.',
      icon: ShieldCheck,
      color: 'text-blue-400',
    },
    {
      title: 'Streamlined Operations',
      description: 'Automating administrative tasks for efficient and transparent internship management.',
      icon: ClipboardList,
      color: 'text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10">
                <img
                  src="/drdo_logo.png"
                  alt="DRDO Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <h1 className="text-xl font-bold text-drdo-navy tracking-wide">DRDO HR Portal</h1>
                <p className="text-sm text-muted-foreground">Admin Dashboard</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="border-drdo-navy text-drdo-navy">
                {user?.department}
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium">{user?.username}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-drdo-navy to-drdo-navy-light text-white py-16 sm:py-24 overflow-hidden">
        {/* Centered Logo Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-0">
          <img
            src="/drdo_logo.png"
            alt="DRDO Logo"
            className="w-80 h-80 object-contain"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start justify-between">
          <div className="text-center md:text-left md:w-2/3 mb-10 md:mb-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-4">
                <span>AI Powered</span><br></br>
              
              <span>HR Management</span> <br></br>
              <span> Portal </span>
            </h1>
            <p className="text-lg text-white/90 mb-6 max-w-2xl mx-auto md:mx-0">
            Advance DRDO's mission with a digitally transformed HR ecosystem. An intelligent platform that optimizes talent acquisition, project management, and compliance, fostering a pipeline of future-ready scientists and engineers</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <Button size="lg" className="bg-white text-drdo-navy hover:bg-gray-100 shadow-lg" onClick={() => navigate('/admin/add-intern')}>
                <UserPlus className="w-5 h-5 mr-2" />
                Onboard New Intern
              </Button>
              <Button size="lg" variant="outline" className="bg-white text-drdo-navy hover:bg-gray-100 shadow-lg" onClick={() => navigate('/admin/analytics')}>
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="md:w-1/3 flex justify-center items-center">
            <div className="flex flex-col space-y-4">
              {heroFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 bg-white bg-opacity-20 backdrop-filter backdrop-blur-sm p-4 rounded-lg shadow-md border border-white border-opacity-30"
                >
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  <div>
                    <h3 className="font-semibold text-xl">{feature.title}</h3>
                    <p className="text-sm opacity-80">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.username}</h2>
          <p className="text-muted-foreground">
            Manage the DRDO internship program from this central hub. Monitor progress, assign mentors, and track achievements.
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {navigationItems.map((item, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-elevated transition-all duration-200 hover:scale-105 shadow-card"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-drdo-navy">{item.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">
                  {item.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
