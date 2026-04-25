// src/components/WakeupScreen.jsx
export default function WakeupScreen({ elapsed, onRetry }) {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center",
      justifyContent: "center", background: "#0d0f14",
      fontFamily: "'Sora', sans-serif"
    }}>
      <div style={{ textAlign: "center", padding: "2rem" }}>
        {/* Spinner */}
        <div style={{ width: 64, height: 64, margin: "0 auto 1.5rem", position: "relative" }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.08)",
            borderTopColor: "#7c6af7",
            animation: "spin 1.2s linear infinite",
            position: "absolute"
          }} />
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.05)",
            borderBottomColor: "#a78bfa",
            animation: "spin 1.8s linear infinite reverse",
            position: "absolute", top: 8, left: 8
          }} />
          <div style={{
            width: 8, height: 8, background: "#7c6af7", borderRadius: "50%",
            position: "absolute", top: "50%", left: "50%",
            transform: "translate(-50%, -50%)"
          }} />
        </div>

        <p style={{ fontSize: 18, fontWeight: 500, color: "#e8e6f0", margin: "0 0 6px" }}>
          Starting up server
        </p>
        <p style={{ fontSize: 13, color: "rgba(232,230,240,0.45)", margin: "0 0 1.5rem", fontFamily: "monospace" }}>
          free tier · spinning up
        </p>

        {/* Progress bar */}
        <div style={{
          width: 220, height: 3, background: "rgba(255,255,255,0.07)",
          borderRadius: 99, margin: "0 auto 1rem", overflow: "hidden"
        }}>
          <div style={{
            height: "100%",
            background: "linear-gradient(90deg, #7c6af7, #a78bfa)",
            borderRadius: 99,
            animation: "indeterminate 1.8s ease-in-out infinite"
          }} />
        </div>

        {onRetry ? (
          <button onClick={onRetry} style={{
            fontSize: 13, color: "#a78bfa", background: "none",
            border: "0.5px solid rgba(124,106,247,0.3)", borderRadius: 99,
            padding: "6px 16px", cursor: "pointer", fontFamily: "monospace"
          }}>
            retry connection
          </button>
        ) : (
          <p style={{ fontSize: 12, color: "rgba(232,230,240,0.3)", fontFamily: "monospace" }}>
            {elapsed}s elapsed · usually takes 30–60s
          </p>
        )}

        <style>{`
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes indeterminate {
            0% { transform: scaleX(0) translateX(0); transform-origin: left; }
            50% { transform: scaleX(0.6) translateX(80px); transform-origin: left; }
            100% { transform: scaleX(0) translateX(220px); transform-origin: left; }
          }
        `}</style>
      </div>
    </div>
  );
}