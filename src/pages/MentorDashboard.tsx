import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  UserCheck, 
  ClipboardList, 
  LogOut,
  Users,
  Clock,
  CheckCircle
} from 'lucide-react';
import { storageService, Intern } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const MentorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    newRequests: 0,
    ongoingProjects: 0,
    completedProjects: 0
  });

  useEffect(() => {
    if (user) {
      const interns = storageService.getInternsByMentor(user.id);
      setStats({
        newRequests: interns.filter(intern => intern.status === 'assigned').length,
        ongoingProjects: interns.filter(intern => intern.status === 'ongoing').length,
        completedProjects: interns.filter(intern => intern.status === 'completed').length,
      });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigationItems = [
    {
      title: 'New Intern Requests',
      description: 'Accept or reject newly assigned interns',
      icon: UserCheck,
      path: '/mentor/requests',
      color: 'bg-blue-500',
      count: stats.newRequests,
    },
    {
      title: 'Ongoing Projects',
      description: 'Monitor and complete active projects',
      icon: ClipboardList,
      path: '/mentor/projects',
      color: 'bg-green-500',
      count: stats.ongoingProjects,
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
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-drdo-navy">DRDO HR Portal</h1>
                <p className="text-sm text-muted-foreground">Mentor Dashboard</p>
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
            Guide and mentor DRDO interns in their research projects. Track their progress and help them achieve their goals.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">New Requests</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.newRequests}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Ongoing Projects</p>
                  <p className="text-2xl font-bold text-drdo-success">{stats.ongoingProjects}</p>
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
                  <p className="text-sm font-medium text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold text-drdo-warning">{stats.completedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {navigationItems.map((item, index) => (
            <Card 
              key={index} 
              className="cursor-pointer hover:shadow-elevated transition-all duration-200 hover:scale-105 shadow-card"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-drdo-navy">{item.title}</CardTitle>
                    </div>
                  </div>
                  {item.count > 0 && (
                    <Badge className="bg-red-500 text-white">
                      {item.count}
                    </Badge>
                  )}
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

        {/* Recent Activity */}
        <Card className="mt-8 shadow-card">
          <CardHeader>
            <CardTitle className="text-drdo-navy">Recent Activity</CardTitle>
            <CardDescription>Latest updates on your mentored projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New intern assignment pending</p>
                  <p className="text-xs text-muted-foreground">Check your new requests section</p>
                </div>
                <Badge variant="outline">Pending</Badge>
              </div>
              
              <div className="flex items-center space-x-4 p-3 bg-muted/50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Project milestone achieved</p>
                  <p className="text-xs text-muted-foreground">Intern progress update available</p>
                </div>
                <Badge variant="outline">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default MentorDashboard;