import React, { useEffect, useRef, useState } from "react";
import {
  X,
  Maximize2,
  Minimize2,
  ExternalLink,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Video,
  Radio,
  PhoneOff,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import {
  initializeJitsiMeeting,
  copyMeetingLinkToClipboard,
} from "../../services/api/meetingService";

export const VideoMeetingModal = ({
  isOpen,
  onClose,
  meeting,
  user,
  onMeetingEnded,
}) => {
  const containerRef = useRef(null);
  const jitsiApiRef = useRef(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    if (!isOpen || !meeting?.roomName) {
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          console.warn("Jitsi dispose error:", e);
        }
        jitsiApiRef.current = null;
      }
      return;
    }

    setIsLoading(true);
    setError(null);

    const startJitsi = async () => {
      try {
        // Wait a tick for containerRef to attach to DOM
        await new Promise((r) => setTimeout(r, 100));

        if (!containerRef.current || !isMounted) return;

        // Clear any previous child iframe
        containerRef.current.innerHTML = "";

        const api = await initializeJitsiMeeting({
          parentNode: containerRef.current,
          roomName: meeting.roomName,
          user: user || { name: "SkillSync Developer" },
          onJoined: () => {
            if (isMounted) setIsLoading(false);
          },
          onLeft: () => {
            toast.info("Left video meeting.");
            handleHangup();
          },
          onError: (errMsg) => {
            if (isMounted) {
              setError(errMsg);
              setIsLoading(false);
            }
          },
        });

        if (isMounted) {
          jitsiApiRef.current = api;
          setIsLoading(false);
        } else {
          api.dispose();
        }
      } catch (err) {
        if (isMounted) {
          console.error("Jitsi initialization error:", err);
          setError(
            err.message || "Failed to connect to Jitsi Meet video conference."
          );
          setIsLoading(false);
        }
      }
    };

    startJitsi();

    return () => {
      isMounted = false;
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (e) {
          // ignore
        }
        jitsiApiRef.current = null;
      }
    };
  }, [isOpen, meeting?.roomName]);

  const handleHangup = () => {
    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.executeCommand("hangup");
        jitsiApiRef.current.dispose();
      } catch (e) {
        console.warn("Hangup error:", e);
      }
      jitsiApiRef.current = null;
    }
    if (onMeetingEnded) {
      onMeetingEnded(meeting);
    }
    onClose();
  };

  const handleCopyLink = async () => {
    if (!meeting?.meetingUrl) return;
    const ok = await copyMeetingLinkToClipboard(meeting.meetingUrl);
    if (ok) {
      setCopied(true);
      toast.success("Meeting link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen || !meeting) return null;

  // Minimized Floating Picture-in-Picture Bar (allows chatting while call is live!)
  if (isMinimized) {
    return (
      <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white rounded-2xl p-3 shadow-2xl border border-slate-700 flex items-center gap-3 animate-in slide-in-from-bottom duration-200">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <p className="text-xs font-bold text-white leading-none truncate max-w-[150px]">
              {meeting.title || "Meeting in progress"}
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">Call Active</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 pl-2 border-l border-slate-700">
          <button
            onClick={() => setIsMinimized(false)}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Expand to Full View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          <a
            href={meeting.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-300 hover:text-white transition-colors"
            title="Open in New Tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={handleHangup}
            className="p-1.5 bg-rose-600 hover:bg-rose-700 rounded-lg text-white transition-colors"
            title="Leave Call"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Full Embedded Conference Modal
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-5xl h-[88vh] bg-slate-950 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-800 flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white flex-shrink-0">
          <div className="flex items-center gap-2.5 min-w-0 pr-2">
            <div className="p-1.5 rounded-xl bg-brand-blue/20 text-brand-blue">
              <Video className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  {meeting.title || "Squad Video Meeting"}
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded-full">
                  <Radio className="w-2.5 h-2.5 animate-pulse" />
                  Jitsi Live
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono truncate">
                Room: {meeting.roomName}
              </p>
            </div>
          </div>

          {/* Top Control Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Copy Meeting Link */}
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              title="Copy meeting link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? "Copied" : "Copy Link"}</span>
            </button>

            {/* Open in New Tab */}
            <a
              href={meeting.meetingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors border border-slate-700"
              title="Open meeting in external browser window"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pop Out</span>
            </a>

            {/* Minimize to Float / Continue Chatting */}
            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
              title="Minimize meeting to continue chatting"
            >
              <Minimize2 className="w-4 h-4" />
            </button>

            {/* Leave / Hangup */}
            <button
              onClick={handleHangup}
              className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-rose-950/40"
              title="Leave call"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* Meeting Container Area */}
        <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center">
          {/* Loading Overlay */}
          {isLoading && !error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white space-y-3">
              <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
              <h4 className="text-sm font-bold">Connecting to Jitsi Meet...</h4>
              <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                Loading official WebRTC video & audio media streams. Please allow browser camera and microphone permissions when prompted.
              </p>
            </div>
          )}

          {/* Connection / Permission Error State */}
          {error && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center bg-slate-950 text-white space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div className="space-y-1 max-w-md">
                <h4 className="text-sm font-bold text-white">Connection or Permission Notice</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{error}</p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href={meeting.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-blue hover:bg-brand-blue-dark text-white text-xs font-semibold rounded-xl transition-all shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in External Tab Instead</span>
                </a>

                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          )}

          {/* Actual Jitsi Mount Container Node */}
          <div
            id="jitsi-meet-container"
            ref={containerRef}
            className="w-full h-full bg-slate-950"
          />
        </div>
      </div>
    </div>
  );
};

export default VideoMeetingModal;
