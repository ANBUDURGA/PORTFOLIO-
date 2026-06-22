import { ArrowUp, Heart } from 'lucide-react';

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative py-12 border-t border-gold/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <div className="text-center sm:text-left">
            <p className="text-gold-muted text-sm">
              © {new Date().getFullYear()} ANBU DURGA R. All rights reserved.
            </p>
            <p className="text-gold-muted/60 text-xs mt-1 flex items-center justify-center sm:justify-start gap-1">
              Built with <Heart className="w-3 h-3 text-gold fill-gold" /> for Data Engineering
            </p>
          </div>

          {/* Back to Top */}
          <button
            onClick={scrollToTop}
            className="group flex items-center gap-2 px-4 py-2 bg-gold/5 border border-gold/20 rounded-full hover:bg-gold/10 hover:border-gold/40 transition-all"
          >
            <span className="text-sm text-gold-muted group-hover:text-gold transition-colors">
              Back to Top
            </span>
            <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
              <ArrowUp className="w-3.5 h-3.5 text-gold group-hover:-translate-y-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
