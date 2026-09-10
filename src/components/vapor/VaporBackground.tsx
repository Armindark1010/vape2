"use client";

/*
 * VaporBackground — معادل کامپوننت VaporBackground.vue در این پروژه
 * دود/ذرات حجمی سه‌بعدی با Three.js:
 *  - تعامل لمس: touchmove/pointermove جهت حرکت ذرات را نرم تغییر می‌دهد
 *  - بهینه‌سازی موبایل: تعداد ذرات و DPR بر اساس دستگاه تنظیم می‌شود
 *  - نگهبان FPS: در صورت افت نرخ فریم، بار گرافیکی خودکار کم می‌شود
 *  - توقف خودکار هنگام عدم دید (IntersectionObserver) و پشتیبانی reduced-motion
 */
import { useEffect, useRef } from "react";
import type * as THREE from "three";

const VERT = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uSize;
  varying float vSeed;
  varying float vGlow;
  void main() {
    vSeed = aSeed;
    float t = uTime * (0.06 + aSeed * 0.09);
    vec3 p = position;
    float y = mod(p.y + t * 4.0 + aSeed * 20.0, 74.0) - 37.0;
    float sway = sin(uTime * 0.35 + aSeed * 6.2831) * 3.2 + uMouse.x * 7.0;
    float sway2 = cos(uTime * 0.28 + aSeed * 9.42) * 2.4 + uMouse.y * 5.0;
    vec3 pos = vec3(p.x + sway, y, p.z + sway2);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = uSize * (0.55 + 0.9 * aSeed) * (260.0 / -mv.z);
    gl_PointSize = min(gl_PointSize, 90.0);
    vGlow = smoothstep(26.0, 6.0, length(pos.xz * vec2(0.9, 1.0)));
    gl_Position = projectionMatrix * mv;
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying float vSeed;
  varying float vGlow;
  uniform float uOpacity;
  uniform vec3 uA;
  uniform vec3 uB;
  uniform vec3 uC;
  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float alpha = smoothstep(0.5, 0.08, d);
    vec3 col = mix(uA, uB, vSeed);
    col = mix(col, uC, smoothstep(0.2, 1.0, vSeed) * 0.55);
    float pulse = 0.72 + 0.28 * sin(vSeed * 40.0);
    col *= (0.5 + vGlow) * pulse;
    gl_FragColor = vec4(col, alpha * uOpacity * 0.55);
  }
`;

export function VaporBackground({ className = "" }: { className?: string }) {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = holder.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let disposed = false;
    let cleanup: (() => void) | undefined;

    (async () => {
      const THREE = await import("three");
      if (disposed || !el) return;

      const isMobile =
        window.matchMedia("(pointer: coarse)").matches ||
        window.innerWidth < 768 ||
        (navigator.maxTouchPoints ?? 0) > 1;
      const cores = navigator.hardwareConcurrency ?? 8;

      // ── کیفیت خودکار ──
      let quality = isMobile ? (cores <= 4 ? 0.55 : 0.8) : 1;
      const BASE = isMobile ? 160 : 300;
      const MIN = Math.floor(BASE * 0.35);
      let count = Math.floor(BASE * quality);
      let dprCap = isMobile ? 1.5 : 2;

      const canvas = document.createElement("canvas");
      canvas.style.cssText = "width:100%;height:100%;display:block;";
      el.appendChild(canvas);

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile, powerPreference: "high-performance" });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap));

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, 1, 1, 200);
      camera.position.set(0, 0, 58);

      const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

      const onMove = (e: PointerEvent | TouchEvent) => {
        const cx = "touches" in e ? e.touches[0]?.clientX : e.clientX;
        const cy = "touches" in e ? e.touches[0]?.clientY : e.clientY;
        if (cx == null || cy == null) return;
        mouse.tx = (cx / window.innerWidth) * 2 - 1;
        mouse.ty = (cy / window.innerHeight) * 2 - 1;
      };
      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });

      let points: THREE.Points | null = null;
      let geo: THREE.BufferGeometry | null = null;
      let uniforms: Record<string, THREE.IUniform> = {};

      function buildPoints(n: number) {
        if (geo) {
          geo.dispose();
          scene.remove(points!);
        }
        geo = new THREE.BufferGeometry();
        const pos = new Float32Array(n * 3);
        const seed = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          pos[i * 3] = (Math.random() - 0.5) * 62;
          pos[i * 3 + 1] = (Math.random() - 0.5) * 74;
          pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
          seed[i] = Math.random();
        }
        geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        geo.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));

        uniforms = {
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uSize: { value: isMobile ? 5.6 : 6.4 },
          uOpacity: { value: 1 },
          uA: { value: new THREE.Color("#7c5cf0") },
          uB: { value: new THREE.Color("#38bdf8") },
          uC: { value: new THREE.Color("#4ade80") },
        };

        const mat = new THREE.ShaderMaterial({
          vertexShader: VERT,
          fragmentShader: FRAG,
          uniforms,
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        points = new THREE.Points(geo, mat);
        scene.add(points);
      }
      buildPoints(count);

      // ── نگهبان FPS ──
      let frames = 0;
      let last = performance.now();
      let fpsCheck = 0;
      let degraded = false;

      const clock = new THREE.Clock();
      let raf = 0;
      let running = true;

      const loop = () => {
        raf = requestAnimationFrame(loop);
        if (!running) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        const t = clock.elapsedTime;

        mouse.x += (mouse.tx - mouse.x) * 0.04;
        mouse.y += (mouse.ty - mouse.y) * 0.04;
        uniforms.uTime.value = t;
        (uniforms.uMouse.value as THREE.Vector2).set(mouse.x, mouse.y);

        // breathing opacity so the vapor never sits still
        uniforms.uOpacity.value = 0.75 + 0.25 * Math.sin(t * 0.4);

        renderer.render(scene, camera);

        frames++;
        const now = performance.now();
        if (now - last >= 1000) {
          const fps = frames / ((now - last) / 1000);
          frames = 0;
          last = now;
          fpsCheck++;
          if (fpsCheck > 2 && fps < 42 && count > MIN && !degraded) {
            degraded = true;
            count = Math.max(MIN, Math.floor(count * 0.55));
            buildPoints(count);
          }
          if (fps > 54 && degraded && count < BASE) {
            count = Math.min(BASE, Math.floor(count * 1.5));
            buildPoints(count);
            degraded = false;
          }
        }
      };
      loop();

      const resize = () => {
        const w = el.clientWidth || 1;
        const h = el.clientHeight || 1;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(el);

      // pause when hero is off-screen
      const io = new IntersectionObserver(([e]) => {
        running = e.isIntersecting;
        if (running) clock.getDelta();
      });
      io.observe(el);

      const onVis = () => {
        if (document.hidden) running = false;
        else {
          running = true;
          clock.getDelta();
        }
      };
      document.addEventListener("visibilitychange", onVis);

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("touchmove", onMove);
        geo?.dispose();
        if (points) (points.material as THREE.ShaderMaterial).dispose();
        renderer.dispose();
        canvas.remove();
      };
    })();

    return () => {
      disposed = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={holder}
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    />
  );
}
