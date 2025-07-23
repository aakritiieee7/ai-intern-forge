import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, Award, Download, Calendar, User, Building } from 'lucide-react';
import { storageService, Intern } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';

const Certificates = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [completedProjects, setCompletedProjects] = useState<Intern[]>([]);
  const [selectedProject, setSelectedProject] = useState<Intern | null>(null);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);

  useEffect(() => {
    // Load completed projects
    const completed = storageService.getInternsByStatus('completed');
    setCompletedProjects(completed);
  }, []);

  const handleGenerateCertificate = (project: Intern) => {
    setSelectedProject(project);
    setIsGenerateDialogOpen(true);
  };

  const generateCertificateData = (intern: Intern) => {
    const certificateData = {
      internName: intern.name,
      projectTitle: intern.projectTitle || 'Internship Project',
      department: intern.department,
      startDate: intern.startDate ? new Date(intern.startDate).toLocaleDateString() : 'N/A',
      endDate: intern.endDate ? new Date(intern.endDate).toLocaleDateString() : 'N/A',
      attendance: intern.attendance || 0,
      issueDate: new Date().toLocaleDateString(),
      certificateId: `DRDO-CERT-${Date.now()}`,
    };

    return certificateData;
  };

  const downloadCertificate = () => {
    if (!selectedProject) return;

    try {
      const certData = generateCertificateData(selectedProject);
      
      // Create a simple HTML certificate (in a real app, you'd use a proper PDF library)
      const certificateHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>DRDO Internship Certificate</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              margin: 0; 
              padding: 40px; 
              background: linear-gradient(135deg, #1e3a8a, #3b82f6);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .certificate { 
              background: white; 
              padding: 60px; 
              border: 10px solid #1e3a8a; 
              max-width: 800px;
              text-align: center;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              border-bottom: 3px solid #1e3a8a; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .title { 
              font-size: 36px; 
              color: #1e3a8a; 
              font-weight: bold; 
              margin-bottom: 10px;
            }
            .subtitle { 
              font-size: 18px; 
              color: #666; 
            }
            .content { 
              font-size: 18px; 
              line-height: 1.8; 
              margin: 30px 0; 
            }
            .name { 
              font-size: 28px; 
              font-weight: bold; 
              color: #1e3a8a; 
              text-decoration: underline;
            }
            .project { 
              font-style: italic; 
              color: #374151; 
            }
            .footer { 
              margin-top: 40px; 
              border-top: 2px solid #1e3a8a; 
              padding-top: 20px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .seal { 
              width: 80px; 
              height: 80px; 
              border: 3px solid #1e3a8a; 
              border-radius: 50%; 
              display: flex; 
              align-items: center; 
              justify-content: center;
              font-weight: bold;
              color: #1e3a8a;
            }
          </style>
        </head>
        <body>
          <div class="certificate">
            <div class="header">
              <div class="title">CERTIFICATE OF COMPLETION</div>
              <div class="subtitle">Defense Research & Development Organization</div>
            </div>
            
            <div class="content">
              <p>This is to certify that</p>
              <p class="name">${certData.internName}</p>
              <p>has successfully completed the internship program in</p>
              <p class="project">${certData.projectTitle}</p>
              <p>Department: <strong>${certData.department}</strong></p>
              <p>Duration: ${certData.startDate} to ${certData.endDate}</p>
              <p>Attendance: <strong>${certData.attendance}%</strong></p>
            </div>
            
            <div class="footer">
              <div>
                <p style="margin: 0; font-size: 14px;">Certificate ID: ${certData.certificateId}</p>
                <p style="margin: 0; font-size: 14px;">Issue Date: ${certData.issueDate}</p>
              </div>
              <div class="seal">DRDO<br/>SEAL</div>
            </div>
          </div>
        </body>
        </html>
      `;

      // Create and download the certificate
      const blob = new Blob([certificateHTML], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `DRDO_Certificate_${selectedProject.name.replace(/\s+/g, '_')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Store certificate record
      storageService.addCertificate({
        internId: selectedProject.id,
        projectId: selectedProject.id, // In a real app, this would be the actual project ID
        certificatePath: `certificates/${certData.certificateId}.pdf`
      });

      toast({
        title: "Certificate Generated",
        description: `Certificate for ${selectedProject.name} has been generated and downloaded`,
      });

      setIsGenerateDialogOpen(false);
      setSelectedProject(null);
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate certificate. Please try again.",
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
              onClick={() => navigate('/admin')}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center space-x-3">
              <Award className="w-6 h-6 text-primary" />
              <h1 className="text-xl font-bold text-drdo-navy">Issue Certificates</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Completed Projects</h2>
          <p className="text-muted-foreground">
            Generate and download certificates for successfully completed internship projects.
          </p>
        </div>

        {completedProjects.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-8 text-center">
              <Award className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No Completed Projects</h3>
              <p className="text-muted-foreground">No projects have been completed yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {completedProjects.map((project) => (
              <Card key={project.id} className="shadow-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-drdo-navy">{project.name}</CardTitle>
                    <Badge className="bg-green-100 text-green-800">
                      Completed
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm text-muted-foreground mb-1">PROJECT TITLE</h4>
                      <p className="font-medium">{project.projectTitle || 'Internship Project'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">DEPARTMENT</h4>
                        <div className="flex items-center">
                          <Building className="w-4 h-4 mr-1" />
                          <span className="text-sm">{project.department}</span>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">ATTENDANCE</h4>
                        <Badge variant={project.attendance && project.attendance >= 75 ? 'default' : 'destructive'}>
                          {project.attendance || 0}%
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">START DATE</h4>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">END DATE</h4>
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}
                        </div>
                      </div>
                    </div>

                    {project.remarks && (
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground mb-1">REMARKS</h4>
                        <p className="text-sm text-muted-foreground">{project.remarks}</p>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-border">
                    <Button
                      onClick={() => handleGenerateCertificate(project)}
                      className="w-full bg-gradient-primary hover:opacity-90"
                    >
                      <Award className="w-4 h-4 mr-2" />
                      Generate Certificate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Generate Certificate Dialog */}
        <Dialog open={isGenerateDialogOpen} onOpenChange={setIsGenerateDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-drdo-navy">Generate Certificate</DialogTitle>
              <DialogDescription>
                Generate completion certificate for {selectedProject?.name}
              </DialogDescription>
            </DialogHeader>
            
            {selectedProject && (
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-3">Certificate Preview</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Intern Name:</span>
                      <span>{selectedProject.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Project:</span>
                      <span>{selectedProject.projectTitle || 'Internship Project'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Department:</span>
                      <span>{selectedProject.department}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Duration:</span>
                      <span>
                        {selectedProject.startDate ? new Date(selectedProject.startDate).toLocaleDateString() : 'N/A'} - {' '}
                        {selectedProject.endDate ? new Date(selectedProject.endDate).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Attendance:</span>
                      <span>{selectedProject.attendance || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Issue Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 p-3 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    The certificate will be generated as an HTML file and automatically downloaded.
                  </p>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsGenerateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={downloadCertificate}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Download className="w-4 h-4 mr-2" />
                Generate & Download
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default Certificates;