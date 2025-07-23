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
import { ArrowLeft, UserCheck, UserX, Mail, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { storageService, Intern, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const InternRequests = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [isAcceptDialogOpen, setIsAcceptDialogOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [projectTitle, setProjectTitle] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [rejectRemarks, setRejectRemarks] = useState('');
  const [alternativeMentorId, setAlternativeMentorId] = useState('');

  useEffect(() => {
    if (user) {
      // Load interns assigned to this mentor
      const assignedInterns = storageService.getInternsByMentor(user.id).filter(
        intern => intern.status === 'assigned'
      );
      const availableMentors = storageService.getMentorUsers().filter(
        mentor => mentor.id !== user.id
      );
      setInterns(assignedInterns);
      setMentors(availableMentors);
    }
  }, [user]);

  const handleAccept = (intern: Intern) => {
    setSelectedIntern(intern);
    setProjectTitle('');
    setProjectDescription('');
    setIsAcceptDialogOpen(true);
  };

  const handleReject = (intern: Intern) => {
    setSelectedIntern(intern);
    setRejectRemarks('');
    setAlternativeMentorId('');
    setIsRejectDialogOpen(true);
  };

  const confirmAccept = () => {
    if (!selectedIntern || !projectTitle.trim()) return;

    try {
      // Update intern status to ongoing
      storageService.updateIntern(selectedIntern.id, {
        status: 'ongoing',
        projectTitle: projectTitle.trim(),
        projectDescription: projectDescription.trim(),
        startDate: new Date().toISOString()
      });

      // Create project record
      storageService.addProject({
        internId: selectedIntern.id,
        mentorId: user!.id,
        title: projectTitle.trim(),
        description: projectDescription.trim(),
        status: 'ongoing',
        startDate: new Date().toISOString()
      });

      // Refresh the interns list
      const updatedInterns = storageService.getInternsByMentor(user!.id).filter(
        intern => intern.status === 'assigned'
      );
      setInterns(updatedInterns);

      toast({
        title: "Intern Accepted",
        description: `${selectedIntern.name} has been accepted and project assigned`,
      });

      setIsAcceptDialogOpen(false);
      setSelectedIntern(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept intern. Please try again.",
        variant: "destructive",
      });
    }
  };

  const confirmReject = () => {
    if (!selectedIntern || !rejectRemarks.trim()) return;

    try {
      // Update intern status
      if (alternativeMentorId) {
        // Assign to alternative mentor
        storageService.updateIntern(selectedIntern.id, {
          mentorId: alternativeMentorId,
          status: 'assigned',
          remarks: `Rejected by previous mentor: ${rejectRemarks.trim()}`
        });
        
        toast({
          title: "Intern Reassigned",
          description: `${selectedIntern.name} has been assigned to another mentor`,
        });
      } else {
        // Mark as rejected
        storageService.updateIntern(selectedIntern.id, {
          status: 'rejected',
          remarks: rejectRemarks.trim()
        });
        
        toast({
          title: "Intern Rejected",
          description: `${selectedIntern.name} has been rejected`,
        });
      }

      // Refresh the interns list
      const updatedInterns = storageService.getInternsByMentor(user!.id).filter(
        intern => intern.status === 'assigned'
      );
      setInterns(updatedInterns);

      setIsRejectDialogOpen(false);
      setSelectedIntern(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process rejection. Please try again.",
        variant: "destructive",
      });
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
              onClick={() => navigate('/mentor')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <UserCheck className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-drdo-navy">New Intern Requests</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Pending Intern Assignments</h2>
          <p className="text-muted-foreground">
            Review and accept or reject interns assigned to your mentorship.
          </p>
        </div>

        {interns.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <UserCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Pending Requests</h3>
              <p className="text-muted-foreground">You don't have any new intern assignments to review.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {interns.map((intern) => (
              <Card key={intern.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-drdo-navy">{intern.name}</CardTitle>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Awaiting Response
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Contact Information</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            {intern.email}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                            Applied on {new Date(intern.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-2">Department</h4>
                        <Badge variant="outline" className="border-drdo-navy text-drdo-navy">
                          {intern.department}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">Skills & Expertise</h4>
                        <p className="text-sm text-muted-foreground">{intern.skills}</p>
                      </div>

                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleAccept(intern)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => handleReject(intern)}
                          className="border-red-500 text-red-500 hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Accept Dialog */}
        <Dialog open={isAcceptDialogOpen} onOpenChange={setIsAcceptDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-drdo-navy">Accept Intern & Assign Project</DialogTitle>
              <DialogDescription>
                Define the project details for {selectedIntern?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Intern Details</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Name:</strong> {selectedIntern?.name}</div>
                  <div><strong>Department:</strong> {selectedIntern?.department}</div>
                  <div><strong>Skills:</strong> {selectedIntern?.skills}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectTitle">Project Title *</Label>
                <Input
                  id="projectTitle"
                  value={projectTitle}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  placeholder="Enter project title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the project objectives and scope"
                  rows={4}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAcceptDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAccept}
                disabled={!projectTitle.trim()}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Accept & Assign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-drdo-navy">Reject Intern Assignment</DialogTitle>
              <DialogDescription>
                Provide reason for rejecting {selectedIntern?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Intern Details</h4>
                <div className="space-y-1 text-sm">
                  <div><strong>Name:</strong> {selectedIntern?.name}</div>
                  <div><strong>Department:</strong> {selectedIntern?.department}</div>
                  <div><strong>Skills:</strong> {selectedIntern?.skills}</div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rejectRemarks">Rejection Reason *</Label>
                <Textarea
                  id="rejectRemarks"
                  value={rejectRemarks}
                  onChange={(e) => setRejectRemarks(e.target.value)}
                  placeholder="Explain why you're rejecting this assignment"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alternativeMentor">Suggest Alternative Mentor (Optional)</Label>
                <select
                  id="alternativeMentor"
                  value={alternativeMentorId}
                  onChange={(e) => setAlternativeMentorId(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="">No alternative mentor</option>
                  {mentors.map((mentor) => (
                    <option key={mentor.id} value={mentor.id}>
                      {mentor.username} - {mentor.department}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmReject}
                disabled={!rejectRemarks.trim()}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default InternRequests;