import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Download, ArrowRight } from 'lucide-react';
import { useMouseParallax } from '@/hooks/useScrollAnimation';

interface HeroProps {
  name: string;
  tagline: string;
  available: boolean;
  photo?: string;
  resumeUrl?: string;
}

const roles = [
  'Data Engineer',
  'ETL Pipeline Builder',
  'Big Data Enthusiast',
  'Problem Solver',
];

export function Hero({ name, tagline, photo, resumeUrl }: HeroProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursor, setShowCursor] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const parallax = useMouseParallax(5);

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
        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="order-2 lg:order-1">
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-gold mb-4">
              {'Hi, I\'m '.split('').map((char, i) => (
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
              className={`text-lg text-gold-muted leading-relaxed max-w-xl mb-8 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1000ms' }}
            >
              {tagline}
            </p>

            {/* CTAs */}
            <div 
              className={`flex flex-wrap gap-4 mb-8 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1200ms' }}
            >
              <button onClick={scrollToProjects} className="btn-primary flex items-center gap-2 group">
                View My Work
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              {resumeUrl && (
                <a href={resumeUrl} download="Resume" target="_blank" rel="noopener noreferrer" className="btn-secondary flex items-center gap-2 no-underline">
                  <Download className="w-4 h-4" />
                  Download Resume
                </a>
              )}
            </div>

            {/* Social Links */}
            <div 
              className={`flex items-center gap-4 transition-all duration-600 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: '1400ms' }}
            >
              {[
                { icon: Github, href: 'https://github.com/akishwar', label: 'GitHub' },
                { icon: Linkedin, href: 'https://linkedin.com/in/akishwar', label: 'LinkedIn' },
                { icon: Mail, href: 'mailto:sastimukntharaj@gmail.com', label: 'Email' },
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

          {/* Right Content - Profile Photo */}
          <div 
            className={`order-1 lg:order-2 flex justify-center transition-all duration-800 ${
              isLoaded ? 'opacity-100 translate-y-0 rotate-0' : 'opacity-0 translate-y-8 -rotate-3'
            }`}
            style={{ 
              transitionDelay: '400ms',
              transform: `perspective(1000px) rotateX(${-parallax.y}deg) rotateY(${parallax.x}deg)`,
            }}
          >
            <div className="relative">
              {/* Rotating Gradient Ring */}
              <div className="absolute inset-0 animate-rotate-slow">
                <div 
                  className="w-72 h-72 sm:w-96 sm:h-96 rounded-full"
                  style={{
                    background: 'conic-gradient(from 0deg, transparent, var(--hero-ring), transparent, var(--hero-ring), transparent)',
                    filter: 'blur(2px)',
                  }}
                />
              </div>

              {/* Glow Behind */}
              <div 
                className="absolute inset-0 w-72 h-72 sm:w-96 sm:h-96 rounded-full blur-3xl opacity-30"
                style={{
                  background: 'radial-gradient(circle, var(--hero-blob) 0%, transparent 70%)',
                }}
              />

              {/* Photo Container */}
              <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-forest-light to-forest border-2 border-gold/30 flex items-center justify-center overflow-hidden group cursor-default">
                {photo ? (
                  <img src={photo} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                ) : (
                  <div className="text-center group-hover:scale-110 transition-transform duration-500">
                    <span className="font-serif text-6xl sm:text-7xl font-bold text-gold/80">
                      {name.split(' ').map(n => n[0]).join('')}
                    </span>
                    <p className="text-gold-muted text-sm mt-2">Data Engineer</p>
                  </div>
                )}
              </div>

              {/* Floating Badges */}
              <div 
                className="absolute -top-2 -right-2 sm:top-0 sm:right-0 animate-float"
                style={{ animationDelay: '0s' }}
              >
                <div className="px-3 py-1.5 bg-forest-light border border-gold/30 rounded-full shadow-lg">
                  <span className="text-sm font-semibold text-gold">5 Projects</span>
                </div>
              </div>

              <div 
                className="absolute -bottom-2 -left-2 sm:bottom-4 sm:left-0 animate-float"
                style={{ animationDelay: '1s' }}
              >
                <div className="px-3 py-1.5 bg-forest-light border border-gold/30 rounded-full shadow-lg">
                  <span className="text-sm font-semibold text-gold">10+ Certs</span>
                </div>
              </div>

              <div 
                className="absolute top-1/2 -right-8 sm:-right-12 animate-float"
                style={{ animationDelay: '0.5s' }}
              >
                <div className="px-3 py-1.5 bg-gold/20 border border-gold/40 rounded-full shadow-lg flex items-center gap-1.5">
                  <span className="text-sm">🔥</span>
                  <span className="text-sm font-semibold text-gold">Open to Work</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
