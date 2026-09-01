"use client";

import * as React from "react";
import * as THREE from "three";
import { useTheme } from "next-themes";
import { prefersReducedMotion } from "@/lib/gsap";

const CARD_COUNT = 14;
const PARTICLE_COUNT = 600;

/** Brand colours per theme, kept in step with the CSS tokens. */
const PALETTE = {
  dark: { a: 0x8b5cf6, b: 0x22d3ee, c: 0xd946ef, particle: 0x9ca3ff },
  light: { a: 0x7c3aed, b: 0x0ea5e9, c: 0xc026d3, particle: 0x8b5cf6 },
} as const;

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Ambient background: a drift of translucent "document" cards over a slow
 * particle field, with the camera easing toward the pointer.
 *
 * Everything created here is tracked and disposed on unmount, and the render
 * loop is suspended whenever the tab is hidden or the canvas scrolls out of
 * view so the scene costs nothing when it is not visible.
 */
export function HeroScene({ className }: { className?: string }) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [enabled, setEnabled] = React.useState(false);

  React.useEffect(() => {
    setEnabled(!prefersReducedMotion() && supportsWebGL());
  }, []);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container || !enabled) return;

    const palette = resolvedTheme === "light" ? PALETTE.light : PALETTE.dark;
    const isLight = resolvedTheme === "light";

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Capping DPR keeps fill-rate sane on high-density displays.
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Track disposables so cleanup cannot silently miss one.
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];

    // --- Floating document cards -------------------------------------------
    const cardGeometry = new THREE.PlaneGeometry(1.6, 2.2, 1, 1);
    geometries.push(cardGeometry);

    const cards: THREE.Mesh[] = [];
    const cardColors = [palette.a, palette.b, palette.c];

    for (let i = 0; i < CARD_COUNT; i++) {
      const material = new THREE.MeshBasicMaterial({
        color: cardColors[i % cardColors.length],
        transparent: true,
        opacity: isLight ? 0.14 : 0.2,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      materials.push(material);

      const mesh = new THREE.Mesh(cardGeometry, material);
      const radius = 5 + Math.random() * 6;
      const angle = (i / CARD_COUNT) * Math.PI * 2 + Math.random() * 0.6;

      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8 - 2
      );
      mesh.rotation.set(
        (Math.random() - 0.5) * 0.8,
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.5
      );
      const scale = 0.5 + Math.random() * 0.8;
      mesh.scale.setScalar(scale);

      // Per-card drift parameters, read back in the animation loop.
      mesh.userData = {
        floatSpeed: 0.15 + Math.random() * 0.25,
        floatOffset: Math.random() * Math.PI * 2,
        spinSpeed: (Math.random() - 0.5) * 0.12,
        baseY: mesh.position.y,
      };

      scene.add(mesh);
      cards.push(mesh);
    }

    // --- Particle field -----------------------------------------------------
    const particleGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 34;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 18 - 4;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometries.push(particleGeometry);

    const particleMaterial = new THREE.PointsMaterial({
      color: palette.particle,
      size: 0.055,
      transparent: true,
      opacity: isLight ? 0.5 : 0.7,
      sizeAttenuation: true,
      depthWrite: false,
    });
    materials.push(particleMaterial);

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // --- Interaction --------------------------------------------------------
    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };

    const onPointerMove = (event: PointerEvent) => {
      target.x = (event.clientX / window.innerWidth - 0.5) * 2;
      target.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    // --- Render loop --------------------------------------------------------
    const clock = new THREE.Clock();
    let frameId = 0;
    let visible = true;
    let onScreen = true;

    const renderFrame = () => {
      const elapsed = clock.getElapsedTime();

      pointer.x += (target.x - pointer.x) * 0.05;
      pointer.y += (target.y - pointer.y) * 0.05;

      for (const card of cards) {
        const { floatSpeed, floatOffset, spinSpeed, baseY } = card.userData as {
          floatSpeed: number;
          floatOffset: number;
          spinSpeed: number;
          baseY: number;
        };
        card.position.y = baseY + Math.sin(elapsed * floatSpeed + floatOffset) * 0.8;
        card.rotation.y += spinSpeed * 0.01;
        card.rotation.z = Math.sin(elapsed * floatSpeed * 0.5 + floatOffset) * 0.1;
      }

      particles.rotation.y = elapsed * 0.02;

      camera.position.x += (pointer.x * 1.6 - camera.position.x) * 0.05;
      camera.position.y += (-pointer.y * 1.1 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    const tick = () => {
      frameId = requestAnimationFrame(tick);
      renderFrame();
    };

    const start = () => {
      if (!frameId && visible && onScreen) {
        clock.getDelta();
        frameId = requestAnimationFrame(tick);
      }
    };
    const stop = () => {
      if (frameId) {
        cancelAnimationFrame(frameId);
        frameId = 0;
      }
    };

    const onVisibilityChange = () => {
      visible = document.visibilityState === "visible";
      visible ? start() : stop();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        onScreen ? start() : stop();
      },
      { threshold: 0 }
    );
    io.observe(container);

    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = container;
      if (!clientWidth || !clientHeight) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    });
    resizeObserver.observe(container);

    start();

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      io.disconnect();
      resizeObserver.disconnect();

      scene.clear();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [enabled, resolvedTheme]);

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={className}
      // Purely decorative, so it must never intercept clicks.
      style={{ pointerEvents: "none" }}
    />
  );
}

export default HeroScene;
