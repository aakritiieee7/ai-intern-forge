import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, UserCog, Mail, Building, Phone, Key } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const AddMentor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    department: '',
    phone: '',
  });
  const [generatedPassword, setGeneratedPassword] = useState('');

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Aerospace',
    'Chemical',
    'Materials Science',
    'Physics',
    'Mathematics'
  ];

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Generate a temporary password
      const tempPassword = generatePassword();
      
      // Add mentor to the system
      const newMentor = storageService.addUser({
        username: formData.username,
        password: tempPassword,
        role: 'mentor',
        email: formData.email,
        department: formData.department,
      });

      setGeneratedPassword(tempPassword);

      toast({
        title: "Mentor Added Successfully",
        description: `${formData.username} has been added with temporary password`,
      });

      // Reset form
      setFormData({
        username: '',
        email: '',
        department: '',
        phone: '',
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add mentor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyPassword = () => {
    navigator.clipboard.writeText(generatedPassword);
    toast({
      title: "Password Copied",
      description: "Temporary password copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <UserCog className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-drdo-navy">Add New Mentor</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Create Mentor Account</h2>
          <p className="text-muted-foreground">
            Add a new mentor to the DRDO HR system with temporary credentials.
          </p>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-drdo-navy">Mentor Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username">Username *</Label>
                <div className="relative">
                  <UserCog className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    placeholder="Enter username"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    id="department"
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-primary hover:opacity-90"
                >
                  <UserCog className="w-4 h-4 mr-2" />
                  Add Mentor
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Generated Password Display */}
        {generatedPassword && (
          <Card className="mt-6 shadow-card border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Temporary Password Generated
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white p-4 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Temporary Password:</p>
                    <p className="font-mono text-lg font-semibold text-green-800">{generatedPassword}</p>
                  </div>
                  <Button
                    onClick={copyPassword}
                    variant="outline"
                    size="sm"
                    className="border-green-500 text-green-600 hover:bg-green-50"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> Share this temporary password with the mentor. 
                  They will be required to change it on their first login.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AddMentor;