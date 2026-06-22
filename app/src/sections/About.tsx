import { useScrollAnimation, useCountUp } from '@/hooks/useScrollAnimation';

interface AboutProps {
  about: string;
  stats: {
    projects: number;
    certifications: number;
    yearsLearning: number;
  };
}

function StatCard({ value, label, suffix = '+' }: { value: number; label: string; suffix?: string }) {
  const { ref, count } = useCountUp(value, 2000);

  return (
    <div 
      ref={ref}
      className="glass-card-hover p-6 text-center"
    >
      <div className="text-4xl sm:text-5xl font-serif font-bold text-gold mb-2">
        {count}
        <span className="text-2xl sm:text-3xl animate-scale-in inline-block" style={{ animationDelay: '1.5s' }}>
          {suffix}
        </span>
      </div>
      <div className="text-sm text-gold-muted uppercase tracking-wider">{label}</div>
    </div>
  );
}

export function About({ about, stats }: AboutProps) {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });

  const paragraphs = about.split('\n\n');

  return (
    <section 
      id="about" 
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left - Stats */}
          <div 
            className={`transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
            }`}
          >
            <h2 className="section-heading mb-8">About Me</h2>
            
            <div className="grid grid-cols-3 gap-4">
              <StatCard value={stats.projects} label="Projects" />
              <StatCard value={stats.certifications} label="Certifications" />
              <StatCard value={stats.yearsLearning} label="Years" />
            </div>

            {/* Quote Card */}
            <div 
              className={`mt-8 glass-card p-6 border-l-4 border-l-gold transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <p className="text-gold-muted italic text-lg leading-relaxed">
                "Data is the new oil, but like oil, it's only valuable when refined."
              </p>
              <p className="text-gold text-sm mt-4 font-mono">— Clive Humby</p>
            </div>
          </div>

          {/* Right - Content */}
          <div 
            className={`transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
            }`}
          >
            <div className="space-y-6">
              {paragraphs.map((paragraph, index) => (
                <p 
                  key={index}
                  className={`text-gold-muted leading-relaxed text-lg transition-all duration-600`}
                  style={{ transitionDelay: `${400 + index * 100}ms` }}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Key Highlights */}
            <div 
              className={`mt-8 grid sm:grid-cols-2 gap-4 transition-all duration-700 delay-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {[
                { icon: '⚡', text: 'ETL Pipeline Design' },
                { icon: '📊', text: 'Real-time Analytics' },
                { icon: '☁️', text: 'Cloud Data Infrastructure' },
                { icon: '🔍', text: 'Data Quality & Observability' },
              ].map((item, i) => (
                <div 
                  key={i}
                  className="flex items-center gap-3 p-4 bg-gold/5 border border-gold/10 rounded-xl"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-gold font-medium">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
