"use client";

export const Switch = ({ checked, onCheckedChange, onClick, title }) => (
  <button
    onClick={onClick}
    title={title}
    className={`switch ${checked ? "switch-checked" : "switch-unchecked"}`}
  >
    <span className="switch-thumb" />
  </button>
);
