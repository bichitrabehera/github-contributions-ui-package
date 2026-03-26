"use client";

import React, { useState } from "react";

type YearPillProps = { label: string; active: boolean; onClick: () => void };

export function YearPill({ label, active, onClick }: YearPillProps) {
  const [hovered, setHovered] = useState(false);

  const baseStyle: React.CSSProperties = {
    padding: "2px 10px",
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 9999,
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.15s ease, color 0.15s ease",
    userSelect: "none",
    outline: "none",
    backgroundColor: active ? "#ffffff" : hovered ? "#3f3f46" : "#262626",
    color: active ? "#000000" : "#ffffff",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      style={baseStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label}
    </button>
  );
}
