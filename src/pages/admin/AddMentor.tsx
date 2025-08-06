import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

import { storageService } from '../../lib/storage';
import SKILLS from '@/data/skills.json';

interface MentorFormData {
  username: string;
  email: string;
  department: string;
  phone: string;
  skills: string[];
}

const AddMentor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<MentorFormData>({
    username: '',
    email: '',
    department: '',
    phone: '',
    skills: [],
  });

  const [generatedPassword, setGeneratedPassword] = useState('');
  const [showPasswordBox, setShowPasswordBox] = useState(false);
  const [copied, setCopied] = useState(false);

  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Aerospace',
    'Chemical',
    'Materials Science',
    'Physics',
    'Mathematics',
  ];

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const handleInputChange = (field: keyof MentorFormData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tempPassword = generatePassword();

    try {
      storageService.addUser({
        username: formData.username,
        password: tempPassword,
        role: 'mentor',
        email: formData.email,
        department: formData.department,
        skills: formData.skills as string[],
      });

      setGeneratedPassword(tempPassword);
      setShowPasswordBox(true);
      setCopied(false);

      toast({
        title: 'Mentor Added',
        description: `Temporary password generated.`,
      });

      // Auto-redirect after 2 minutes
      setTimeout(() => {
        navigate('/admin');
      }, 2 * 60 * 1000); // 2 minutes
    } catch (err) {
      console.error(err);
      toast({
        title: 'Error',
        description: 'Failed to add mentor. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    toast({ title: 'Copied!', description: 'Password copied to clipboard.' });
  };

  return (
    <Card className="max-w-2xl mx-auto mt-10">
      <CardHeader>
        <CardTitle>Add New Mentor</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="w-full p-2 border border-border rounded-md"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-2 border border-border rounded-md"
              required
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              className="w-full p-2 border border-border rounded-md"
            />
          </div>

          {/* Department */}
          <div className="space-y-2">
            <Label htmlFor="department">Department</Label>
            <select
              id="department"
              value={formData.department}
              onChange={(e) => handleInputChange('department', e.target.value)}
              className="w-full p-2 border border-border rounded-md"
              required
            >
              <option value="">Select Department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Skills Multiselect */}
          <div className="space-y-2">
            <Label htmlFor="skills">Skills</Label>
            <select
              id="skills"
              multiple
              value={formData.skills}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                setFormData((prev) => ({ ...prev, skills: selected }));
              }}
              className="w-full p-2 border border-border rounded-md h-40"
            >
              {Array.isArray(SKILLS) &&
                SKILLS.map((skill) => (
                  <option key={skill} value={skill}>
                    {skill}
                  </option>
                ))}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-gradient-primary hover:opacity-90">
              <UserCog className="w-4 h-4 mr-2" />
              Add Mentor
            </Button>
          </div>
        </form>

        {/* Password Display Box */}
        {showPasswordBox && generatedPassword && (
          <div className="mt-6 p-4 rounded-md bg-green-100 border border-green-500 text-green-800 flex justify-between items-center">
            <div>
              <strong>Temporary Password:</strong> {generatedPassword}
            </div>
            <button onClick={copyToClipboard} className="text-sm underline ml-4 flex items-center">
              <Copy className="h-4 w-4 mr-1" /> {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddMentor;
