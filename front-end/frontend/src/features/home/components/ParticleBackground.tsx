import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    // =========================
    // Resize Canvas
    // =========================
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      canvas.width = parent?.offsetWidth || window.innerWidth;
      canvas.height = parent?.offsetHeight || window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // =========================
    // Mouse Interaction
    // =========================
    const mouse = {
      x: 0,
      y: 0,
      radius: 120,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    // =========================
    // Particles
    // =========================
    const particles: {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }[] = [];

    const numberOfParticles = 70;

    const createParticle = () => {
      const isBig = Math.random() < 0.3;
      const speedFactor = 0.3 + Math.random() * 2.5; // tốc độ random

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * speedFactor,
        vy: (Math.random() - 0.5) * speedFactor,
        size: isBig ? 4 : 2,
        opacity: isBig ? 1 : 0.6,
      };
    };

    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(createParticle());
    }

    // =========================
    // Animation Loop
    // =========================
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // --------- Draw Lines ---------
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) {
            ctx.beginPath();
            ctx.strokeStyle = "rgba(163,230,53,0.15)";
            ctx.lineWidth = 1;
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      // --------- Draw & Update Particles ---------
      particles.forEach((p, index) => {
        // ===== Mouse Repel =====
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouse.radius) {
            const force = (mouse.radius - distance) / mouse.radius;

            const angle = Math.atan2(dy, dx);

            const pushStrength = 0.6;

            p.vx += Math.cos(angle) * force * pushStrength;
            p.vy += Math.sin(angle) * force * pushStrength;
          }
        }

        // ===== Normal Movement =====
        p.x += p.vx;
        p.y += p.vy;

        // Respawn if out of screen
        if (
          p.x < -20 ||
          p.x > canvas.width + 20 ||
          p.y < -20 ||
          p.y > canvas.height + 20
        ) {
          particles[index] = createParticle();
        }

        // ===== Draw Particle =====
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(163,230,53,${p.opacity})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    // =========================
    // Cleanup
    // =========================
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-0" />
  );
}
