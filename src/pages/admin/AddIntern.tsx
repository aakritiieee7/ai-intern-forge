import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, UserPlus, Upload, FileText } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const AddIntern = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [inputMethod, setInputMethod] = useState<'form' | 'upload'>('form');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    skills: '',
    department: '',
    expectedDuration: ''
  });

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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      storageService.addIntern({
        name: formData.name,
        email: formData.email,
        skills: formData.skills,
        department: formData.department,
      });

      toast({
        title: "Intern Added Successfully",
        description: `${formData.name} has been added to the system`,
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        skills: '',
        department: '',
        expectedDuration: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add intern. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // For demo purposes, we'll simulate processing a CSV/Excel file
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          // Simulate parsing CSV data
          const mockInterns = [
            { name: 'Rahul Sharma', email: 'rahul@email.com', skills: 'Machine Learning, Python', department: 'Computer Science' },
            { name: 'Priya Patel', email: 'priya@email.com', skills: 'Signal Processing, MATLAB', department: 'Electronics' },
            { name: 'Amit Kumar', email: 'amit@email.com', skills: 'CAD Design, SolidWorks', department: 'Mechanical' },
          ];

          mockInterns.forEach(intern => {
            storageService.addIntern(intern);
          });

          toast({
            title: "Bulk Upload Successful",
            description: `${mockInterns.length} interns have been added to the system`,
          });
        } catch (error) {
          toast({
            title: "Upload Error",
            description: "Failed to process the uploaded file.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    }
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
              <UserPlus className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-drdo-navy">Add New Intern</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Method Selection */}
        <Card className="mb-8 shadow-card">
          <CardHeader>
            <CardTitle className="text-drdo-navy">Choose Input Method</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setInputMethod('form')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  inputMethod === 'form'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <FileText className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Web Form</h3>
                <p className="text-sm text-muted-foreground">Add intern details manually</p>
              </button>
              
              <button
                onClick={() => setInputMethod('upload')}
                className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                  inputMethod === 'upload'
                    ? 'border-primary bg-primary/5 text-primary'
                    : 'border-border hover:border-primary/50'
                }`}
              >
                <Upload className="w-8 h-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Bulk Upload</h3>
                <p className="text-sm text-muted-foreground">Upload CSV/Excel file</p>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Form Input */}
        {inputMethod === 'form' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-drdo-navy">Intern Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="Enter email address"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <select
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="expectedDuration">Expected Duration</Label>
                    <Input
                      id="expectedDuration"
                      value={formData.expectedDuration}
                      onChange={(e) => handleInputChange('expectedDuration', e.target.value)}
                      placeholder="e.g., 6 months"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills & Expertise *</Label>
                  <Textarea
                    id="skills"
                    value={formData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="List relevant skills, technologies, and areas of expertise"
                    rows={4}
                    required
                  />
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
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add Intern
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* File Upload */}
        {inputMethod === 'upload' && (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-drdo-navy">Bulk Upload Interns</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">Upload CSV or Excel File</h3>
                <p className="text-muted-foreground mb-4">
                  File should contain columns: Name, Email, Skills, Department
                </p>
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload">
                  <Button variant="outline" className="cursor-pointer">
                    Choose File
                  </Button>
                </Label>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">File Format Requirements:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Column 1: Name (Full name of the intern)</li>
                  <li>• Column 2: Email (Valid email address)</li>
                  <li>• Column 3: Skills (Comma-separated skills)</li>
                  <li>• Column 4: Department (Department name)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AddIntern;