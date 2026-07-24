"use client";

import { useEffect, useState } from "react";

/** Avoids hydration mismatches for client-only UI (e.g. theme controls). */
export function useMounted() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
}
