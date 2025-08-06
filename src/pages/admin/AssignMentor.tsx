import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, UserCheck, Mail, Calendar } from 'lucide-react';
import { storageService, Intern, User } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const AssignMentor = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [interns, setInterns] = useState<Intern[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [selectedMentorId, setSelectedMentorId] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    // Load pending interns and available mentors
    const pendingInterns = storageService.getInternsByStatus('pending');
    const availableMentors = storageService.getMentorUsers();
    setInterns(pendingInterns);
    setMentors(availableMentors);
  }, []);

  const handleAssignMentor = (intern: Intern) => {
    setSelectedIntern(intern);
    setSelectedMentorId('');
    setIsDialogOpen(true);
  };

  const confirmAssignment = () => {
    if (!selectedIntern || !selectedMentorId) return;

    try {
      // Update intern with mentor assignment
      storageService.updateIntern(selectedIntern.id, {
        mentorId: selectedMentorId,
        status: 'assigned'
      });

      // Refresh the interns list
      const updatedInterns = storageService.getInternsByStatus('pending');
      setInterns(updatedInterns);

      toast({
        title: "Mentor Assigned Successfully",
        description: `${selectedIntern.name} has been assigned to the selected mentor`,
      });

      setIsDialogOpen(false);
      setSelectedIntern(null);
      setSelectedMentorId('');
    } catch (error) {
      toast({
        title: "Assignment Failed",
        description: "Failed to assign mentor. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'bg-yellow-100 text-yellow-800',
      assigned: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
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
              <Users className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-drdo-navy">Assign Mentor</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Pending Intern Assignments</h2>
          <p className="text-muted-foreground">
            Assign mentors to newly registered interns to begin their projects.
          </p>
        </div>

        {interns.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Pending Assignments</h3>
              <p className="text-muted-foreground">All interns have been assigned mentors.</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-drdo-navy">Interns Awaiting Mentor Assignment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-4 font-semibold text-drdo-navy">Name</th>
                      <th className="text-left p-4 font-semibold text-drdo-navy">Email</th>
                      <th className="text-left p-4 font-semibold text-drdo-navy">Department</th>
                      <th className="text-left p-4 font-semibold text-drdo-navy">Skills</th>
                      <th className="text-left p-4 font-semibold text-drdo-navy">Status</th>
                      <th className="text-left p-4 font-semibold text-drdo-navy">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {interns.map((intern) => (
                      <tr key={intern.id} className="border-b border-border hover:bg-muted/50">
                        <td className="p-4">
                          <div className="font-medium">{intern.name}</div>
                          <div className="text-sm text-muted-foreground flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(intern.createdAt).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center text-sm">
                            <Mail className="w-4 h-4 mr-2 text-muted-foreground" />
                            {intern.email}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="border-drdo-navy text-drdo-navy">
                            {intern.department}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm max-w-xs truncate" title={intern.skills}>
                            {intern.skills}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={getStatusBadge(intern.status)}>
                            {intern.status.charAt(0).toUpperCase() + intern.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <Button
                            size="sm"
                            onClick={() => handleAssignMentor(intern)}
                            className="bg-gradient-primary hover:opacity-90"
                          >
                            <UserCheck className="w-4 h-4 mr-2" />
                            Assign
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assignment Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-drdo-navy">Assign Mentor</DialogTitle>
              <DialogDescription>
                Select a mentor for {selectedIntern?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedIntern && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Intern Details</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Name:</strong> {selectedIntern.name}</div>
                    <div><strong>Email:</strong> {selectedIntern.email}</div>
                    <div><strong>Department:</strong> {selectedIntern.department}</div>
                    <div><strong>Skills:</strong> {selectedIntern.skills}</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mentor">Select Mentor</Label>
                  <select
                    id="mentor"
                    value={selectedMentorId}
                    onChange={(e) => setSelectedMentorId(e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Choose a mentor...</option>
                    {mentors.map((mentor) => (
                      <option key={mentor.id} value={mentor.id}>
                        {mentor.username} - {mentor.department}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAssignment}
                disabled={!selectedMentorId}
                className="bg-gradient-primary hover:opacity-90"
              >
                Assign Mentor
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AssignMentor;