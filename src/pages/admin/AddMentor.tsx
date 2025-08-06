import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCog, Copy, Search, X } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

import { storageService } from '../../lib/storage';
import SKILLS from '@/data/skills.json';

interface MentorFormData {
  username: string;
  email: string;
  department: string;
  phone: string;
  skills: string[];
}

// DRDO-relevant departments
const departments = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Aerospace',
  'Chemical',
  'Materials Science',
  'Physics',
  'Mathematics',
  'Civil Engineering',
  'Biomedical Engineering',
];

// Department-specific skill mapping based on the provided skills list
const departmentalSkills: Record<string, string[]> = {
  'Computer Science': SKILLS.filter(skill =>
    [
      'python', 'c', 'c++', 'java', 'javascript', 'typescript', 'html', 'css', 'react', 'angular', 'vue',
      'node.js', 'express', 'django', 'flask', 'sql', 'mongodb', 'firebase', 'postgresql', 'redis',
      'machine learning', 'deep learning', 'neural networks', 'tensorflow', 'pytorch', 'keras',
      'scikit-learn', 'pandas', 'numpy', 'matplotlib', 'data science', 'data analysis', 'data visualization',
      'nlp', 'computer vision', 'transformers', 'bert', 'gpt', 'cybersecurity', 'cryptography',
      'network security', 'ethical hacking', 'penetration testing', 'reverse engineering', 'firewalls',
      'zero trust architecture', 'blockchain', 'distributed systems', 'cloud computing', 'aws', 'azure',
      'gcp', 'devops', 'docker', 'kubernetes', 'ci/cd', 'internet of things', 'iot', 'iot security',
      'edge computing', 'wireless sensor networks', 'simulation', 'modeling', 'system dynamics', 'digital twin',
      'artificial intelligence', 'reinforcement learning', 'swarm intelligence', 'genetic algorithms',
      'fuzzy logic', 'bayesian networks', 'project management', 'technical writing', 'latex', 'ms office',
      'research', 'patent drafting', 'system design', 'agile', 'scrum', 'git'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Electronics': SKILLS.filter(skill =>
    [
      'control systems', 'embedded systems', 'microcontrollers', 'arduino', 'raspberry pi', 'verilog',
      'vhdl', 'fpga', 'rtl design', 'system verilog', 'signal processing', 'dsp', 'image processing',
      'matlab', 'simulink', 'frequency analysis', 'fourier transform', 'filter design', 'electrical machines',
      'power electronics', 'circuit analysis', 'electric vehicles', 'battery systems', 'bms', 'power systems',
      'smart grid', 'hvac', 'motor control', 'power system protection', 'high voltage engineering',
      'iot', 'iot security', 'zigbee', 'lora', 'edge computing', 'wireless sensor networks', 'communication systems',
      'wireless communication', 'satellite communication', 'microwaves', 'antennas', 'digital electronics', 'analog electronics',
      'pcb design'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Mechanical': SKILLS.filter(skill =>
    [
      'mechanical design', 'solidworks', 'catia', 'autocad', 'creo', 'nx', 'ansys structural', 'fea',
      'thermal analysis', 'manufacturing', 'cnc', '3d printing', 'cad', 'thermodynamics', 'heat transfer',
      'fluid mechanics', 'automotive engineering', 'vehicle dynamics', 'combustion engines', 'aerodynamics',
      'computational fluid dynamics', 'cfd', 'fluent', 'ansys', 'openfoam', 'wind tunnel testing', 'propulsion',
      'combustion', 'vibration analysis', 'materials science', 'composites', 'alloys', 'metallurgy', 'robotics'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Aerospace': SKILLS.filter(skill =>
    [
      'aerodynamics', 'computational fluid dynamics', 'cfd', 'fluent', 'ansys', 'openfoam', 'wind tunnel testing',
      'propulsion', 'combustion', 'aerospace engineering', 'flight dynamics', 'aircraft design', 'spacecraft systems',
      'orbital mechanics', 'finite element method', 'thermodynamics', 'materials science', 'composites', 'alloys',
      'vibration analysis', 'robotics', 'control systems'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Civil Engineering': SKILLS.filter(skill =>
    [
      'civil engineering', 'structural analysis', 'geotechnical engineering', 'transportation engineering',
      'water resource management', 'environmental engineering', 'construction management', 'seismic design',
      'autocad civil 3d', 'revit', 'etabs', 'staad pro', 'gis', 'surveying'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Materials Science': SKILLS.filter(skill =>
    [
      'materials science', 'composites', 'alloys', 'semiconductors', 'nano materials', 'metallurgy',
      'ceramics', 'coating technologies', 'additive manufacturing', 'nondestructive testing (ndt)', 'welding',
      'thermodynamics', 'fluid mechanics', 'quantum electronics', 'nanotechnology'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Biomedical Engineering': SKILLS.filter(skill =>
    [
      'biomedical engineering', 'medical devices', 'biomechanics', 'tissue engineering', 'biomaterials',
      'medical imaging', 'biosensors', 'biomedical signal processing', 'biostatistics', 'bioinformatics',
      'genomics', 'proteomics', 'molecular biology', 'genetic engineering', 'bioprocess engineering', 'bioreactors'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Physics': SKILLS.filter(skill =>
    [
      'quantum computing', 'quantum electronics', 'quantum key distribution', 'nanotechnology', 'optics', 'laser technology',
      'electromagnetism', 'thermodynamics', 'fluid mechanics', 'solid state physics', 'materials science', 'acoustics',
      'astrodynamics', 'orbital mechanics', 'high-performance computing (hpc)'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Mathematics': SKILLS.filter(skill =>
    [
      'mathematical modeling', 'statistics', 'probability', 'algebra', 'calculus', 'differential equations',
      'linear algebra', 'numerical analysis', 'scientific computing', 'optimization', 'stochastic processes',
      'monte carlo simulation', 'data analysis', 'biostatistics', 'econometrics'
    ].includes(skill.toLowerCase())
  ).sort(),
  'Chemical': SKILLS.filter(skill =>
    [
      'chemical engineering', 'process design', 'process simulation', 'aspentech', 'chemcad', 'fluid dynamics',
      'heat transfer', 'mass transfer', 'reaction engineering', 'thermodynamics', 'bioprocess engineering',
      'bioreactors', 'fermentation', 'pharmaceutical engineering', 'drug delivery', 'nanomedicine',
      'chemistry', 'organic chemistry', 'inorganic chemistry', 'analytical chemistry', 'physical chemistry',
      'polymer chemistry', 'materials chemistry'
    ].includes(skill.toLowerCase())
  ).sort(),
};

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
  const [searchTerm, setSearchTerm] = useState('');
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Reset skills when department changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      skills: [],
    }));
  }, [formData.department]);

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
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

  const handleSkillChange = (skill: string, isChecked: boolean) => {
    setFormData((prev) => {
      const newSkills = isChecked
        ? [...prev.skills, skill]
        : prev.skills.filter((s) => s !== skill);
      return { ...prev, skills: newSkills };
    });
  };

  const filteredSkills = useMemo(() => {
    const skillsForDept = departmentalSkills[formData.department] || [];
    if (!searchTerm) {
      return skillsForDept;
    }
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return skillsForDept.filter(skill =>
      skill.toLowerCase().includes(lowercasedSearchTerm)
    );
  }, [searchTerm, formData.department]);

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
        skills: formData.skills,
      });

      setGeneratedPassword(tempPassword);
      setShowPasswordBox(true);
      setCopied(false);

      toast({
        title: 'Mentor Added Successfully',
        description: `A temporary password has been generated for ${formData.username}.`,
      });

      setFormData({
        username: '',
        email: '',
        department: '',
        phone: '',
        skills: [],
      });
      setSearchTerm('');
      setPopoverOpen(false);

      setTimeout(() => {
        navigate('/admin');
      }, 30 * 1000);
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
    <Card className="max-w-3xl mx-auto my-10">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold">Add New Mentor</CardTitle>
        <UserCog className="h-8 w-8 text-drdo-navy" />
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                required
              />
            </div>
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                required
              />
            </div>
            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
              />
            </div>
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <select
                id="department"
                value={formData.department}
                onChange={(e) => handleInputChange('department', e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
          </div>
          
          {/* Skills Dropdown with Search and Checklist */}
          <div className="space-y-2">
            <Label>Skills</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-between"
                  disabled={!formData.department}
                >
                  <span className="truncate">
                    {formData.skills.length > 0
                      ? formData.skills.join(', ')
                      : 'Select skills...'}
                  </span>
                  <div className="flex items-center space-x-2">
                    {formData.skills.length > 0 && (
                      <Badge variant="secondary">
                        {formData.skills.length} selected
                      </Badge>
                    )}
                  </div>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[360px] p-0">
                <div className="p-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                    <Input
                      type="text"
                      placeholder="Search skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9"
                    />
                    {searchTerm && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSearchTerm('')}
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6"
                      >
                        <X size={16} />
                      </Button>
                    )}
                  </div>
                </div>
                <ScrollArea className="max-h-60 overflow-y-auto px-2 pb-2">
                  <div className="flex flex-col space-y-2">
                    {filteredSkills.length > 0 ? (
                      filteredSkills.map((skill) => (
                        <div key={skill} className="flex items-center space-x-2">
                          <Checkbox
                            id={skill}
                            checked={formData.skills.includes(skill)}
                            onCheckedChange={(checked) => handleSkillChange(skill, !!checked)}
                          />
                          <Label htmlFor={skill} className="text-sm font-normal cursor-pointer">
                            {skill}
                          </Label>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground py-4">No skills found.</div>
                    )}
                  </div>
                </ScrollArea>
              </PopoverContent>
            </Popover>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4 mt-6">
            <Button type="button" variant="outline" onClick={() => navigate('/admin')}>
              Cancel
            </Button>
            <Button type="submit" className="bg-drdo-navy hover:bg-drdo-navy/90 text-white">
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
            <Button
              variant="ghost"
              size="sm"
              onClick={copyToClipboard}
              className="text-sm ml-4 flex items-center text-green-800 hover:text-green-600 transition-colors"
            >
              <Copy className="h-4 w-4 mr-1" /> {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AddMentor;