"use client";

import { useCallback, useEffect, useRef } from "react";
import { cn } from "cn";

/**
 * Particles — komponen background dari React Bits (MIT, source:
 * https://github.com/davidhdev/react-bits — components/Backgrounds/Particles).
 *
 * Canvas particles: titik-titik kecil yang mengambang halus dan bereaksi
 * terhadap mouse. Digunakan sebagai latar halaman auth (login/register).
 *
 * Props:
 * - className, quantity, staticity (jarak reaksi mouse), ease, refresh.
 */

type ParticlesProps = {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
};

function generateParticles(
  quantity: number,
  canvasSize: { w: number; h: number }
): { x: number; y: number; vx: number; vy: number }[] {
  const particles = [];
  for (let i = 0; i < quantity; i++) {
    particles.push({
      x: Math.random() * canvasSize.w,
      y: Math.random() * canvasSize.h,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
    });
  }
  return particles;
}

export function Particles({
  className,
  quantity = 55,
  staticity = 60,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const context = useRef<CanvasRenderingContext2D | null>(null);
  const circles = useRef<{
    x: number;
    y: number;
    originX: number;
    originY: number;
    vx: number;
    vy: number;
  }[]>([]);
  const circleMap = useRef(new Map<number, { x: number; y: number }>());
  const rafId = useRef<number>(0);
  const mouse = useRef({ x: 0, y: 0 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const scaleX = canvasRef.current.width / rect.width;
        const scaleY = canvasRef.current.height / rect.height;
        mouse.current = {
          x: (e.clientX - rect.left) * scaleX,
          y: (e.clientY - rect.top) * scaleY,
        };
      }
    },
    []
  );

  useEffect(() => {
    if (canvasRef.current && canvasContainerRef.current) {
      context.current = canvasRef.current.getContext("2d");
      const canvas = canvasRef.current;
      const container = canvasContainerRef.current;
      let animationFrameId: number;

      const canvasSize = {
        w: container.offsetWidth,
        h: container.offsetHeight,
      };
      canvas.width = canvasSize.w;
      canvas.height = canvasSize.h;

      if (context.current) {
        const g = context.current;
        // arah back: isi canvas dengan warna transparan, tidak ada dampak visual
        circleMap.current = new Map();
        circles.current = generateParticles(quantity, canvasSize).map((p) => ({
          x: p.x,
          y: p.y,
          vx: p.vx,
          vy: p.vy,
          originX: p.x,
          originY: p.y,
        }));
      }
    }

    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    if (!canvas || !container) return;

    const ctx = context.current;
    let t = 0;
    let rafIdLocal = 0;

    const drawCircle = (
      x: number,
      y: number,
      r: number,
      color: string
    ) => {
      if (!ctx) return;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
    };

    const animate = () => {
      if (!ctx || !circles.current.length) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      circles.current.forEach((circle, i) => {
        // animasi gerakan lambat (mengambang)
        circle.x += circle.vx;
        circle.y += circle.vy;

        // pantul di tepi
        if (circle.x < 0 || circle.x > canvas.width) circle.vx *= -1;
        if (circle.y < 0 || circle.y > canvas.height) circle.vy *= -1;

        // reaksi halus terhadap mouse (kesetimbangan elastis)
        const dxMouse = mouse.current.x - circle.x;
        const dyMouse = mouse.current.y - circle.y;
        if (Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse) < staticity) {
          circle.x += dxMouse / ease;
          circle.y += dyMouse / ease;
        } else {
          // tarik kembali ke posisi asal secara perlahan
          circle.x += (circle.originX - circle.x) / 400;
          circle.y += (circle.originY - circle.y) / 400;
        }

        drawCircle(circle.x, circle.y, 1.6, "rgba(0, 138, 92, 0.35)");
      });

      t += 0.01;
      rafIdLocal = requestAnimationFrame(animate);
    };

    rafIdLocal = requestAnimationFrame(animate);
    rafId.current = rafIdLocal;
    window.addEventListener("mousemove", onMouseMove);

    const handleResize = () => {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafIdLocal);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, [quantity, staticity, ease, refresh, onMouseMove]);

  return (
    <div
      ref={canvasContainerRef}
      className={cn("pointer-events-none absolute inset-0", className)}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}