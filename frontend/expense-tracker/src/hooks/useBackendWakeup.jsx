import { useState, useEffect } from "react";
import { API_PATHS, BASE_URL } from "../utils/apiPaths";

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
          const res = await fetch(`${BASE_URL}${API_PATHS.PING.PING_BACKEND}`, {
            signal: AbortSignal.timeout(5000),
          });
          if (res.ok && !cancelled) {
            setStatus("ready");
            return;
          }
        } catch {
          // not ready yet
        }

        if (Date.now() - start >= MAX_WAIT_MS) {
          if (!cancelled) setStatus("timeout");
          return;
        }

        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
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