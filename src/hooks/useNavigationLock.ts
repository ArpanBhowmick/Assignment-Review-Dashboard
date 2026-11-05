import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Strict Session Navigation Lock:
 * Locks browser Back and Forward navigation to the currently displayed page.
 * Prevents browser navigation from changing the URL or unmounting the active page,
 * while allowing all in-app navigation (links, buttons, programmatic redirects)
 * to navigate and update the lock target seamlessly.
 */
export function useNavigationLock(): void {
  const location = useLocation();
  const currentPath = location.pathname + location.search + location.hash;
  const lockedPathRef = useRef<string>(currentPath);

  // Keep the lock target updated whenever legitimate in-app navigation occurs
  useEffect(() => {
    lockedPathRef.current = currentPath;

    // Arm the lock entry on the browser history stack if not already armed for this path
    const currentState =
      window.history.state && typeof window.history.state === 'object'
        ? window.history.state
        : {};

    if (currentState.__navLock !== currentPath) {
      try {
        window.history.pushState(
          { ...currentState, __navLock: currentPath },
          '',
          currentPath
        );
      } catch {
        // Ignore pushState errors in constrained environments
      }
    }
  }, [currentPath]);

  // Capture-phase listener for browser popstate (Back/Forward controls)
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      // 1. Block React Router from receiving the popstate event so the active view never unmounts
      event.stopImmediatePropagation();

      // 2. Re-arm the lock entry and preserve the current URL in the address bar
      const targetPath = lockedPathRef.current;
      const currentState =
        window.history.state && typeof window.history.state === 'object'
          ? window.history.state
          : {};

      try {
        window.history.pushState(
          { ...currentState, __navLock: targetPath },
          '',
          targetPath
        );
      } catch {
        // Ignore pushState errors
      }
    };

    // Attach in capture phase so it executes BEFORE React Router's popstate listener
    window.addEventListener('popstate', handlePopState, true);

    return () => {
      window.removeEventListener('popstate', handlePopState, true);
    };
  }, []);
}
