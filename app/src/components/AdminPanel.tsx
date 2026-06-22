import { useState, useRef } from 'react';
import { X, User, Briefcase, Award, Mail, Settings, Plus, Trash2, Save, Download, Upload, RotateCcw } from 'lucide-react';
import type { PortfolioData, Project, Skill, Certification } from '@/types';
import { supabase } from '@/lib/supabase';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  data: PortfolioData;
  updateProfile: (profile: Partial<PortfolioData['profile']>) => void;
  updateStats: (stats: Partial<PortfolioData['stats']>) => void;
  updateContact: (contact: Partial<PortfolioData['contact']>) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  deleteProject: (id: string) => void;
  addSkill: (categoryId: string, skill: Omit<Skill, 'id'>) => void;
  deleteSkill: (categoryId: string, skillId: string) => void;
  addCertification: (cert: Omit<Certification, 'id'>) => void;
  deleteCertification: (id: string) => void;
  resetData: () => void;
  exportData: () => void;
  importData: (json: string) => boolean;
}

type Tab = 'profile' | 'projects' | 'skills' | 'certifications' | 'contact' | 'settings';

export function AdminPanel({ 
  isOpen, 
  onClose, 
  data,
  updateProfile,
  updateStats,
  updateContact,
  addProject,
  deleteProject,
  addSkill,
  deleteSkill,
  addCertification,
  deleteCertification,
  resetData,
  exportData,
  importData,
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [newSkillCategory, setNewSkillCategory] = useState('');
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [profileForm, setProfileForm] = useState(data.profile);
  const [statsForm, setStatsForm] = useState(data.stats);
  const [contactForm, setContactForm] = useState(data.contact);
  const [newProject, setNewProject] = useState<Partial<Project>>({ type: 'Data Engineering', tools: [], featured: false, link: '' });
  const [newCert, setNewCert] = useState<Partial<Certification>>({});
  const [newSkillName, setNewSkillName] = useState('');

  if (!isOpen) return null;

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => {
          setLoginId(''); setPassword(''); setLoginError('');
          onClose();
        }} />
        <div className="relative w-full max-w-md bg-[rgba(20,20,20,0.95)] border border-gold/20 rounded-2xl shadow-2xl p-8 z-10 animate-scale-in mx-4">
          <button onClick={() => {
            setLoginId(''); setPassword(''); setLoginError('');
            onClose();
          }} className="absolute right-4 top-4 p-2 text-gold-muted hover:text-gold transition-colors hover:bg-gold/10 rounded-lg">
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-gold/20">
              <User className="w-6 h-6 text-gold" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gold">Admin Access</h2>
            <p className="text-gold-muted mt-2">Please log in to manage your portfolio</p>
          </div>

          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoginError('');
            
            try {
              if (loginId === 'anbu' && password === '10') {
                setIsAuthenticated(true);
                setLoginId('');
                setPassword('');
                return;
              }

              const { data, error } = await supabase.auth.signInWithPassword({
                email: loginId,
                password: password,
              });

              if (error) {
                setLoginError(error.message);
              } else if (data?.session) {
                setIsAuthenticated(true);
                setLoginId('');
                setPassword('');
              }
            } catch (err: any) {
              setLoginError(err.message || 'An unexpected error occurred');
            }
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gold-muted mb-1.5">Username / Email</label>
              <input type="text" value={loginId} onChange={(e) => setLoginId(e.target.value)} required className="w-full px-4 py-3 bg-[rgba(10,10,10,1)] border border-gold/20 rounded-xl text-gold focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gold-muted/30" placeholder="anbu or admin@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gold-muted mb-1.5">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 bg-[rgba(10,10,10,1)] border border-gold/20 rounded-xl text-gold focus:outline-none focus:border-gold/50 transition-colors placeholder:text-gold-muted/30" placeholder="••••••••" />
            </div>
            
            {loginError && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-400 text-center">
                {loginError}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-3.5 mt-2 flex items-center justify-center gap-2">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'projects' as Tab, label: 'Projects', icon: Briefcase },
    { id: 'skills' as Tab, label: 'Skills', icon: Settings },
    { id: 'certifications' as Tab, label: 'Certifications', icon: Award },
    { id: 'contact' as Tab, label: 'Contact', icon: Mail },
    { id: 'settings' as Tab, label: 'Settings', icon: Settings },
  ];

  const handleSaveProfile = () => { updateProfile(profileForm); alert('Profile saved!'); };
  const handleSaveStats = () => { updateStats(statsForm); alert('Stats saved!'); };
  const handleSaveContact = () => { updateContact(contactForm); alert('Contact info saved!'); };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      addProject({ 
        ...newProject, 
        tools: newProject.tools || [], 
        icon: newProject.icon || '📊',
        link: newProject.link || ''
      } as Omit<Project, 'id'>);
      setNewProject({ type: 'Data Engineering', tools: [], featured: false, link: '' });
      alert('Project added!');
    }
  };

  const handleAddCert = () => {
    if (newCert.name && newCert.issuer) {
      addCertification(newCert as Omit<Certification, 'id'>);
      setNewCert({});
      alert('Certification added!');
    }
  };

  const handleAddSkill = () => {
    if (newSkillCategory && newSkillName) {
      addSkill(newSkillCategory, { name: newSkillName, category: data.skills.find(s => s.id === newSkillCategory)?.name || '' });
      setNewSkillName('');
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = importData(event.target?.result as string);
        alert(success ? 'Data imported successfully!' : 'Failed to import data');
      };
      reader.readAsText(file);
    }
  };

  const projectTypes = ['Data Engineering', 'Data Analyst', 'Web Dev', 'Machine Learning'];
  const projectIcons = ['📊', '📈', '🔍', '⚙️', '🚀', '💡', '🔧', '📦', '🌐', '🔌', '🚗', '🛒'];

  return (
    <div className="fixed inset-0 z-[100] flex">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative ml-auto w-full max-w-2xl h-full bg-forest border-l border-gold/20 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gold/10">
          <div>
            <h2 className="text-xl font-serif font-semibold text-gold">Admin Panel</h2>
            <p className="text-sm text-gold-muted">Manage your portfolio content</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gold/10 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gold" />
          </button>
        </div>

        <div className="flex overflow-x-auto border-b border-gold/10 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab.id ? 'text-gold border-b-2 border-gold' : 'text-gold-muted hover:text-gold'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gold-muted mb-2">Profile Photo (URL or Upload)</label>
                <div className="flex gap-2 mb-3">
                  <input type="text" value={profileForm.photo || ''} onChange={(e) => setProfileForm({ ...profileForm, photo: e.target.value })} className="flex-1 px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted/50 focus:outline-none focus:border-gold/50" placeholder="Enter image URL..." />
                  <label className="flex items-center justify-center gap-2 px-4 bg-gold/10 border border-gold/20 rounded-lg text-gold hover:bg-gold/20 cursor-pointer transition-colors whitespace-nowrap">
                    <Upload className="w-4 h-4" />
                    <span>Upload</span>
                    <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setProfileForm({ ...profileForm, photo: event.target?.result as string });
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                {profileForm.photo && (
                  <div className="relative w-20 h-20 rounded-full border-2 border-gold/30 overflow-hidden flex-shrink-0">
                    <img src={profileForm.photo} alt="Profile preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">Resume (URL or Upload PDF/DOCX)</label>
                <div className="flex gap-2 mb-1">
                  <input type="text" value={profileForm.resumeUrl || ''} onChange={(e) => setProfileForm({ ...profileForm, resumeUrl: e.target.value })} className="flex-1 px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted/50 focus:outline-none focus:border-gold/50" placeholder="Enter resume URL..." />
                  <label className="flex items-center justify-center gap-2 px-4 bg-gold/10 border border-gold/20 rounded-lg text-gold hover:bg-gold/20 cursor-pointer transition-colors whitespace-nowrap">
                    <Upload className="w-4 h-4" />
                    <span>Upload Docs</span>
                    <input type="file" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="hidden" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => setProfileForm({ ...profileForm, resumeUrl: event.target?.result as string });
                        reader.readAsDataURL(file);
                      }
                    }} />
                  </label>
                </div>
                {profileForm.resumeUrl && (
                  <span className="text-xs text-green-400">✓ Resume linked</span>
                )}
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">Name</label>
                <input type="text" value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">Title</label>
                <input type="text" value={profileForm.title} onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">Tagline</label>
                <textarea value={profileForm.tagline} onChange={(e) => setProfileForm({ ...profileForm, tagline: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50 resize-none" />
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">About (use double newline for paragraphs)</label>
                <textarea value={profileForm.about} onChange={(e) => setProfileForm({ ...profileForm, about: e.target.value })} rows={8} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50 resize-none" />
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="available" checked={profileForm.available} onChange={(e) => setProfileForm({ ...profileForm, available: e.target.checked })} className="w-4 h-4 rounded border-gold/30" />
                <label htmlFor="available" className="text-gold">Available for opportunities</label>
              </div>
              <button onClick={handleSaveProfile} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Profile
              </button>

              <div className="pt-6 border-t border-gold/10">
                <h3 className="text-lg font-semibold text-gold mb-4">Stats</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm text-gold-muted mb-2">Projects</label>
                    <input type="number" value={statsForm.projects} onChange={(e) => setStatsForm({ ...statsForm, projects: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold-muted mb-2">Certifications</label>
                    <input type="number" value={statsForm.certifications} onChange={(e) => setStatsForm({ ...statsForm, certifications: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
                  </div>
                  <div>
                    <label className="block text-sm text-gold-muted mb-2">Years Learning</label>
                    <input type="number" value={statsForm.yearsLearning} onChange={(e) => setStatsForm({ ...statsForm, yearsLearning: parseInt(e.target.value) || 0 })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
                  </div>
                </div>
                <button onClick={handleSaveStats} className="btn-primary flex items-center gap-2 mt-4">
                  <Save className="w-4 h-4" /> Save Stats
                </button>
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="glass-card p-4 space-y-4">
                <h3 className="font-semibold text-gold">Add New Project</h3>
                <input type="text" placeholder="Project Title" value={newProject.title || ''} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <textarea placeholder="Description" value={newProject.description || ''} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} rows={2} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50 resize-none" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={newProject.type} onChange={(e) => setNewProject({ ...newProject, type: e.target.value })} className="px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50">
                    {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={newProject.icon} onChange={(e) => setNewProject({ ...newProject, icon: e.target.value })} className="px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50">
                    {projectIcons.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <input type="text" placeholder="Tools (comma separated)" value={newProject.tools?.join(', ') || ''} onChange={(e) => setNewProject({ ...newProject, tools: e.target.value.split(',').map(t => t.trim()).filter(Boolean) })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <input type="text" placeholder="Outcome" value={newProject.outcome || ''} onChange={(e) => setNewProject({ ...newProject, outcome: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <input type="text" placeholder="Project Website URL / Link (optional)" value={newProject.link || ''} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <div className="flex items-center gap-3">
                  <input type="checkbox" id="featured" checked={newProject.featured} onChange={(e) => setNewProject({ ...newProject, featured: e.target.checked })} className="w-4 h-4" />
                  <label htmlFor="featured" className="text-gold">Featured Project</label>
                </div>
                <button onClick={handleAddProject} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gold">Existing Projects</h3>
                {data.projects.map((project) => (
                  <div key={project.id} className="glass-card p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{project.icon}</span>
                      <div>
                        <p className="text-gold font-medium">{project.title}</p>
                        <p className="text-sm text-gold-muted">{project.type}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteProject(project.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-6">
              <div className="glass-card p-4 space-y-4">
                <h3 className="font-semibold text-gold">Add New Skill</h3>
                <select value={newSkillCategory} onChange={(e) => setNewSkillCategory(e.target.value)} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50">
                  <option value="">Select Category</option>
                  {data.skills.map(cat => <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>)}
                </select>
                <input type="text" placeholder="Skill Name" value={newSkillName} onChange={(e) => setNewSkillName(e.target.value)} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <button onClick={handleAddSkill} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Skill
                </button>
              </div>

              {data.skills.map((category) => (
                <div key={category.id} className="glass-card p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">{category.icon}</span>
                    <h4 className="font-semibold text-gold">{category.name}</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill.id} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gold/10 border border-gold/20 rounded-full text-sm text-gold">
                        {skill.name}
                        <button onClick={() => deleteSkill(category.id, skill.id)} className="hover:text-red-400 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="glass-card p-4 space-y-4">
                <h3 className="font-semibold text-gold">Add New Certification</h3>
                <input type="text" placeholder="Certification Name" value={newCert.name || ''} onChange={(e) => setNewCert({ ...newCert, name: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <input type="text" placeholder="Issuer" value={newCert.issuer || ''} onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="Date (e.g., Jan 2024)" value={newCert.date || ''} onChange={(e) => setNewCert({ ...newCert, date: e.target.value })} className="px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                  <input type="text" placeholder="End Date (optional)" value={newCert.endDate || ''} onChange={(e) => setNewCert({ ...newCert, endDate: e.target.value })} className="px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold placeholder-gold-muted focus:outline-none focus:border-gold/50" />
                </div>
                <button onClick={handleAddCert} className="btn-primary flex items-center gap-2">
                  <Plus className="w-4 h-4" /> Add Certification
                </button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-gold">Existing Certifications</h3>
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <p className="text-gold font-medium">{cert.name}</p>
                      <p className="text-sm text-gold-muted">{cert.issuer} • {cert.date}</p>
                    </div>
                    <button onClick={() => deleteCertification(cert.id)} className="p-2 hover:bg-red-500/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm text-gold-muted mb-2">Email</label>
                <input type="email" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">LinkedIn URL</label>
                <input type="text" value={contactForm.linkedin} onChange={(e) => setContactForm({ ...contactForm, linkedin: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
              </div>
              <div>
                <label className="block text-sm text-gold-muted mb-2">GitHub URL</label>
                <input type="text" value={contactForm.github} onChange={(e) => setContactForm({ ...contactForm, github: e.target.value })} className="w-full px-4 py-2.5 bg-gold/5 border border-gold/20 rounded-lg text-gold focus:outline-none focus:border-gold/50" />
              </div>
              <button onClick={handleSaveContact} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" /> Save Contact Info
              </button>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div className="glass-card p-4">
                <h3 className="font-semibold text-gold mb-4">Data Management</h3>
                <div className="space-y-3">
                  <button onClick={exportData} className="w-full flex items-center gap-3 p-3 bg-gold/5 border border-gold/20 rounded-lg hover:bg-gold/10 transition-colors text-gold">
                    <Download className="w-5 h-5" /> Export Data to JSON
                  </button>
                  <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-3 p-3 bg-gold/5 border border-gold/20 rounded-lg hover:bg-gold/10 transition-colors text-gold">
                    <Upload className="w-5 h-5" /> Import Data from JSON
                  </button>
                  <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileImport} className="hidden" />
                </div>
              </div>

              <div className="glass-card p-4 border-red-500/30">
                <h3 className="font-semibold text-red-400 mb-4">Danger Zone</h3>
                {!showResetConfirm ? (
                  <button onClick={() => setShowResetConfirm(true)} className="w-full flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg hover:bg-red-500/20 transition-colors text-red-400">
                    <RotateCcw className="w-5 h-5" /> Reset to Default Data
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gold-muted text-sm">Are you sure? This will delete all your custom data.</p>
                    <div className="flex gap-3">
                      <button onClick={() => { resetData(); setShowResetConfirm(false); alert('Data reset to defaults!'); }} className="flex-1 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors">
                        Yes, Reset
                      </button>
                      <button onClick={() => setShowResetConfirm(false)} className="flex-1 p-3 bg-gold/5 border border-gold/20 rounded-lg text-gold hover:bg-gold/10 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
