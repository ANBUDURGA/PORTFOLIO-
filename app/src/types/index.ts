export interface Project {
  id: string;
  title: string;
  description: string;
  type: string;
  tools: string[];
  outcome: string;
  featured?: boolean;
  icon: string;
  link?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  icon: string;
  skills: Skill[];
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  endDate?: string;
}

export interface ContactInfo {
  email: string;
  linkedin: string;
  github: string;
}

export interface Profile {
  name: string;
  title: string;
  tagline: string;
  about: string;
  resumeUrl: string;
  available: boolean;
}

export interface PortfolioData {
  profile: Profile;
  stats: {
    projects: number;
    certifications: number;
    yearsLearning: number;
  };
  skills: SkillCategory[];
  projects: Project[];
  certifications: Certification[];
  contact: ContactInfo;
}

export const defaultPortfolioData: PortfolioData = {
  profile: {
    name: "ANBU DURGA R",
    title: "Data Engineer",
    tagline: "Building scalable data pipelines & real-time systems that turn raw data into business intelligence.",
    about: "I'm a final-year B.Tech student in Artificial Intelligence & Data Science, transitioning into Data Engineering — a field I chose for its long-term career stability, depth, and the critical role it plays in every data-driven organization.\n\nI'm deeply passionate about building scalable ETL pipelines, real-time data systems, and cloud data infrastructure that transforms raw, chaotic data into reliable business intelligence.\n\nMy approach is engineering-first: I think about fault tolerance, schema evolution, data quality, and pipeline observability — not just making data 'work', but making it production-ready.\n\nI thrive on continuous learning and am actively pursuing MAANG-level Data Engineer roles where I can build systems that scale to millions of records in real time.",
    resumeUrl: "",
    available: true,
  },
  stats: {
    projects: 5,
    certifications: 10,
    yearsLearning: 2,
  },
  skills: [
    {
      id: "1",
      name: "Data Engineering",
      icon: "🗄️",
      skills: [
        { id: "s1", name: "SQL", category: "Data Engineering" },
        { id: "s2", name: "ETL Pipelines", category: "Data Engineering" },
        { id: "s3", name: "Apache Spark", category: "Data Engineering" },
        { id: "s4", name: "Data Warehousing", category: "Data Engineering" },
        { id: "s5", name: "AWS (S3/EC2)", category: "Data Engineering" },
        { id: "s6", name: "Pipeline Design", category: "Data Engineering" },
      ],
    },
    {
      id: "2",
      name: "Data Analysis",
      icon: "📊",
      skills: [
        { id: "s7", name: "Python (Pandas, NumPy)", category: "Data Analysis" },
        { id: "s8", name: "Power BI", category: "Data Analysis" },
        { id: "s9", name: "Tableau", category: "Data Analysis" },
        { id: "s10", name: "Data Cleaning", category: "Data Analysis" },
        { id: "s11", name: "Visualization", category: "Data Analysis" },
      ],
    },
    {
      id: "3",
      name: "Web Development",
      icon: "🌐",
      skills: [
        { id: "s12", name: "HTML", category: "Web Development" },
        { id: "s13", name: "CSS", category: "Web Development" },
        { id: "s14", name: "JavaScript", category: "Web Development" },
      ],
    },
    {
      id: "4",
      name: "Tools & Automation",
      icon: "🤖",
      skills: [
        { id: "s15", name: "Python Scripting", category: "Tools & Automation" },
        { id: "s16", name: "Git & GitHub", category: "Tools & Automation" },
      ],
    },
  ],
  projects: [
    {
      id: "p1",
      title: "Real-Time Ride Analytics Lakehouse",
      description: "Built a scalable data lakehouse architecture for processing and analyzing ride-sharing data in real-time, enabling sub-second analytics on millions of events.",
      type: "Data Engineering",
      tools: ["Kafka", "Spark", "AWS S3"],
      outcome: "Sub-second data latency for 1M+ ride events",
      featured: true,
      icon: "🚗",
      link: "https://github.com/ANBUDURGA",
    },
    {
      id: "p2",
      title: "Sales Insights Dashboard",
      description: "Created an interactive Power BI dashboard that surfaced hidden sales patterns and trends, enabling data-driven decision making for the sales team.",
      type: "Data Analyst",
      tools: ["Power BI", "SQL", "Python"],
      outcome: "Surfaced hidden sales patterns → improved decisions",
      featured: false,
      icon: "🛒",
      link: "https://github.com/ANBUDURGA",
    },
    {
      id: "p3",
      title: "Interactive Data Viz Web App",
      description: "Developed a browser-based data visualization application for real-time data storytelling and interactive exploration of complex datasets.",
      type: "Web Dev",
      tools: ["HTML", "CSS", "JavaScript"],
      outcome: "Real-time browser-based data storytelling",
      featured: false,
      icon: "📊",
      link: "https://github.com/ANBUDURGA",
    },
    {
      id: "p4",
      title: "Demand Forecasting Pipeline",
      description: "Implemented an end-to-end ETL pipeline for predicting product demand curves, helping reduce stockouts and optimize inventory management.",
      type: "Data Engineering",
      tools: ["Python", "SQL", "ETL"],
      outcome: "Reduced stockouts by predicting demand curves",
      featured: false,
      icon: "📦",
      link: "https://github.com/ANBUDURGA",
    },
    {
      id: "p5",
      title: "IoT Stream Anomaly Detection System",
      description: "Built a real-time anomaly detection system using Spark Streaming to identify unusual patterns in IoT sensor data and trigger alerts.",
      type: "Data Engineering",
      tools: ["Spark Streaming", "Python"],
      outcome: "30% reduction in unplanned system downtime",
      featured: false,
      icon: "🔌",
      link: "https://github.com/ANBUDURGA",
    },
  ],
  certifications: [
    { id: "c1", name: "Data Analytics Internship", issuer: "Acmegrade", date: "Mar 2024", endDate: "May 2024" },
    { id: "c2", name: "Advanced SQL", issuer: "Great Learning", date: "Aug 2024" },
    { id: "c3", name: "Data Analytics Internship", issuer: "SkillCraft Technology", date: "Mar 2025", endDate: "Apr 2025" },
    { id: "c4", name: "Cloud Data Engineer Internship", issuer: "Cognifyz", date: "Feb 2025", endDate: "Mar 2025" },
    { id: "c5", name: "Python Fundamentals", issuer: "CodeIntern", date: "Jul 2025" },
    { id: "c6", name: "IBM Data Science Certification", issuer: "IBM", date: "Jan 2026" },
    { id: "c7", name: "Microsoft Power BI Data Analyst", issuer: "Microsoft", date: "Feb 2026" },
    { id: "c8", name: "Data Engineer Professional Certificate", issuer: "IBM", date: "Feb 2026" },
    { id: "c9", name: "Big Data Analytics", issuer: "Great Learning", date: "Feb 2026" },
    { id: "c10", name: "Python Programming", issuer: "Reliance Foundation", date: "Apr 2026" },
  ],
  contact: {
    email: "sastimukntharaj@gmail.com",
    linkedin: "https://www.linkedin.com/in/anbudurga/",
    github: "https://github.com/ANBUDURGA",
  },
};
