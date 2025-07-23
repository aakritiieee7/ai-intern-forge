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
  FileText
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-drdo-navy">DRDO HR Portal</h1>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">Welcome, {user?.username}</h2>
          <p className="text-muted-foreground">
            Manage the DRDO internship program from this central hub. Monitor progress, assign mentors, and track achievements.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Interns</p>
                  <p className="text-2xl font-bold text-drdo-navy">24</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Projects</p>
                  <p className="text-2xl font-bold text-drdo-success">18</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Certificates Issued</p>
                  <p className="text-2xl font-bold text-drdo-warning">12</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Mentors</p>
                  <p className="text-2xl font-bold text-drdo-navy-light">8</p>
                </div>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UserCog className="w-6 h-6 text-indigo-600" />
                </div>
              </div>
            </CardContent>
          </Card>
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