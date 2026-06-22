import { useState } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Mail, Linkedin, Github, Send, CheckCircle } from 'lucide-react';
import type { ContactInfo } from '@/types';

interface ContactProps {
  contact: ContactInfo;
}

export function Contact({ contact }: ContactProps) {
  const { ref: sectionRef, isVisible } = useScrollAnimation({ threshold: 0.2 });
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactItems = [
    { icon: Mail, label: 'Email', value: contact.email, href: `mailto:${contact.email}` },
    { icon: Linkedin, label: 'LinkedIn', value: 'Connect on LinkedIn', href: contact.linkedin },
    { icon: Github, label: 'GitHub', value: 'github.com/akishwar', href: contact.github },
  ];

  return (
    <section 
      id="contact" 
      ref={sectionRef}
      className="relative py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className={`glass-card p-8 lg:p-12 glow-border transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Left - CTA */}
            <div>
              <h2 className="section-heading mb-4">
                Let's build something<br />great together
              </h2>
              <p className="text-gold-muted text-lg leading-relaxed mb-8">
                I'm actively looking for Data Engineering internships and full-time opportunities. 
                Whether you have a role in mind or just want to connect, I'd love to hear from you.
              </p>

              {/* Contact Info */}
              <div className="space-y-4">
                {contactItems.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className={`flex items-center gap-4 p-4 bg-gold/5 border border-gold/10 rounded-xl hover:bg-gold/10 hover:border-gold/30 transition-all duration-500 group ${
                      isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'
                    }`}
                    style={{ transitionDelay: `${200 + index * 100}ms` }}
                  >
                    <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                      <item.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <p className="text-xs text-gold-muted uppercase tracking-wider">{item.label}</p>
                      <p className="text-gold font-medium">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <div>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedField === 'name' || formData.name
                        ? '-top-2.5 text-xs bg-forest px-2 text-gold'
                        : 'top-3.5 text-gold-muted'
                    }`}
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    onFocus={() => setFocusedField('name')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3.5 bg-gold/5 border border-gold/20 rounded-xl text-gold placeholder-transparent focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                    required
                  />
                </div>

                {/* Email Field */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedField === 'email' || formData.email
                        ? '-top-2.5 text-xs bg-forest px-2 text-gold'
                        : 'top-3.5 text-gold-muted'
                    }`}
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className="w-full px-4 py-3.5 bg-gold/5 border border-gold/20 rounded-xl text-gold placeholder-transparent focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all"
                    required
                  />
                </div>

                {/* Message Field */}
                <div className="relative">
                  <label 
                    className={`absolute left-4 transition-all duration-200 pointer-events-none ${
                      focusedField === 'message' || formData.message
                        ? '-top-2.5 text-xs bg-forest px-2 text-gold'
                        : 'top-3.5 text-gold-muted'
                    }`}
                  >
                    Your Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    onFocus={() => setFocusedField('message')}
                    onBlur={() => setFocusedField(null)}
                    rows={5}
                    className="w-full px-4 py-3.5 bg-gold/5 border border-gold/20 rounded-xl text-gold placeholder-transparent focus:outline-none focus:border-gold/50 focus:ring-2 focus:ring-gold/10 transition-all resize-none"
                    required
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-70 ${
                    isSubmitted ? 'bg-success text-forest' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-forest/30 border-t-forest rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
