import { useState, useEffect } from "react";
import { API_PATHS } from "../utils/apiPaths";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const MAX_WAIT_MS = 60000;
const POLL_INTERVAL_MS = 3000;
const COLD_START_THRESHOLD_MS = 3000; // if responds within 3s, skip screen

export function useBackendWakeup() {
  const [status, setStatus] = useState("checking"); // "checking" | "waking" | "ready" | "timeout"
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const start = Date.now();

    async function ping() {
      // First ping — fast check
      try {
        const res = await fetch(`${BACKEND_URL}/api/ping`, {
          signal: AbortSignal.timeout(COLD_START_THRESHOLD_MS),
        });
        if (res.ok && !cancelled) {
          setStatus("ready"); // server already up, skip screen
          return;
        }
      } catch {
        // didn't respond quickly — it's a cold start
      }

      if (cancelled) return;
      setStatus("waking"); // now show the wakeup screen

      // Start elapsed timer
      const tick = setInterval(() => {
        if (!cancelled) setElapsed(Math.floor((Date.now() - start) / 1000));
      }, 1000);

      // Keep pinging until alive or timeout
      while (!cancelled) {
        await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

        if (Date.now() - start >= MAX_WAIT_MS) {
          if (!cancelled) setStatus("timeout");
          break;
        }

        try {
          const res = await fetch(API_PATHS.PING.PING_BACKEND, {
            signal: AbortSignal.timeout(5000),
          });
          if (res.ok && !cancelled) {
            setStatus("ready");
            break;
          }
        } catch {
          // still waking
        }
      }

      clearInterval(tick);
    }

    ping();
    return () => { cancelled = true; };
  }, []);

  return { status, elapsed };
}