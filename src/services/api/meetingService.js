/**
 * Real Video Calling & Group Meeting Service using official Jitsi Meet External API
 * Reference: https://jitsi.org/jitsi-meet/
 *
 * Provides dynamic Jitsi script injection, unique room generation,
 * API initialization, call lifecycle event management, and backend meeting scheduling API.
 */
import apiClient from "./apiClient";

const JITSI_SCRIPT_URL = "https://meet.jit.si/external_api.js";
const JITSI_DOMAIN = "meet.jit.si";

let jitsiScriptPromise = null;

/**
 * Dynamically loads the official Jitsi Meet External API script
 */
export const loadJitsiScript = () => {
  if (typeof window !== "undefined" && window.JitsiMeetExternalAPI) {
    return Promise.resolve(window.JitsiMeetExternalAPI);
  }

  if (jitsiScriptPromise) {
    return jitsiScriptPromise;
  }

  jitsiScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${JITSI_SCRIPT_URL}"]`);
    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.JitsiMeetExternalAPI));
      existingScript.addEventListener("error", () => reject(new Error("Failed to load Jitsi API script")));
      return;
    }

    const script = document.createElement("script");
    script.src = JITSI_SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        reject(new Error("JitsiMeetExternalAPI not found on window object"));
      }
    };
    script.onerror = () => {
      jitsiScriptPromise = null;
      reject(new Error("Failed to load Jitsi Meet script. Please check your network connection."));
    };
    document.body.appendChild(script);
  });

  return jitsiScriptPromise;
};

/**
 * Generates a clean, unique room name for a team or one-to-one meeting
 */
export const generateMeetingRoomName = (teamName = "Team", callType = "group") => {
  const sanitizedTeam = teamName
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 18);
  const prefix = callType === "group" ? "SquadMeeting" : "DirectCall";
  const uniqueId = Math.random().toString(36).substring(2, 8);
  const timestamp = Date.now().toString(36).slice(-4);
  return `SkillSync-${sanitizedTeam}-${prefix}-${timestamp}${uniqueId}`;
};

/**
 * Returns the public direct Jitsi web link for a meeting room
 */
export const getMeetingUrl = (roomName) => {
  return `https://${JITSI_DOMAIN}/${encodeURIComponent(roomName)}`;
};

/**
 * Initializes and embeds a Jitsi Meet meeting instance inside a container node
 */
export const initializeJitsiMeeting = async ({
  parentNode,
  roomName,
  user,
  onJoined,
  onLeft,
  onError,
}) => {
  const JitsiMeetExternalAPI = await loadJitsiScript();

  if (!parentNode) {
    throw new Error("Parent container node is required to mount Jitsi Meet.");
  }

  const options = {
    roomName,
    parentNode,
    width: "100%",
    height: "100%",
    userInfo: {
      displayName: user?.name || "SkillSync Member",
      email: user?.email || "member@skillsync.io",
    },
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      prejoinPageEnabled: false,
      disableDeepLinking: true,
      enableWelcomePage: false,
      enableClosePage: false,
      defaultRemoteDisplayName: "Teammate",
      toolbarButtons: [
        "camera",
        "chat",
        "closedcaptions",
        "desktop",
        "filmstrip",
        "fullscreen",
        "hangup",
        "microphone",
        "participants-pane",
        "raisehand",
        "select-background",
        "settings",
        "tileview",
        "toggle-camera",
        "videoquality",
      ],
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
      TOOLBAR_ALWAYS_VISIBLE: true,
      DISABLE_JOIN_LEAVE_NOTIFICATIONS: false,
    },
  };

  const api = new JitsiMeetExternalAPI(JITSI_DOMAIN, options);

  if (onJoined) {
    api.addEventListener("videoConferenceJoined", (event) => {
      onJoined(event);
    });
  }

  if (onLeft) {
    api.addEventListener("videoConferenceLeft", (event) => {
      onLeft(event);
    });
    api.addEventListener("readyToClose", () => {
      onLeft();
    });
  }

  if (onError) {
    api.addEventListener("cameraError", (err) => onError("Camera error: " + (err.message || "Permission denied")));
    api.addEventListener("micError", (err) => onError("Microphone error: " + (err.message || "Permission denied")));
  }

  return api;
};

/**
 * Copies a meeting URL to user's clipboard
 */
export const copyMeetingLinkToClipboard = async (url) => {
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(url);
    return true;
  }
  const textArea = document.createElement("textarea");
  textArea.value = url;
  textArea.style.position = "fixed";
  textArea.style.left = "-999999px";
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  const successful = document.execCommand("copy");
  document.body.removeChild(textArea);
  return successful;
};

/**
 * Backend API Client Methods for Persistent Meetings
 */
export const meetingService = {
  createInstantMeeting: async (teamId, title, callType = "group") => {
    return await apiClient.post("/meetings/instant", { teamId, title, callType });
  },

  scheduleMeeting: async (meetingData) => {
    return await apiClient.post("/meetings/schedule", meetingData);
  },

  getTeamMeetings: async (teamId) => {
    return await apiClient.get(`/meetings/team/${teamId}`);
  },

  cancelMeeting: async (meetingId, reason) => {
    return await apiClient.put(`/meetings/${meetingId}/cancel`, { reason });
  },
};

export default meetingService;
