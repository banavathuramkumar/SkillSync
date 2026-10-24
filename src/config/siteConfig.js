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
    // Configurable social placeholders — updated with official URLs
    githubUrl: "https://github.com/banavathuramkumar",
    linkedinUrl: "https://www.linkedin.com/in/banavathu-ramkumar/",
    email: "banavathuramkumar@gmail.com",
  },

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
