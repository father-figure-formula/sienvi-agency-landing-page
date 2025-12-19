import { useEffect, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const VISITOR_ID_KEY = "sienvi_visitor_id";
const SESSION_ID_KEY = "sienvi_session_id";
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

const getVisitorId = (): string => {
  let visitorId = localStorage.getItem(VISITOR_ID_KEY);
  if (!visitorId) {
    visitorId = generateId();
    localStorage.setItem(VISITOR_ID_KEY, visitorId);
  }
  return visitorId;
};

const getSessionId = (): string => {
  const stored = sessionStorage.getItem(SESSION_ID_KEY);
  const lastActivity = sessionStorage.getItem("sienvi_last_activity");
  
  if (stored && lastActivity) {
    const elapsed = Date.now() - parseInt(lastActivity, 10);
    if (elapsed < SESSION_TIMEOUT) {
      sessionStorage.setItem("sienvi_last_activity", Date.now().toString());
      return stored;
    }
  }
  
  const sessionId = generateId();
  sessionStorage.setItem(SESSION_ID_KEY, sessionId);
  sessionStorage.setItem("sienvi_last_activity", Date.now().toString());
  return sessionId;
};

const detectDevice = () => {
  const ua = navigator.userAgent;
  if (/mobile/i.test(ua)) return "mobile";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  return "desktop";
};

const detectBrowser = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  if (ua.includes("Opera")) return "Opera";
  return "Unknown";
};

const detectOS = () => {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("Android")) return "Android";
  if (ua.includes("iOS") || ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
  return "Unknown";
};

const getUTMParams = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get("utm_source") || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
    utm_term: params.get("utm_term") || null,
    utm_content: params.get("utm_content") || null,
  };
};

export const useAnalytics = () => {
  const location = useLocation();
  const sessionInitialized = useRef(false);
  const currentPageViewId = useRef<string | null>(null);
  const pageStartTime = useRef<number>(Date.now());
  const maxScrollDepth = useRef<number>(0);
  const pageViewCount = useRef<number>(0);

  const visitorId = getVisitorId();
  const sessionId = getSessionId();

  // Initialize session
  const initSession = useCallback(async () => {
    if (sessionInitialized.current) return;
    
    const existingSession = sessionStorage.getItem("sienvi_session_initialized");
    if (existingSession === sessionId) {
      sessionInitialized.current = true;
      return;
    }

    const utmParams = getUTMParams();
    
    try {
      await supabase.from("analytics_sessions").insert({
        visitor_id: visitorId,
        session_id: sessionId,
        device_type: detectDevice(),
        browser: detectBrowser(),
        os: detectOS(),
        screen_width: window.screen.width,
        screen_height: window.screen.height,
        referrer: document.referrer || null,
        ...utmParams,
      });

      sessionStorage.setItem("sienvi_session_initialized", sessionId);
      sessionInitialized.current = true;
    } catch (error) {
      console.error("Failed to init session:", error);
    }
  }, [visitorId, sessionId]);

  // Track page view
  const trackPageView = useCallback(async () => {
    pageStartTime.current = Date.now();
    maxScrollDepth.current = 0;
    pageViewCount.current += 1;

    const loadTime = performance.timing 
      ? performance.timing.loadEventEnd - performance.timing.navigationStart 
      : 0;

    try {
      const { data } = await supabase
        .from("analytics_page_views")
        .insert({
          visitor_id: visitorId,
          session_id: sessionId,
          path: location.pathname,
          title: document.title,
          load_time_ms: loadTime > 0 ? loadTime : null,
        })
        .select("id")
        .single();

      if (data) {
        currentPageViewId.current = data.id;
      }

      // Mark session as not bounce after second page
      if (pageViewCount.current === 2) {
        await supabase
          .from("analytics_sessions")
          .update({ is_bounce: false })
          .eq("session_id", sessionId);
      }
    } catch (error) {
      console.error("Failed to track page view:", error);
    }
  }, [visitorId, sessionId, location.pathname]);

  // Update page view on leave
  const updatePageViewOnLeave = useCallback(async () => {
    if (!currentPageViewId.current) return;

    const timeOnPage = Date.now() - pageStartTime.current;

    try {
      await supabase
        .from("analytics_page_views")
        .update({
          time_on_page_ms: timeOnPage,
          scroll_depth: Math.round(maxScrollDepth.current),
        })
        .eq("id", currentPageViewId.current);
    } catch (error) {
      console.error("Failed to update page view:", error);
    }
  }, []);

  // Track scroll depth
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      maxScrollDepth.current = Math.max(maxScrollDepth.current, scrollPercent);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update session ended_at periodically
  useEffect(() => {
    const updateSession = async () => {
      try {
        await supabase
          .from("analytics_sessions")
          .update({ ended_at: new Date().toISOString() })
          .eq("session_id", sessionId);
      } catch (error) {
        // Silent fail
      }
    };

    const interval = setInterval(updateSession, 30000);
    return () => clearInterval(interval);
  }, [sessionId]);

  // Initialize session on mount
  useEffect(() => {
    initSession();
  }, [initSession]);

  // Track page views on route change
  useEffect(() => {
    // Update previous page view before tracking new one
    if (currentPageViewId.current) {
      updatePageViewOnLeave();
    }
    
    trackPageView();
  }, [location.pathname, trackPageView, updatePageViewOnLeave]);

  // Handle page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentPageViewId.current) {
        const timeOnPage = Date.now() - pageStartTime.current;
        
        // Use sendBeacon for reliable tracking on page leave
        navigator.sendBeacon?.(
          `https://ikazuqhukvtdorscoads.supabase.co/rest/v1/analytics_page_views?id=eq.${currentPageViewId.current}`,
          JSON.stringify({
            time_on_page_ms: timeOnPage,
            scroll_depth: Math.round(maxScrollDepth.current),
          })
        );
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  return {
    visitorId,
    sessionId,
  };
};
