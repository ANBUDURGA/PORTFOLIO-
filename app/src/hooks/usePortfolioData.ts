import { useState, useEffect, useCallback } from 'react';
import type { PortfolioData } from '@/types';
import { defaultPortfolioData } from '@/types';
import { supabase } from '@/lib/supabase';

const STORAGE_KEY = 'portfolio-data-v1';

export function usePortfolioData() {
  const [data, setData] = useState<PortfolioData>(defaultPortfolioData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from Supabase on mount
  useEffect(() => {
    async function loadData() {
      try {
        const { data: result, error } = await supabase
          .from('portfolio_settings')
          .select('data')
          .eq('id', 1)
          .single();
        
        if (!error && result?.data && Object.keys(result.data).length > 0) {
          setData({ ...defaultPortfolioData, ...result.data });
        } else {
          // Fallback to localStorage if Supabase is empty
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const parsed = JSON.parse(stored);
            setData({ ...defaultPortfolioData, ...parsed });
          }
        }
      } catch (e) {
        console.error('Failed to load portfolio data:', e);
      } finally {
        setIsLoaded(true);
      }
    }
    
    loadData();
  }, []);

  // Save changes to Supabase AND localStorage automatically
  useEffect(() => {
    const saveData = async () => {
      if (isLoaded) {
        // Always save locally for fast reloads
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        
        // Save to Supabase (if we are logged in as Admin)
        const { data: sessionData } = await supabase.auth.getSession();
        if (sessionData?.session?.user) {
          await supabase
            .from('portfolio_settings')
            .update({ data: data })
            .eq('id', 1);
        }
      }
    };
    
    // Slight debounce so we don't spam the database
    const timeoutId = setTimeout(() => saveData(), 500);
    return () => clearTimeout(timeoutId);
  }, [data, isLoaded]);

  const updateProfile = useCallback((profile: Partial<PortfolioData['profile']>) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...profile },
    }));
  }, []);

  const updateStats = useCallback((stats: Partial<PortfolioData['stats']>) => {
    setData(prev => ({
      ...prev,
      stats: { ...prev.stats, ...stats },
    }));
  }, []);

  const updateContact = useCallback((contact: Partial<PortfolioData['contact']>) => {
    setData(prev => ({
      ...prev,
      contact: { ...prev.contact, ...contact },
    }));
  }, []);

  const addProject = useCallback((project: Omit<PortfolioData['projects'][0], 'id'>) => {
    const newProject = {
      ...project,
      id: `p${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== id),
    }));
  }, []);

  const addSkill = useCallback((categoryId: string, skill: Omit<PortfolioData['skills'][0]['skills'][0], 'id'>) => {
    const newSkill = {
      ...skill,
      id: `s${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(cat => 
        cat.id === categoryId 
          ? { ...cat, skills: [...cat.skills, newSkill] }
          : cat
      ),
    }));
  }, []);

  const deleteSkill = useCallback((categoryId: string, skillId: string) => {
    setData(prev => ({
      ...prev,
      skills: prev.skills.map(cat => 
        cat.id === categoryId 
          ? { ...cat, skills: cat.skills.filter(s => s.id !== skillId) }
          : cat
      ),
    }));
  }, []);

  const addCertification = useCallback((cert: Omit<PortfolioData['certifications'][0], 'id'>) => {
    const newCert = {
      ...cert,
      id: `c${Date.now()}`,
    };
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, newCert],
    }));
  }, []);

  const deleteCertification = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(c => c.id !== id),
    }));
  }, []);

  const resetData = useCallback(() => {
    setData(defaultPortfolioData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

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
      setData({ ...defaultPortfolioData, ...parsed });
      return true;
    } catch (e) {
      console.error('Failed to import data:', e);
      return false;
    }
  }, []);

  return {
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
  };
}
