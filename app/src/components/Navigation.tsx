import { useState, useEffect } from 'react';
import { Menu, X, Shield, Sun, Moon } from 'lucide-react';

interface NavigationProps {
  onAdminClick: () => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation({ onAdminClick, theme, toggleTheme }: NavigationProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Determine active section
      const sections = navLinks.map(link => link.href.slice(1));
      for (const section of sections.reverse()) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[rgba(10,10,10,0.85)] backdrop-blur-xl border-b border-[rgba(232,186,100,0.1)] shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <a
              href="#"
              className="flex items-center gap-3 group"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 flex items-center justify-center group-hover:border-gold/50 transition-colors">
                <span className="font-serif text-gold font-bold text-lg">AS</span>
              </div>
              <span className="font-serif text-gold font-semibold text-lg hidden sm:block">
                Akishwar
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link.href)}
                  className={`relative text-sm font-medium transition-colors link-underline ${
                    activeSection === link.href.slice(1)
                      ? 'text-gold'
                      : 'text-gold-muted hover:text-gold'
                  }`}
                >
                  {link.label}
                  {activeSection === link.href.slice(1) && (
                    <span className="absolute -bottom-1 left-0 w-full h-px bg-gold" />
                  )}
                </a>
              ))}
            </div>

            {/* Admin Button, Theme Toggle & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleTheme}
                className="flex items-center justify-center p-2.5 text-gold-muted hover:text-gold border border-gold/20 hover:border-gold/40 rounded-full transition-all"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={onAdminClick}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gold-muted hover:text-gold border border-gold/20 hover:border-gold/40 rounded-full transition-all"
              >
                <Shield className="w-4 h-4" />
                Admin
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gold hover:bg-gold/10 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-x-0 top-[72px] z-40 md:hidden transition-all duration-300 ${
          isMobileMenuOpen
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <div className="bg-[rgba(10,10,10,0.95)] backdrop-blur-xl border-b border-gold/10 mx-4 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                  activeSection === link.href.slice(1)
                    ? 'bg-gold/10 text-gold'
                    : 'text-gold-muted hover:bg-gold/5 hover:text-gold'
                }`}
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onAdminClick();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gold-muted hover:bg-gold/5 hover:text-gold transition-colors"
            >
              <Shield className="w-5 h-5" />
              Admin Panel
            </button>

            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                toggleTheme();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium text-gold-muted hover:bg-gold/5 hover:text-gold transition-colors"
            >
              {theme === 'dark' ? (
                <>
                  <Sun className="w-5 h-5" />
                  Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-5 h-5" />
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
