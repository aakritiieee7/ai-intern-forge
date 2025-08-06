import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ClipboardList, CheckCircle, Calendar, User } from 'lucide-react';
import { storageService, Intern } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const OngoingProjects = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [projects, setProjects] = useState<Intern[]>([]);
  const [selectedProject, setSelectedProject] = useState<Intern | null>(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [attendance, setAttendance] = useState('');
  const [completionRemarks, setCompletionRemarks] = useState('');

  useEffect(() => {
    if (user) {
      // Load ongoing projects for this mentor
      const ongoingProjects = storageService.getInternsByMentor(user.id).filter(
        intern => intern.status === 'ongoing'
      );
      setProjects(ongoingProjects);
    }
  }, [user]);

  const handleCompleteProject = (project: Intern) => {
    setSelectedProject(project);
    setAttendance('');
    setCompletionRemarks('');
    setIsCompleteDialogOpen(true);
  };

  const confirmCompletion = () => {
    if (!selectedProject || !attendance.trim()) return;

    const attendanceNum = parseFloat(attendance);
    if (isNaN(attendanceNum) || attendanceNum < 0 || attendanceNum > 100) {
      toast({
        title: "Invalid Attendance",
        description: "Please enter a valid attendance percentage (0-100)",
        variant: "destructive",
      });
      return;
    }

    try {
      // Update intern status to completed
      storageService.updateIntern(selectedProject.id, {
        status: 'completed',
        endDate: new Date().toISOString(),
        attendance: attendanceNum,
        remarks: completionRemarks.trim() || undefined
      });

      // Update project status
      const projects = storageService.getProjects();
      const projectIndex = projects.findIndex(
        p => p.internId === selectedProject.id && p.status === 'ongoing'
      );
      if (projectIndex !== -1) {
        storageService.updateProject(projects[projectIndex].id, {
          status: 'completed',
          endDate: new Date().toISOString(),
          attendance: attendanceNum,
          remarks: completionRemarks.trim() || undefined
        });
      }

      // Refresh the projects list
      const updatedProjects = storageService.getInternsByMentor(user!.id).filter(
        intern => intern.status === 'ongoing'
      );
      setProjects(updatedProjects);

      toast({
        title: "Project Completed",
        description: `${selectedProject.name}'s project has been marked as completed`,
      });

      setIsCompleteDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getProjectDuration = (startDate: string) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate('/mentor')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <ClipboardList className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-drdo-navy">Ongoing Projects</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Active Projects</h2>
          <p className="text-muted-foreground">
            Monitor and complete ongoing intern projects under your mentorship.
          </p>
        </div>

        {projects.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <ClipboardList className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Ongoing Projects</h3>
              <p className="text-muted-foreground">You don't have any active projects to monitor.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-drdo-navy">{project.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">PROJECT TITLE</h4>
                      <p className="font-medium">{project.projectTitle || 'Not specified'}</p>
                    </div>

                    {project.projectDescription && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">DESCRIPTION</h4>
                        <p className="text-sm text-muted-foreground">{project.projectDescription}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">DEPARTMENT</h4>
                        <Badge variant="outline" className="border-drdo-navy text-drdo-navy">
                          {project.department}
                        </Badge>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">DURATION</h4>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.startDate ? `${getProjectDuration(project.startDate)} days` : 'N/A'}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">SKILLS</h4>
                      <p className="text-sm">{project.skills}</p>
                    </div>

                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">CONTACT</h4>
                      <p className="text-sm">{project.email}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => handleCompleteProject(project)}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Mark as Completed
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Complete Project Dialog */}
        <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-drdo-navy">Complete Project</DialogTitle>
              <DialogDescription>
                Mark {selectedProject?.name}'s project as completed
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Project Details</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Intern:</strong> {selectedProject?.name}</div>
                  <div><strong>Project:</strong> {selectedProject?.projectTitle}</div>
                  <div><strong>Department:</strong> {selectedProject?.department}</div>
                  {selectedProject?.startDate && (
                    <div><strong>Duration:</strong> {getProjectDuration(selectedProject.startDate)} days</div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="attendance">Attendance Percentage *</Label>
                <Input
                  id="attendance"
                  type="number"
                  min="0"
                  max="100"
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  placeholder="Enter attendance percentage (0-100)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completionRemarks">Completion Remarks (Optional)</Label>
                <Textarea
                  id="completionRemarks"
                  value={completionRemarks}
                  onChange={(e) => setCompletionRemarks(e.target.value)}
                  placeholder="Add any final remarks about the project completion"
                  rows={3}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsCompleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmCompletion}
                disabled={!attendance.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Complete Project
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default OngoingProjects;