import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Automatically resets the scroll position to the top of the viewport
 * whenever the route pathname changes.
 */
export const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Reset window scroll
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });

    // Reset document element and body scroll
    if (document.documentElement) {
      document.documentElement.scrollTop = 0;
    }
    if (document.body) {
      document.body.scrollTop = 0;
    }

    // Also reset any scrollable main containers
    const mainContent = document.querySelector("main");
    if (mainContent) {
      mainContent.scrollTop = 0;
    }
  }, [pathname]);

  return null;
};

export default ScrollToTop;
