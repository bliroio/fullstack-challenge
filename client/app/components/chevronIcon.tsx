import React from "react";

type Props = {
  direction: "left" | "right";
  size?: number;
};

const ChevronIcon: React.FC<Props> = ({ direction, size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {direction === "left" ? (
      <polyline points="15 18 9 12 15 6" />
    ) : (
      <polyline points="9 6 15 12 9 18" />
    )}
  </svg>
);

export default ChevronIcon;
