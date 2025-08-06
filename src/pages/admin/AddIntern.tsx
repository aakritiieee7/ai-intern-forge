import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText } from 'lucide-react';
import { storageService } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { extractTextFromPDF } from '@/utils/extractTextFromPDF';
import MentorSuggestion from '@/components/MentorSuggestion';

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

  const [suggestedMentors, setSuggestedMentors] = useState<
    { mentor: any; score: number }[]
  >([]);
  const [assignedMentorId, setAssignedMentorId] = useState<string | null>(null);

  const departments = [
    'Computer Science', 'Electronics', 'Mechanical',
    'Aerospace', 'Chemical', 'Materials Science',
    'Physics', 'Mathematics'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const extractSkills = (text: string): string[] => {
    const skillList = [
      'python', 'java', 'c++', 'machine learning', 'deep learning', 'react',
      'node.js', 'sql', 'mongodb', 'html', 'css', 'javascript', 'tensorflow',
      'pytorch', 'data analysis', 'excel', 'power bi'
    ];
    const lowerText = text.toLowerCase();
    return skillList.filter(skill => lowerText.includes(skill));
  };

  const getMatchScore = (mentorSkills: string[], internSkills: string[]): number => {
    const matched = mentorSkills.filter(skill =>
      internSkills.includes(skill.toLowerCase())
    );
    return Math.round((matched.length / mentorSkills.length) * 100);
  };

  const suggestMentors = (extractedSkills: string[]) => {
    const mentors = storageService.getMentorUsers();
    const scored = mentors.map(mentor => ({
      mentor,
      score: getMatchScore(mentor.skills || [], extractedSkills)
    }));
    const sorted = scored
      .filter(m => m.score > 0)
      .sort((a, b) => b.score - a.score);
    setSuggestedMentors(sorted);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const text = await extractTextFromPDF(file);
      const extractedSkills = extractSkills(text);

      setFormData(prev => ({
        ...prev,
        skills: extractedSkills.join(', ')
      }));

      suggestMentors(extractedSkills);
    }
  };

  const handleAssignMentor = (mentorId: string) => {
    const allInterns = storageService.getInterns();
    const targetIntern = allInterns.find(i => i.email === formData.email);
  
    if (targetIntern) {
      storageService.updateIntern(targetIntern.id, {
        status: 'assigned',
        mentorId
      });
  
      toast({
        title: 'Mentor Assigned',
        description: `Intern has been assigned to mentor ID ${mentorId}`
      });
  
      setAssignedMentorId(mentorId);
      navigate('/admin');
    } else {
      toast({
        title: 'Error',
        description: 'Intern not found. Please add the intern before assigning a mentor.',
        variant: 'destructive'
      });
    }
  };
  

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const intern = storageService.addIntern({
      name: formData.name,
      email: formData.email,
      skills: formData.skills,
      department: formData.department
    });

    toast({
      title: 'Intern Added',
      description: `${formData.name} added successfully`
    });

    setFormData({
      name: '',
      email: '',
      skills: '',
      department: '',
      expectedDuration: ''
    });
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Add New Intern</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-6">
            <Button
              variant={inputMethod === 'form' ? 'default' : 'outline'}
              onClick={() => setInputMethod('form')}
            >
              Web Form
            </Button>
            <Button
              variant={inputMethod === 'upload' ? 'default' : 'outline'}
              onClick={() => setInputMethod('upload')}
            >
              Upload Resume
            </Button>
          </div>

          {inputMethod === 'form' && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Name</Label>
                  <Input
                    value={formData.name}
                    onChange={e => handleInputChange('name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    type="email"
                    required
                  />
                </div>
              </div>
              <div>
                <Label>Department</Label>
                <select
                  value={formData.department}
                  onChange={e => handleInputChange('department', e.target.value)}
                  className="w-full border rounded-md p-2"
                  required
                >
                  <option value="">Select</option>
                  {departments.map(dep => (
                    <option key={dep} value={dep}>{dep}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Skills</Label>
                <Textarea
                  value={formData.skills}
                  onChange={e => handleInputChange('skills', e.target.value)}
                  placeholder="Comma separated"
                />
              </div>
              <Button type="submit">Add Intern</Button>
            </form>
          )}

          {inputMethod === 'upload' && (
            <div className="space-y-4">
              <Label htmlFor="resume">Upload Resume (PDF)</Label>
              <Input
                id="resume"
                type="file"
                accept="application/pdf"
                onChange={handleFileUpload}
              />
              {formData.skills && (
                <div className="bg-muted p-3 rounded-md">
                  <strong>Extracted Skills:</strong> {formData.skills}
                </div>
              )}
            </div>
          )}

          {suggestedMentors.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-2">Suggested Mentors</h3>
              {suggestedMentors.map(({ mentor, score }) => (
                <MentorSuggestion key={mentor.email}
                mentor={mentor}
                matchScore={score}
                isAssigned={assignedMentorId === mentor.email}
                onAssign={() => handleAssignMentor(mentor.id)} 
                />

              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AddIntern;

