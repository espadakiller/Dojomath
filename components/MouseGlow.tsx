"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: -100, y: -100 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-[9999] hidden h-12 w-12 rounded-full border border-black/20 bg-white/10 md:block"
      style={{
        left: position.x - 24,
        top: position.y - 24,
        backdropFilter: "none",
      }}
    />
  );
}