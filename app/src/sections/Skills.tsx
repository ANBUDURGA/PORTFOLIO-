import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import type { SkillCategory } from '@/types';

interface SkillsProps {
  skillCategories: SkillCategory[];
}

export function Skills({ skillCategories }: SkillsProps) {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });

  return (
    <section 
      id="skills" 
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
          <h2 className="section-heading">Skills & Expertise</h2>
          <p className="section-subheading mx-auto">
            A comprehensive toolkit for building scalable data systems and extracting meaningful insights
          </p>
        </div>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.id}
              className={`glass-card-hover p-6 lg:p-8 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${150 * categoryIndex}ms` }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-2xl">
                  {category.icon}
                </div>
                <div>
                  <h3 className="text-xl font-serif font-semibold text-gold">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gold-muted font-mono">
                    {category.skills.length} skills
                  </p>
                </div>
              </div>

              {/* Skills Pills */}
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <span
                    key={skill.id}
                    className={`skill-pill text-gold-muted hover:text-gold transition-all duration-500 ${
                      isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
                    }`}
                    style={{ 
                      transitionDelay: `${300 + categoryIndex * 100 + skillIndex * 50}ms`,
                    }}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Proficiency Note */}
        <div 
          className={`mt-12 text-center transition-all duration-700 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <p className="text-gold-muted text-sm">
            Continuously expanding my skillset through hands-on projects and certifications
          </p>
        </div>
      </div>
    </section>
  );
}
