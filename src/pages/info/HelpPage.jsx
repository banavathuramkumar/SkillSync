import React, { useState } from "react";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  ExternalLink,
  ChevronDown,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { siteConfig } from "../../config/siteConfig";
import apiClient from "../../services/api/apiClient";
import { useAuthStore } from "../../store/useAuthStore";

export const HelpPage = () => {
  const { user } = useAuthStore();
  const [openFaq, setOpenFaq] = useState(0);
  const [feedbackCategory, setFeedbackCategory] = useState("Feature Request");
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const faqs = [
    {
      q: "How does team matching work on SkillSync?",
      a: "Team leaders create a squad for a specific competition (e.g. Smart India Hackathon or an AI Challenge) and list the missing technical competencies they require. Prospective teammates can filter by their skill sets, review the project problem statement, and submit a join request with a personalized pitch.",
    },
    {
      q: "Who can see private team chats?",
      a: "Only verified team members and the team leader have access to a team's dedicated chat room. Pending applicants or non-members cannot read or send messages in private team rooms.",
    },
    {
      q: "Why is profile completion mandatory?",
      a: "To ensure fairness, credibility, and avoid ghost teammates. Team leaders need to evaluate verified GitHub profiles, LeetCode performance, and resumes before accepting applicants into high-stakes competitions.",
    },
    {
      q: "What is Corporate Connect and how does it relate to SkillSync?",
      a: "Corporate Connect is a premier opportunities community founded and owned by Ramkumar Banavathu that shares curated job alerts, internships, hackathon deadlines, and career updates directly with university students.",
    },
    {
      q: "Can I leave a team after joining?",
      a: "Yes, members can leave a team anytime from their My Teams page or the Team Details page. If a squad falls below its maximum capacity, recruitment automatically reopens for that role.",
    },
  ];

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      toast.error("Please enter your feedback or query.");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiClient.post("/feedback", {
        name: user?.name || "Student User",
        email: user?.email || "student@skillsync.edu.in",
        category: feedbackCategory,
        subject: `${feedbackCategory}: Inquiry`,
        message: feedbackText.trim(),
      });
      setIsSubmitting(false);
      setFeedbackText("");
      toast.success("Thank you! Your feedback has been received and logged.");
    } catch (err) {
      setIsSubmitting(false);
      toast.error(err.message || "Failed to submit feedback.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-brand-text">Help & Support Center</h2>
        <p className="text-xs sm:text-sm text-brand-muted mt-0.5">
          Everything you need to know about teaming up, competitions, and platform guidelines
        </p>
      </div>

      {/* FAQs */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
          <HelpCircle className="w-5 h-5 text-brand-blue" />
          <h3 className="text-base font-bold text-brand-text">
            Frequently Asked Questions
          </h3>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-brand-border rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? -1 : idx)}
                className="w-full text-left p-4 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-brand-text transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openFaq === idx ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="p-4 bg-white text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-brand-border">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Community Links & Contact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-emerald-900 to-slate-900 text-white rounded-3xl p-6 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
              Community Channel
            </span>
            <h4 className="text-lg font-bold mt-1 text-white">Corporate Connect</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Join our official WhatsApp channel for real-time hackathon announcements, internships, and hiring updates.
            </p>
          </div>

          <a
            href={siteConfig.corporateConnect.whatsappChannelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-all"
          >
            <span>Open WhatsApp Channel</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <div className="bg-white rounded-3xl border border-brand-border p-6 shadow-subtle flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand-blue">
              Direct Contact
            </span>
            <h4 className="text-lg font-bold text-brand-text mt-1">Founder Office</h4>
            <p className="text-xs text-brand-muted mt-2 leading-relaxed">
              Have suggestions or university collaboration requests? Reach out directly to founder Ramkumar Banavathu.
            </p>
          </div>

          <div className="pt-2">
            <a
              href={`mailto:${siteConfig.founder.email}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-brand-blue hover:underline"
            >
              <Mail className="w-4 h-4" />
              <span>{siteConfig.founder.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Feedback Form */}
      <div className="bg-white rounded-3xl border border-brand-border p-6 sm:p-8 shadow-subtle space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-brand-border">
          <MessageSquare className="w-5 h-5 text-brand-blue" />
          <h3 className="text-base font-bold text-brand-text">
            Send Feedback or Bug Report
          </h3>
        </div>

        <form onSubmit={handleFeedbackSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Feedback Category
            </label>
            <select
              value={feedbackCategory}
              onChange={(e) => setFeedbackCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="Feature Request">Feature Request</option>
              <option value="Bug Report">Bug Report</option>
              <option value="Event Suggestion">Suggest a Hackathon / Competition</option>
              <option value="General Query">General Question</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-brand-text mb-1">
              Your Message
            </label>
            <textarea
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us what you'd love to see improved on SkillSync..."
              className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-brand-border rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue/20 resize-none"
              required
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Sending..." : "Submit Feedback"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HelpPage;
