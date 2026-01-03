'use client';

import { useState, useEffect } from 'react';

export function useTimezone() {
  //  Start with UTC as a safe default for the server-render
  const [timezone, setTimezone] = useState<string>('UTC');

  useEffect(() => {
    // This only runs on the client (browser) after the page loads
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Update the state once we know the real location
    setTimezone(browserTz);
  }, []); // Empty dependency array ensures this runs only once

  return {
    timezone,
    setTimezone, // Keep this in case you want to allow manual override later
  };
}
