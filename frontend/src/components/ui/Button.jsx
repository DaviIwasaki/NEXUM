// frontend/src/components/ui/Button.jsx
import React from "react";
import "../../styles/components/ui/button.css"; // CSS separado para estilo reutilizável

export default function Button({ children, onClick, variant = "primary", disabled }) {
  return (
    <button
      className={`btn btn-${variant}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
