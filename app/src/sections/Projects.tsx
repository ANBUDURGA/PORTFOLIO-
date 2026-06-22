import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { ArrowRight, ExternalLink, X } from 'lucide-react';
import type { Project } from '@/types';

interface ProjectsProps {
  projects: Project[];
}

const typeColors: Record<string, string> = {
  'Data Engineering': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Data Analyst': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Web Dev': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

function ProjectCard({ 
  project, 
  index, 
  isVisible,
  featured = false,
  onClick,
}: { 
  project: Project; 
  index: number; 
  isVisible: boolean;
  featured?: boolean;
  onClick: () => void;
}) {
  if (featured) {
    return (
      <div
        className={`glass-card-hover p-8 lg:p-10 col-span-full cursor-pointer transition-all duration-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
        onClick={onClick}
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Content */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[project.type] || 'bg-gold/20 text-gold border-gold/30'}`}>
                {project.type}
              </span>
              <span className="px-3 py-1 bg-gold/20 text-gold text-xs font-medium rounded-full border border-gold/30">
                ⭐ Featured
              </span>
            </div>
            
            <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-gold mb-4">
              {project.icon} {project.title}
            </h3>
            
            <p className="text-gold-muted leading-relaxed mb-6">
              {project.description}
            </p>

            {/* Tools */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.tools.map((tool) => (
                <span 
                  key={tool}
                  className="px-3 py-1 bg-gold/10 text-gold-muted text-sm rounded-full border border-gold/20"
                >
                  {tool}
                </span>
              ))}
            </div>

            {/* Outcome */}
            <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl mb-6">
              <p className="text-sm text-gold-muted">
                <span className="text-gold font-semibold">Outcome:</span> {project.outcome}
              </p>
            </div>

            <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="btn-primary flex items-center gap-2 group">
              View Details
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-video rounded-2xl bg-gradient-to-br from-forest-light to-forest border border-gold/20 flex items-center justify-center overflow-hidden group">
              <div className="text-8xl opacity-50 group-hover:scale-110 transition-transform duration-500">
                {project.icon}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center gap-2 text-gold-muted text-sm">
                  <ExternalLink className="w-4 h-4" />
                  <span>Click to explore project details</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`glass-card-hover p-6 cursor-pointer transition-all duration-700 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${150 * index}ms` }}
      onClick={onClick}
    >
      {/* Type Badge */}
      <div className="flex items-center justify-between mb-4">
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${typeColors[project.type] || 'bg-gold/20 text-gold border-gold/30'}`}>
          {project.type}
        </span>
      </div>

      {/* Title */}
      <h3 className="text-xl font-serif font-semibold text-gold mb-3">
        {project.icon} {project.title}
      </h3>

      {/* Description */}
      <p className="text-gold-muted text-sm leading-relaxed mb-4 line-clamp-2">
        {project.description}
      </p>

      {/* Tools */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tools.slice(0, 3).map((tool) => (
          <span 
            key={tool}
            className="px-2 py-0.5 bg-gold/10 text-gold-muted text-xs rounded-full border border-gold/20"
          >
            {tool}
          </span>
        ))}
        {project.tools.length > 3 && (
          <span className="px-2 py-0.5 text-gold-muted text-xs">
            +{project.tools.length - 3}
          </span>
        )}
      </div>

      {/* Outcome */}
      <div className="p-3 bg-gold/5 border border-gold/20 rounded-lg mb-4">
        <p className="text-xs text-gold-muted">
          <span className="text-gold font-semibold">Outcome:</span> {project.outcome}
        </p>
      </div>

      {/* Button */}
      <button onClick={(e) => { e.stopPropagation(); onClick(); }} className="w-full py-2.5 border border-gold/30 text-gold text-sm font-medium rounded-lg hover:bg-gold/10 hover:border-gold/50 transition-all flex items-center justify-center gap-2 group">
        View Details
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}

export function Projects({ projects }: ProjectsProps) {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.1 });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featuredProject = projects.find(p => p.featured);
  const otherProjects = projects.filter(p => !p.featured);

  return (
    <section 
      id="projects" 
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
          <h2 className="section-heading">Featured Projects</h2>
          <p className="section-subheading mx-auto">
            Real-world applications demonstrating my expertise in data engineering and analytics
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Featured Project */}
          {featuredProject && (
            <ProjectCard 
              project={featuredProject} 
              index={0} 
              isVisible={isVisible} 
              featured
              onClick={() => setSelectedProject(featuredProject)}
            />
          )}

          {/* Other Projects */}
          {otherProjects.map((project, index) => (
            <ProjectCard 
              key={project.id}
              project={project}
              index={index + 1}
              isVisible={isVisible}
              onClick={() => setSelectedProject(project)}
            />
          ))}
        </div>
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/75 backdrop-blur-sm transition-opacity duration-300"
            onClick={() => setSelectedProject(null)}
          />
          
          {/* Content Container */}
          <div className="relative w-full max-w-2xl bg-[rgba(10,20,15,0.98)] border border-gold/30 rounded-2xl shadow-2xl overflow-hidden p-6 md:p-8 animate-scale-in z-10">
            {/* Close button */}
            <button 
              onClick={() => setSelectedProject(null)} 
              className="absolute right-4 top-4 p-2 text-gold-muted hover:text-gold transition-colors hover:bg-gold/10 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            
            {/* Modal Header */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl md:text-5xl">{selectedProject.icon}</span>
              <div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${typeColors[selectedProject.type] || 'bg-gold/10 text-gold border-gold/20'}`}>
                  {selectedProject.type}
                </span>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-gold mt-2">
                  {selectedProject.title}
                </h3>
              </div>
            </div>
            
            {/* Modal Description */}
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-2">Description</h4>
                <p className="text-gold-muted leading-relaxed">
                  {selectedProject.description}
                </p>
              </div>
              
              {/* Tools */}
              <div>
                <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-2">Tools & Technologies</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tools.map((tool) => (
                    <span 
                      key={tool}
                      className="px-3 py-1 bg-gold/10 text-gold-muted text-sm rounded-full border border-gold/20"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Outcome */}
              <div>
                <h4 className="text-sm font-semibold text-gold uppercase tracking-wider mb-2">Key Outcome</h4>
                <div className="p-4 bg-gold/5 border border-gold/20 rounded-xl">
                  <p className="text-sm text-gold-muted">
                    {selectedProject.outcome}
                  </p>
                </div>
              </div>
              
              {/* Action Button: Visit the Site */}
              {selectedProject.link && (
                <div className="pt-4 flex justify-end gap-4 border-t border-gold/10">
                  <a 
                    href={selectedProject.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary py-3 px-6 flex items-center justify-center gap-2 group text-sm font-medium w-full md:w-auto"
                  >
                    <span>Visit the Site</span>
                    <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
