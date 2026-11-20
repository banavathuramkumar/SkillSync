/**
 * Centralized Site and Brand Configuration
 * All external links, founder credentials, brand assets, and partner communities
 * are managed here for easy updates and single-source-of-truth reliability.
 */

export const siteConfig = {
  name: "SkillSync",
  tagline: "Skills align. Teams thrive.",
  description:
    "SkillSync connects students and developers with teammates for hackathons, coding competitions, Smart India Hackathon, AI/ML challenges, research projects, and startups.",

  // Brand Assets (using official user-provided assets)
  logos: {
    skillsync: "/assets/skillsync-logo.png",
    corporateConnect: "/assets/corporate-connect-logo.jpg",
  },

  // Founder Information (Official Developer & Founder Identity)
  founder: {
    name: "Ramkumar Banavathu",
    title: "Developer & Founder of SkillSync",
    communityRole: "Team Member & Owner of Corporate Connect",
    education: "Computer Science and Engineering student at SRM University AP",
    mission:
      "Connecting talented students and developers, helping them discover opportunities, and building a collaborative community for innovation.",
    photo: "/assets/ramkumar-banavathu.jpg",
    githubUrl: "https://github.com/banavathuramkumar",
    linkedinUrl: "https://www.linkedin.com/in/banavathu-ramkumar/",
    email: "banavathuramkumar@gmail.com",
    roleBadge: "Developer & Founder",
    footerNote: "Direct Founder Office • Verified Profile",
  },

  // Founder and Developers Directory
  developers: [
    {
      name: "Ramkumar Banavathu",
      title: "Developer & Founder of SkillSync",
      communityRole: "Team Member & Owner of Corporate Connect",
      education: "Computer Science and Engineering student at SRM University AP",
      mission:
        "Connecting talented students and developers, helping them discover opportunities, and building a collaborative community for innovation.",
      photo: "/assets/ramkumar-banavathu.jpg",
      githubUrl: "https://github.com/banavathuramkumar",
      linkedinUrl: "https://www.linkedin.com/in/banavathu-ramkumar/",
      email: "banavathuramkumar@gmail.com",
      roleBadge: "Developer & Founder",
      footerNote: "Direct Founder Office • Verified Profile",
    },
    {
      name: "Nishwitha Budigam",
      title: "Team Member & Developer",
      communityRole: "Team Member & Developer",
      education: "Computer Science and Engineering student at SRM University AP",
      mission:
        "Passionate about building impactful software, solving challenging problems, and empowering collaborative builder squads.",
      photo: "/assets/nishwitha-budigam.jpg",
      githubUrl: "https://github.com/budigamnishwitha",
      linkedinUrl: "https://www.linkedin.com/in/budigam-nishwitha/",
      email: "nishwithabudigam04@gmail.com",
      roleBadge: "Team Member & Developer",
      footerNote: "Core Developer • Verified Profile",
    },
  ],

  // Corporate Connect Community
  corporateConnect: {
    name: "Corporate Connect",
    owner: "Ramkumar Banavathu",
    role: "Team Member & Owner",
    tagline: "Never Miss an Opportunity",
    description:
      "Corporate Connect is an active community dedicated to helping students and budding developers stay ahead with curated job openings, internships, premier hackathons, competitions, and career-boosting resources.",
    whatsappChannelUrl: "https://whatsapp.com/channel/0029VbDvlzXBKfi7j5EOYO2r",
  },

  // Production status notice
  productionNotice:
    "SkillSync is a production-ready, full-stack platform. Authentication, metrics, team discovery, and real-time communications operate with persistent MongoDB and Socket.IO infrastructure.",
};

export default siteConfig;
