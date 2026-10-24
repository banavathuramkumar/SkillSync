import React from "react";
import { ExternalLink, BellRing, Sparkles, ShieldCheck } from "lucide-react";
import { siteConfig } from "../../config/siteConfig";

export const CorporateConnectCard = () => {
  const { corporateConnect, logos } = siteConfig;

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0c1830] via-[#102347] to-[#0a162b] text-white rounded-3xl p-6 sm:p-7 shadow-card border border-slate-800 flex flex-col justify-between h-full">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 -mb-10 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative z-10 space-y-4">
        {/* Header: Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden border-2 border-amber-400/40 p-1 bg-slate-900/80 shadow-xl">
              <img
                src={logos.corporateConnect}
                alt="Corporate Connect Logo"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 p-1 rounded-full shadow">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">
                {corporateConnect.name}
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified Community
              </span>
            </div>
            <p className="text-xs font-semibold text-amber-300">
              Founder & Owner: {corporateConnect.owner} ({corporateConnect.role})
            </p>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {corporateConnect.description}
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-slate-300 pt-1">
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>Curated Career Alerts</span>
          </span>
          <span className="flex items-center gap-1.5 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700/60 font-medium">
            <BellRing className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span>Hackathons & Internships</span>
          </span>
        </div>
      </div>

      {/* Bottom CTA: Full-width WhatsApp Action */}
      <div className="relative z-10 pt-5 mt-4 border-t border-slate-800/80 text-center">
        <a
          href={corporateConnect.whatsappChannelUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-emerald-950/40 hover:scale-[1.01] active:scale-[0.99] transition-all"
        >
          <svg
            className="w-5 h-5 fill-current flex-shrink-0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.888 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.711 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.48-8.413z" />
          </svg>
          <span>Join Corporate Connect on WhatsApp</span>
          <ExternalLink className="w-4 h-4 text-emerald-200 flex-shrink-0" />
        </a>
        <p className="text-[11px] text-slate-400 mt-2">
          Free community channel • Real-time hiring & contest alerts
        </p>
      </div>
    </div>
  );
};

export default CorporateConnectCard;
