"use client";

import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";

export function TabSessionManager() {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "authenticated") return;

    // Check if this specific tab has been initialized
    const isTabActive = sessionStorage.getItem("tabSessionActive");
    
    if (!isTabActive) {
      // This is a new tab. Before logging out, let's check if there's an active session in another tab.
      const lastActive = localStorage.getItem("lastActiveTabTime");
      
      // If another tab was active within the last 5 seconds, it's just a new tab opened from an existing session
      if (lastActive && Date.now() - parseInt(lastActive) < 5000) {
        sessionStorage.setItem("tabSessionActive", "true");
      } else {
        // No other tab was active recently. The session is stale (they closed their tabs).
        // Time to log out automatically.
        signOut({ redirect: true, callbackUrl: "/" });
      }
    }

    // Ping localStorage every 2 seconds to say "a tab is open and active"
    const ping = setInterval(() => {
      localStorage.setItem("lastActiveTabTime", Date.now().toString());
    }, 2000);

    return () => clearInterval(ping);
  }, [status]);

  return null;
}
