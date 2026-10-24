import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  Trophy,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Compass,
  CheckCircle2,
  ExternalLink,
  Laptop,
  GraduationCap,
  MessageSquare,
  ArrowUp,
} from "lucide-react";
import { SkillSyncLogo } from "../../components/common/SkillSyncLogo";
import { siteConfig } from "../../config/siteConfig";
import { FounderProfile } from "../../components/dashboard/FounderProfile";
import { CorporateConnectCard } from "../../components/dashboard/CorporateConnectCard";
import { statsService } from "../../services/api/statsService";

export const LandingPage = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    teamsCreated: 0,
    openPositions: 0,
    competitionsListed: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    if (e) e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const navOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    let isMounted = true;
    const fetchRealData = async () => {
      try {
        const statsRes = await statsService.getPlatformStats().catch(() => null);
        if (isMounted && statsRes?.stats) {
          setStats(statsRes.stats);
        }
      } catch (err) {
        console.warn("[LandingPage] Failed to fetch real data:", err.message);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchRealData();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <SkillSyncLogo size="md" />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-brand-blue transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              onClick={(e) => scrollToSection(e, "community")}
              className="hover:text-brand-blue transition-colors cursor-pointer"
            >
              Community
            </button>
            <button
              onClick={(e) => scrollToSection(e, "founder")}
              className="hover:text-brand-blue transition-colors cursor-pointer"
            >
              Founder
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-semibold text-slate-700 hover:text-brand-blue px-3 py-2 rounded-xl transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="text-xs sm:text-sm font-semibold text-white bg-brand-blue hover:bg-brand-blue-dark px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 sm:py-24 bg-gradient-to-b from-blue-50/50 via-white to-brand-bg border-b border-brand-border">
        {/* Ambient background glow orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
        <div className="absolute top-1/3 left-1/3 -translate-x-1/2 w-80 h-80 bg-teal-400/10 rounded-full blur-3xl pointer-events-none animate-pulse-glow" style={{ animationDelay: '2s' }} />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center animate-fade-in-up">
          <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-brand-blue text-xs font-semibold mb-6 border border-blue-200 transition-all hover:bg-blue-100">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Hackathons, SIH, AI Challenges & Student Startups</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight mb-8 flex flex-col items-center justify-center gap-4 sm:gap-5 select-none">
            <span className="inline-block bg-slate-950 text-white px-5 py-2 sm:px-8 sm:py-3 rounded-2xl shadow-xl -rotate-2 transform animate-float-slow hover:scale-105 hover:-rotate-1 hover:shadow-2xl transition-all duration-300 ease-out cursor-default">
              Skills align.
            </span>
            <span className="inline-block bg-brand-blue text-white px-5 py-2 sm:px-8 sm:py-3 rounded-2xl shadow-xl shadow-blue-500/25 rotate-2 transform animate-float-reverse hover:scale-105 hover:rotate-1 hover:shadow-blue-500/40 hover:shadow-2xl transition-all duration-300 ease-out cursor-default">
              Teams thrive.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-brand-muted max-w-2xl mx-auto mb-8 leading-relaxed">
            Stop scrambling through disorganized chat groups. SkillSync connects motivated students and developers with complementary skills to build winning hackathon squads.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <Link
              to="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-blue hover:bg-brand-blue-dark text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <span>Find Your Teammates Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl border border-brand-border shadow-subtle hover:scale-[1.03] active:scale-[0.98] transition-all duration-200"
            >
              <span>Explore Platform</span>
            </Link>
          </div>

          {/* Quick Metrics Bar (Real Database Aggregates) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-14 max-w-4xl mx-auto">
            <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle">
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-blue">
                {isLoading ? "..." : stats.totalUsers}
              </p>
              <p className="text-xs text-brand-muted mt-1">Students & Devs</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {isLoading ? "..." : stats.teamsCreated}
              </p>
              <p className="text-xs text-brand-muted mt-1">Teams Formed</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">
                {isLoading ? "..." : stats.openPositions}
              </p>
              <p className="text-xs text-brand-muted mt-1">Open Positions</p>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-brand-border shadow-subtle">
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {isLoading ? "..." : stats.competitionsListed}
              </p>
              <p className="text-xs text-brand-muted mt-1">Verified Contests</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section id="features" className="py-16 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mb-3">
            Why Collegiate Builders Choose SkillSync
          </h2>
          <p className="text-sm text-brand-muted">
            The complete collaboration workflow from initial idea pitch to the final hackathon podium.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center mb-5 border border-blue-200">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-text mb-2">
              Skill & Domain Matching
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Find teammates based on exact technical competencies — AI/ML, backend pipelines, Smart India Hackathon problem statements, or UI/UX Figma design.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-5 border border-emerald-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-text mb-2">
              Verified Student Profiles
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Every applicant provides verified college credentials, GitHub portfolios, LeetCode performance, and downloadable resumes before joining your squad.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-subtle">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-5 border border-purple-200">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-brand-text mb-2">
              Private Authorized Team Rooms
            </h3>
            <p className="text-xs sm:text-sm text-brand-muted leading-relaxed">
              Once an applicant is accepted, instant dedicated team chat unlocks automatically, keeping project discussions focused and secure.
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Connect Section */}
      <section id="community" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CorporateConnectCard />
      </section>

      {/* Founder Profile Section */}
      <section id="founder" className="py-16 bg-slate-50 border-t border-brand-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <span className="text-xs font-bold text-brand-blue uppercase tracking-wider">
              Vision & Leadership
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-text mt-1">
              Meet the Founder
            </h2>
          </div>
          <FounderProfile />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-brand-border py-8 sm:py-10 mt-auto pb-24 sm:pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-5 text-xs text-brand-muted text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <SkillSyncLogo size="sm" />
            <span className="text-slate-500">&copy; {new Date().getFullYear()} SkillSync. All rights reserved.</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-6 text-xs">
            <Link to="/guidelines" className="hover:text-brand-blue transition-colors">
              Community Guidelines
            </Link>
            <Link to="/help" className="hover:text-brand-blue transition-colors">
              Help Center
            </Link>
            <a
              href={siteConfig.corporateConnect.whatsappChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-emerald-600 flex items-center gap-1 font-semibold text-emerald-700 transition-colors"
            >
              <span>Corporate Connect</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </footer>

      {/* Smooth Floating Scroll To Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 p-3 sm:p-3.5 rounded-2xl bg-brand-blue text-white shadow-xl shadow-blue-500/25 hover:bg-brand-blue-dark hover:scale-110 active:scale-95 transition-all duration-300 animate-fade-in cursor-pointer border border-white/20"
        >
          <ArrowUp className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
