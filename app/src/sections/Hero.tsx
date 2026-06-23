import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Download, ArrowRight, Zap, GitBranch, Cloud, ShieldCheck } from 'lucide-react';

interface HeroProps {
  name: string;
  tagline: string;
  available?: boolean;
  resumeUrl?: string;
  github?: string;
  linkedin?: string;
  email?: string;
  stat1Number?: string;
  stat1Label?: string;
  stat2Number?: string;
  stat2Label?: string;
  stat3Number?: string;
  stat3Label?: string;
  stat4Number?: string;
  stat4Label?: string;
}

const getResumeDownloadName = (url: string) => {
  if (url.startsWith('data:application/pdf') || url.toLowerCase().includes('.pdf')) {
    return 'ANBU_DURGA_R_Resume.pdf';
  }
  if (url.startsWith('data:application/vnd.openxml') || url.startsWith('data:application/msword') || url.toLowerCase().includes('.docx') || url.toLowerCase().includes('.doc')) {
    return 'ANBU_DURGA_R_Resume.docx';
  }
  return 'ANBU_DURGA_R_Resume.pdf';
};

const roles = [
  'Data Engineer',
  'ETL Pipeline Builder',
  'Big Data Enthusiast',
  'Problem Solver',
];

export function Hero({ 
  name, 
  tagline, 
  resumeUrl,
  github = "https://github.com/ANBUDURGA",
  linkedin = "https://www.linkedin.com/in/anbudurga/",
  email = "sastimukntharaj@gmail.com",
  stat1Number = "10M+",
  stat1Label = "Records Processed Daily",
  stat2Number = "15+",
  stat2Label = "Data Pipelines Built",
  stat3Number = "5+",
  stat3Label = "Cloud Platforms Used",
  stat4Number = "100%",
  stat4Label = "Data Reliability Focus"
}: HeroProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // Typewriter effect
  useEffect(() => {
    const currentRole = roles[currentRoleIndex];
    
    if (isTyping) {
      if (displayedText.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentRole.slice(0, displayedText.length + 1));
        }, 80);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => setIsTyping(false), 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (displayedText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayedText(displayedText.slice(0, -1));
        }, 40);
        return () => clearTimeout(timeout);
      } else {
        setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
        setIsTyping(true);
      }
    }
  }, [displayedText, isTyping, currentRoleIndex]);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);
    return () => clearInterval(interval);
  }, []);

  // Page load animation
  useEffect(() => {
    const timeout = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timeout);
  }, []);

  const scrollToProjects = () => {
    const element = document.getElementById('projects');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center pt-[72px] overflow-hidden">
      {/* Grid Pattern */}
      <div className="absolute inset-0 grid-pattern opacity-50" />
      
      {/* Radial Glow */}
      <div 
        className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-30"
        style={{
          background: 'radial-gradient(circle, var(--hero-glow) 0%, transparent 50%)',
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="flex flex-col items-center justify-center text-center">
          {/* Main Content */}
          <div className="flex flex-col items-center text-center max-w-3xl">
            {/* Availability Badge */}
            <div 
              className={`inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full mb-6 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success" />
              </span>
              <span className="text-sm font-medium text-gold">Available for Opportunities</span>
            </div>

            {/* Name with letter animation */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-semibold text-gold mb-4 tracking-wide whitespace-nowrap">
              {"Hi, I'm ".split('').map((char, i) => (
                <span
                  key={i}
                  className={`inline-block transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${200 + i * 30}ms` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
              {name.split('').map((char, i) => (
                <span
                  key={`name-${i}`}
                  className={`inline-block transition-all duration-500 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  }`}
                  style={{ transitionDelay: `${500 + i * 50}ms` }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h1>

            {/* Typewriter Role */}
            <div 
              className={`h-8 mb-6 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '800ms' }}
            >
              <span className="text-xl sm:text-2xl font-mono text-gold-muted">
                {displayedText}
                <span className={`inline-block w-0.5 h-6 bg-gold ml-1 align-middle ${showCursor ? 'opacity-100' : 'opacity-0'}`} />
              </span>
            </div>

            {/* Tagline */}
            <p 
              className={`text-lg text-gold-muted leading-relaxed max-w-xl mx-auto mb-8 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              {tagline}
            </p>

            {/* CTAs */}
            <div 
              className={`flex flex-wrap justify-center gap-4 mb-8 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1200ms' }}
            >
              <button onClick={scrollToProjects} className="btn-primary flex items-center gap-2 group">
                View My Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {resumeUrl && (
                <a 
                  href={resumeUrl} 
                  download={getResumeDownloadName(resumeUrl)} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn-secondary flex items-center gap-2 no-underline"
                >
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}
            </div>

            {/* Social Links */}
            <div 
              className={`flex items-center justify-center gap-4 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1400ms' }}
            >
              {[
                { icon: Github, href: github, label: 'GitHub' },
                { icon: Linkedin, href: linkedin, label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${email}`, label: 'Email' },
              ].map((social, i) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative p-3 bg-gold/5 border border-gold/20 rounded-xl hover:bg-gold/10 hover:border-gold/40 transition-all"
                  style={{ animationDelay: `${1400 + i * 100}ms` }}
                >
                  <social.icon className="w-5 h-5 text-gold-muted group-hover:text-gold transition-colors" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-forest-light border border-gold/20 rounded text-xs text-gold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {social.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Bar Below the Main Grid */}
        <div className={`mt-16 lg:mt-24 transition-all duration-800 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        style={{ transitionDelay: '1600ms' }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0 p-6 sm:p-8 bg-gold/5 border border-gold/15 rounded-2xl backdrop-blur-sm">
            {/* Stat 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 sm:gap-4 md:px-6 text-center sm:text-left">
              <div className="p-2.5 bg-gold/10 border border-gold/20 rounded-xl text-gold">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-gold leading-tight">{stat1Number}</div>
                <div className="text-xs sm:text-sm text-gold-muted mt-0.5 sm:mt-1">{stat1Label}</div>
              </div>
            </div>
            
            {/* Stat 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 sm:gap-4 md:px-6 text-center sm:text-left border-l-0 md:border-l border-gold/15">
              <div className="p-2.5 bg-gold/10 border border-gold/20 rounded-xl text-gold">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-gold leading-tight">{stat2Number}</div>
                <div className="text-xs sm:text-sm text-gold-muted mt-0.5 sm:mt-1">{stat2Label}</div>
              </div>
            </div>
            
            {/* Stat 3 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 sm:gap-4 md:px-6 text-center sm:text-left border-l-0 md:border-l border-gold/15">
              <div className="p-2.5 bg-gold/10 border border-gold/20 rounded-xl text-gold">
                <Cloud className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-gold leading-tight">{stat3Number}</div>
                <div className="text-xs sm:text-sm text-gold-muted mt-0.5 sm:mt-1">{stat3Label}</div>
              </div>
            </div>
            
            {/* Stat 4 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-3 sm:gap-4 md:px-6 text-center sm:text-left border-l-0 md:border-l border-gold/15">
              <div className="p-2.5 bg-gold/10 border border-gold/20 rounded-xl text-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-gold leading-tight">{stat4Number}</div>
                <div className="text-xs sm:text-sm text-gold-muted mt-0.5 sm:mt-1">{stat4Label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
