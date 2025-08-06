import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, UserCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'mentor'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(username, password);
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome to DRDO HR Training Module`,
        });
        navigate(selectedRole === 'admin' ? '/admin' : '/mentor');
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (role: 'admin' | 'mentor') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      setSelectedRole('admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-drdo-navy via-drdo-navy-light to-primary">
      <div className="w-full max-w-md p-6">
        <Card className="shadow-elevated border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-drdo-navy">DRDO HR Portal</CardTitle>
              <CardDescription className="text-muted-foreground">
                Defense Research & Development Organization
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Role Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Select Role</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('admin')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === 'admin'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <Shield className="w-5 h-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Admin</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('mentor')}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedRole === 'mentor'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <UserCheck className="w-5 h-5 mx-auto mb-2" />
                  <div className="text-sm font-medium">Mentor</div>
                </button>
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
                disabled={isLoading}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            {/* Quick Login for Demo */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Demo Credentials</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="w-full p-2 text-xs bg-muted hover:bg-muted/80 rounded-md transition-colors"
                >
                  <Badge variant="outline" className="mr-2">Admin</Badge>
                  admin / admin123
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;