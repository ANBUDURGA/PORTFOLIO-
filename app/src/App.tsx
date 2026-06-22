import { useState, useEffect } from 'react';
import { ParticleBackground } from '@/components/ParticleBackground';
import { CursorGlow } from '@/components/CursorGlow';
import { Navigation } from '@/components/Navigation';
import { AdminPanel } from '@/components/AdminPanel';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Skills } from '@/sections/Skills';
import { Projects } from '@/sections/Projects';
import { Certifications } from '@/sections/Certifications';
import { Contact } from '@/sections/Contact';
import { Footer } from '@/sections/Footer';
import { usePortfolioData } from '@/hooks/usePortfolioData';
import { Toaster } from '@/components/ui/sonner';

function App() {
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored === 'light' || stored === 'dark') return stored;
      return 'dark';
    }
    return 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  const {
    data,
    isLoaded,
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
  } = usePortfolioData();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-forest flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gold-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest relative">
      {/* Background Effects */}
      <ParticleBackground />
      <CursorGlow />

      {/* Navigation */}
      <Navigation 
        onAdminClick={() => setIsAdminOpen(true)} 
        theme={theme}
        toggleTheme={toggleTheme}
      />

      {/* Main Content */}
      <main className="relative z-10">
        <Hero 
          name={data.profile.name}
          tagline={data.profile.tagline}
          available={data.profile.available}
          photo={data.profile.photo}
          resumeUrl={data.profile.resumeUrl}
        />
        <About 
          about={data.profile.about}
          stats={data.stats}
        />
        <Skills skillCategories={data.skills} />
        <Projects projects={data.projects} />
        <Certifications certifications={data.certifications} />
        <Contact contact={data.contact} />
        <Footer />
      </main>

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        data={data}
        updateProfile={updateProfile}
        updateStats={updateStats}
        updateContact={updateContact}
        addProject={addProject}
        deleteProject={deleteProject}
        addSkill={addSkill}
        deleteSkill={deleteSkill}
        addCertification={addCertification}
        deleteCertification={deleteCertification}
        resetData={resetData}
        exportData={exportData}
        importData={importData}
      />

      <Toaster />
    </div>
  );
}

export default App;
