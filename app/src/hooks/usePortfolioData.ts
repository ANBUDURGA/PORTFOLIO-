import { useState, useEffect, useCallback } from 'react';
import type { PortfolioData } from '@/types';
import { defaultPortfolioData } from '@/types';

const STORAGE_KEY = 'portfolio-data-v1';

function sanitizePortfolioData(loaded: any): PortfolioData {
  const result = { ...defaultPortfolioData, ...loaded };
  
  if (result.profile) {
    result.profile = { ...defaultPortfolioData.profile, ...result.profile };
    // Replace "Akishwar" or "ANBUDURGA R" with "ANBU DURGA R"
    if (!result.profile.name || 
        result.profile.name.toLowerCase().includes('akishwar') || 
        result.profile.name === 'ANBUDURGA R') {
      result.profile.name = 'ANBU DURGA R';
    }
  }

  if (result.contact) {
    result.contact = { ...defaultPortfolioData.contact, ...result.contact };
    if (!result.contact.github || result.contact.github.toLowerCase().includes('akishwar')) {
      result.contact.github = 'https://github.com/ANBUDURGA';
    }
    if (!result.contact.linkedin || result.contact.linkedin.toLowerCase().includes('akishwar')) {
      result.contact.linkedin = 'https://www.linkedin.com/in/anbudurga/';
    }
    if (!result.contact.email || result.contact.email.toLowerCase().includes('akishwar')) {
      result.contact.email = 'sastimukntharaj@gmail.com';
    }
  }

  if (Array.isArray(result.projects)) {
    result.projects = result.projects.map((p: any) => {
      const link = p.link || '';
      if (link.toLowerCase().includes('akishwar')) {
        return { ...p, link: 'https://github.com/ANBUDURGA' };
      }
      return p;
    });
  }

  return result as PortfolioData;
}

export function usePortfolioData(adminPassword = '') {
  const [data, setData] = useState<PortfolioData>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return sanitizePortfolioData(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse stored portfolio data:', e);
      }
    }
    return defaultPortfolioData;
  });

  const [isLoaded, setIsLoaded] = useState(() => {
    // If we have data in localStorage, we can show it immediately
    return localStorage.getItem(STORAGE_KEY) !== null;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load data from public JSON file on mount
  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/portfolio-data.json');
        if (response.ok) {
          const result = await response.json();
          const sanitized = sanitizePortfolioData(result);
          setData(sanitized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
        } else {
          throw new Error(`Failed to fetch portfolio-data.json: status ${response.status}`);
        }
      } catch (e) {
        console.error('Failed to load portfolio data from public JSON:', e);
        // Fallback to localStorage on error/timeout
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            setData(sanitizePortfolioData(parsed));
          } catch (err) {
            console.error('Failed to parse stored portfolio data on fallback:', err);
          }
        }
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadData();
  }, []);

  const persistData = useCallback(async (updatedData: PortfolioData) => {
    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const response = await fetch('/api/update-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminPassword,
          data: updatedData,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `HTTP error ${response.status}`);
      }

      setSaveSuccess(true);
      // Update local storage so that next refresh also has it locally
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      
      // Auto clear success message after 5 seconds
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (e: any) {
      console.error('Failed to persist portfolio data:', e);
      const isConflict = e.message?.toLowerCase().includes('conflict') || e.message?.includes('409');
      const errorMessage = isConflict 
        ? 'Conflict: A newer commit exists on GitHub. Please close the panel, refresh the page, and retry your edits.'
        : (e.message || 'Unknown error');
      setSaveError(errorMessage);
      // Revert React state to the cached version in local storage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setData(sanitizePortfolioData(JSON.parse(stored)));
      } else {
        setData(defaultPortfolioData);
      }
    } finally {
      setIsSaving(false);
    }
  }, [adminPassword]);

  const updateProfile = useCallback((profile: Partial<PortfolioData['profile']>) => {
    setData(prev => {
      const next = {
        ...prev,
        profile: { ...prev.profile, ...profile },
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const updateStats = useCallback((stats: Partial<PortfolioData['stats']>) => {
    setData(prev => {
      const next = {
        ...prev,
        stats: { ...prev.stats, ...stats },
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const updateContact = useCallback((contact: Partial<PortfolioData['contact']>) => {
    setData(prev => {
      const next = {
        ...prev,
        contact: { ...prev.contact, ...contact },
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const addProject = useCallback((project: Omit<PortfolioData['projects'][0], 'id'>) => {
    const newProject = {
      ...project,
      id: `p${Date.now()}`,
    };
    setData(prev => {
      const next = {
        ...prev,
        projects: [...prev.projects, newProject],
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const deleteProject = useCallback((id: string) => {
    setData(prev => {
      const next = {
        ...prev,
        projects: prev.projects.filter(p => p.id !== id),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const addSkill = useCallback((categoryId: string, skill: Omit<PortfolioData['skills'][0]['skills'][0], 'id'>) => {
    const newSkill = {
      ...skill,
      id: `s${Date.now()}`,
    };
    setData(prev => {
      const next = {
        ...prev,
        skills: prev.skills.map(cat => 
          cat.id === categoryId 
            ? { ...cat, skills: [...cat.skills, newSkill] }
            : cat
        ),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const deleteSkill = useCallback((categoryId: string, skillId: string) => {
    setData(prev => {
      const next = {
        ...prev,
        skills: prev.skills.map(cat => 
          cat.id === categoryId 
            ? { ...cat, skills: cat.skills.filter(s => s.id !== skillId) }
            : cat
        ),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const addCertification = useCallback((cert: Omit<PortfolioData['certifications'][0], 'id'>) => {
    const newCert = {
      ...cert,
      id: `c${Date.now()}`,
    };
    setData(prev => {
      const next = {
        ...prev,
        certifications: [...prev.certifications, newCert],
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const deleteCertification = useCallback((id: string) => {
    setData(prev => {
      const next = {
        ...prev,
        certifications: prev.certifications.filter(c => c.id !== id),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const updateProject = useCallback((id: string, updatedFields: Partial<PortfolioData['projects'][0]>) => {
    setData(prev => {
      const next = {
        ...prev,
        projects: prev.projects.map(p => p.id === id ? { ...p, ...updatedFields } : p),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const updateSkill = useCallback((categoryId: string, skillId: string, updatedName: string) => {
    setData(prev => {
      const next = {
        ...prev,
        skills: prev.skills.map(cat => 
          cat.id === categoryId 
            ? { 
                ...cat, 
                skills: cat.skills.map(s => s.id === skillId ? { ...s, name: updatedName } : s) 
              }
            : cat
        ),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const updateCertification = useCallback((id: string, updatedFields: Partial<PortfolioData['certifications'][0]>) => {
    setData(prev => {
      const next = {
        ...prev,
        certifications: prev.certifications.map(c => c.id === id ? { ...c, ...updatedFields } : c),
      };
      persistData(next);
      return next;
    });
  }, [persistData]);

  const resetData = useCallback(() => {
    setData(defaultPortfolioData);
    persistData(defaultPortfolioData);
  }, [persistData]);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-data.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback((jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      const sanitized = sanitizePortfolioData(parsed);
      setData(sanitized);
      persistData(sanitized);
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, [persistData]);

  return {
    data,
    isLoaded,
    isSaving,
    saveError,
    saveSuccess,
    updateProfile,
    updateStats,
    updateContact,
    addProject,
    deleteProject,
    updateProject,
    addSkill,
    deleteSkill,
    updateSkill,
    addCertification,
    deleteCertification,
    updateCertification,
    resetData,
    exportData,
    importData,
  };
}
