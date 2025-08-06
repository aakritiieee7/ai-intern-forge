// Local storage service for DRDO HR system
export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'mentor';
  email: string;
  department: string;
  createdAt: string;
  skills?: string[]; 
}


export interface Intern {
  id: string;
  name: string;
  email: string;
  skills: string;
  department: string;
  status: 'pending' | 'assigned' | 'ongoing' | 'completed' | 'rejected';
  createdAt: string;
  mentorId?: string;
  projectTitle?: string;
  projectDescription?: string;
  startDate?: string;
  endDate?: string;
  attendance?: number;
  remarks?: string;
}

export interface Project {
  id: string;
  internId: string;
  mentorId: string;
  title: string;
  description: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  attendance?: number;
  remarks?: string;
}

export interface Certificate {
  id: string;
  internId: string;
  projectId: string;
  issueDate: string;
  certificatePath: string;
}

class StorageService {
  private readonly USERS_KEY = 'drdo_users';
  private readonly INTERNS_KEY = 'drdo_interns';
  private readonly PROJECTS_KEY = 'drdo_projects';
  private readonly CERTIFICATES_KEY = 'drdo_certificates';
  private readonly CURRENT_USER_KEY = 'drdo_current_user';

  constructor() {
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize default admin user if not exists
    const users = this.getUsers();
    if (users.length === 0) {
      const defaultAdmin: User = {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        email: 'admin@drdo.gov.in',
        department: 'HR',
        createdAt: new Date().toISOString()
      };
      this.saveUsers([defaultAdmin]);
    }
  }

  // User Management
  getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  addUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    this.saveUsers(users);
    return newUser;
  }

  authenticateUser(username: string, password: string): User | null {
    const users = this.getUsers();
    return users.find(user => user.username === username && user.password === password) || null;
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }

  // Intern Management
  getInterns(): Intern[] {
    const interns = localStorage.getItem(this.INTERNS_KEY);
    return interns ? JSON.parse(interns) : [];
  }

  saveInterns(interns: Intern[]): void {
    localStorage.setItem(this.INTERNS_KEY, JSON.stringify(interns));
  }

  addIntern(intern: Omit<Intern, 'id' | 'createdAt' | 'status'>): Intern {
    const interns = this.getInterns();
    const newIntern: Intern = {
      ...intern,
      id: Date.now().toString(),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    interns.push(newIntern);
    this.saveInterns(interns);
    return newIntern;
  }

  updateIntern(id: string, updates: Partial<Intern>): Intern | null {
    const interns = this.getInterns();
    const index = interns.findIndex(intern => intern.id === id);
    if (index !== -1) {
      interns[index] = { ...interns[index], ...updates };
      this.saveInterns(interns);
      return interns[index];
    }
    return null;
  }

  getInternsByMentor(mentorId: string): Intern[] {
    return this.getInterns().filter(intern => intern.mentorId === mentorId);
  }

  getInternsByStatus(status: Intern['status']): Intern[] {
    return this.getInterns().filter(intern => intern.status === status);
  }

  // Project Management
  getProjects(): Project[] {
    const projects = localStorage.getItem(this.PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
  }

  saveProjects(projects: Project[]): void {
    localStorage.setItem(this.PROJECTS_KEY, JSON.stringify(projects));
  }

  addProject(project: Omit<Project, 'id'>): Project {
    const projects = this.getProjects();
    const newProject: Project = {
      ...project,
      id: Date.now().toString()
    };
    projects.push(newProject);
    this.saveProjects(projects);
    return newProject;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const projects = this.getProjects();
    const index = projects.findIndex(project => project.id === id);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates };
      this.saveProjects(projects);
      return projects[index];
    }
    return null;
  }

  // Certificate Management
  getCertificates(): Certificate[] {
    const certificates = localStorage.getItem(this.CERTIFICATES_KEY);
    return certificates ? JSON.parse(certificates) : [];
  }

  saveCertificates(certificates: Certificate[]): void {
    localStorage.setItem(this.CERTIFICATES_KEY, JSON.stringify(certificates));
  }

  addCertificate(certificate: Omit<Certificate, 'id' | 'issueDate'>): Certificate {
    const certificates = this.getCertificates();
    const newCertificate: Certificate = {
      ...certificate,
      id: Date.now().toString(),
      issueDate: new Date().toISOString()
    };
    certificates.push(newCertificate);
    this.saveCertificates(certificates);
    return newCertificate;
  }

  // Utility Methods
  getMentorUsers(): User[] {
    return this.getUsers().filter(user => user.role === 'mentor');
  }

  getInternWithMentor(internId: string): (Intern & { mentor?: User }) | null {
    const intern = this.getInterns().find(i => i.id === internId);
    if (!intern) return null;
    
    const mentor = intern.mentorId ? this.getUsers().find(u => u.id === intern.mentorId) : undefined;
    return { ...intern, mentor };
  }
}

export const storageService = new StorageService();