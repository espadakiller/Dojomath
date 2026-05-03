"use client";

import { useEffect, useState } from "react";

export default function MouseGlow() {
  const [position, setPosition] = useState({ x: -300, y: -300 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      className="pointer-events-none fixed z-0 hidden h-80 w-80 rounded-full bg-sky-400/10 blur-3xl md:block"
      style={{
        left: position.x - 160,
        top: position.y - 160,
      }}
    />
  );
}