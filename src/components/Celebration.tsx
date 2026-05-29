import { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

interface CelebrationProps {
  active: boolean;
}

const COLORS = ['#6aaa64', '#c9b458', '#538d4e', '#ffffff', '#ff6b9d', '#4ecdc4'];

function fireBurst(originX: number, angle: number) {
  confetti({
    particleCount: 80,
    spread: 70,
    startVelocity: 45,
    origin: { x: originX, y: 0.35 },
    angle,
    colors: COLORS,
    ticks: 200,
    gravity: 0.9,
    scalar: 1.1,
  });
}

export function Celebration({ active }: CelebrationProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (!active) {
      firedRef.current = false;
      return;
    }
    if (firedRef.current) return;
    firedRef.current = true;

    fireBurst(0.2, 60);
    fireBurst(0.8, 120);

    const interval = window.setInterval(() => {
      confetti({
        particleCount: 3,
        angle: 60 + Math.random() * 60,
        spread: 55,
        origin: { x: Math.random(), y: Math.random() * 0.4 },
        colors: COLORS,
        ticks: 120,
        gravity: 1,
        scalar: 0.9,
        drift: 0.5,
      });
    }, 180);

    const stop = window.setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(stop);
    };
  }, [active]);

  return null;
}
