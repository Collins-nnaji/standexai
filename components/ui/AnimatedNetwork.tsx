"use client";

import { useEffect, useRef } from "react";

class Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;

  constructor(width: number, height: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.radius = Math.random() * 2 + 1.5;
  }

  update(width: number, height: number) {
    this.x += this.vx;
    this.y += this.vy;

    if (this.x < 0 || this.x > width) this.vx *= -1;
    if (this.y < 0 || this.y > height) this.vy *= -1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(124, 92, 252, 0.5)";
    ctx.fill();
    
    // Subtle outer glow for nodes
    ctx.shadowBlur = 10;
    ctx.shadowColor = "rgba(124, 92, 252, 0.2)";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class Pulse {
  x: number = 0;
  y: number = 0;
  progress: number = 0;
  speed: number;
  startNode: Node;
  endNode: Node;

  constructor(startNode: Node, endNode: Node) {
    this.startNode = startNode;
    this.endNode = endNode;
    this.speed = 0.005 + Math.random() * 0.01;
  }

  update() {
    this.progress += this.speed;
    if (this.progress > 1) return false;
    this.x = this.startNode.x + (this.endNode.x - this.startNode.x) * this.progress;
    this.y = this.startNode.y + (this.endNode.y - this.startNode.y) * this.progress;
    return true;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = "#7C5CFC";
    ctx.shadowBlur = 8;
    ctx.shadowColor = "#7C5CFC";
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

export function AnimatedNetwork() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    const connectionDistance = 180;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initNodes();
    };

    const initNodes = () => {
      nodes = [];
      pulses = [];
      const numNodes = Math.floor((canvas.width * canvas.height) / 18000);
      for (let i = 0; i < numNodes; i++) {
        nodes.push(new Node(canvas.width, canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Randomly spawn pulses
      if (Math.random() < 0.05 && nodes.length > 2) {
        const startIdx = Math.floor(Math.random() * nodes.length);
        const startNode = nodes[startIdx];
        // Find a nearby node to pulse to
        const targets = nodes.filter((n, idx) => {
          if (idx === startIdx) return false;
          const dx = n.x - startNode.x;
          const dy = n.y - startNode.y;
          return Math.sqrt(dx * dx + dy * dy) < connectionDistance;
        });
        if (targets.length > 0) {
          pulses.push(new Pulse(startNode, targets[Math.floor(Math.random() * targets.length)]));
        }
      }

      // Draw Connections
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].update(canvas.width, canvas.height);
        nodes[i].draw(ctx);

        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < connectionDistance) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            const opacity = 1 - distance / connectionDistance;
            ctx.strokeStyle = `rgba(124, 92, 252, ${opacity * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw Pulses
      pulses = pulses.filter(p => {
        const active = p.update();
        if (active) p.draw(ctx);
        return active;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener("resize", resize);
    resize();
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 opacity-40 shadow-inner"
    />
  );
}
