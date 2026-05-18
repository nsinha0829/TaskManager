import React from "react";

export function CongratsOverlay(props: { open: boolean; onClose: () => void }) {
  if (!props.open) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background:
          "radial-gradient(circle at top, rgba(219, 234, 254, 0.95), rgba(15, 23, 42, 0.9))",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 60,
        cursor: "pointer"
      }}
      onClick={props.onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "2rem",
          padding: "2rem 2.5rem",
          boxShadow: "0 24px 60px rgba(15,23,42,0.65)",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: "2.4rem", marginBottom: "0.4rem" }}>Yayyy!!!</div>
        <p style={{ margin: 0, marginBottom: "0.9rem", fontSize: "1rem", color: "#4b5563" }}>
          I'm so proud
        </p>
        <button
          type="button"
          className="primary-button"
          style={{ margin: "0 auto", padding: "0.6rem 1.4rem", fontSize: "0.95rem" }}
          onClick={props.onClose}
        >
          Back to assignments
        </button>
      </div>
    </div>
  );
}
