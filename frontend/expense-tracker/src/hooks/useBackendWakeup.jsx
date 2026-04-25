import { useState, useEffect } from "react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAX_WAIT_MS = 60000;
const POLL_INTERVAL_MS = 3000;

export function useBackendWakeup() {
  const [status, setStatus] = useState("waking");
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();

    const tick = setInterval(() => {
      if (!cancelled) setElapsed(Math.floor((Date.now() - start) / 1000));
    }, 1000);

    async function ping() {
      while (!cancelled) {
        try {
          const res = await fetch(`${BACKEND_URL}/api/ping`, { signal: AbortSignal.timeout(5000) });
          if (res.ok) {
            if (!cancelled) setStatus("ready");
            break;
          }
        } catch {
            //server not ready yet.
        }

        if (Date.now() - start >= MAX_WAIT_MS) {
          if (!cancelled) setStatus("timeout");
          break;
        }
        await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
      }
    }

    ping();
    return () => {
      cancelled = true;
      clearInterval(tick);
    };
  }, []);

  return { status, elapsed };
}