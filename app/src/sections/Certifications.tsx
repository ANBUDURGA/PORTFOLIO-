import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Award, Calendar } from 'lucide-react';
import type { Certification } from '@/types';

interface CertificationsProps {
  certifications: Certification[];
}

export function Certifications({ certifications }: CertificationsProps) {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      id="certifications" 
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div 
          className={`text-center mb-16 transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="section-heading">Certifications</h2>
          <p className="section-subheading mx-auto">
            Continuous learning and professional development through industry-recognized certifications
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {certifications.map((cert, index) => (
            <div
              key={cert.id}
              className={`group glass-card-hover p-5 relative overflow-hidden transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${100 * index}ms` }}
            >
              {/* Shimmer Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-gold/10 to-transparent" />

              {/* Content */}
              <div className="relative">
                {/* Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-gold" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gold leading-tight mb-1">
                      {cert.name}
                    </h3>
                    <p className="text-sm text-gold-muted">{cert.issuer}</p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-2 text-xs text-gold-muted">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    {cert.date}
                    {cert.endDate && ` - ${cert.endDate}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div 
          className={`mt-12 flex flex-wrap justify-center gap-8 transition-all duration-700 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-gold">{certifications.length}+</div>
            <div className="text-sm text-gold-muted">Total Certifications</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-gold">5+</div>
            <div className="text-sm text-gold-muted">Different Providers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-serif font-bold text-gold">2</div>
            <div className="text-sm text-gold-muted">Internships Completed</div>
          </div>
        </div>
      </div>
    </section>
  );
}
