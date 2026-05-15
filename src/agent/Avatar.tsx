"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Avatar — the 3D face that *is* Ernest.
 *
 * Loads a Ready Player Me head-only GLB and animates it in real time:
 *   • jaw/mouth morphs driven by the live mic-side audio level
 *   • natural eye blinks on a Poisson-distributed timer
 *   • idle breathing (chest morph + subtle vertical sway)
 *   • head/eye tracking that follows the visitor's cursor
 *
 * The avatar URL is configurable via NEXT_PUBLIC_AVATAR_URL. Defaults to
 * a generic Ready Player Me preset — replace it with a bespoke avatar
 * built at https://readyplayer.me to look like a real PRISE employee.
 */

interface Props {
  /** 0–1 from the realtime hook's analyser */
  audioLevel: number;
  /** Whether the agent is actively connected (eyes open wider, breathing faster) */
  active: boolean;
  /** Tailwind className for the wrapper */
  className?: string;
  /** Called when the GLB fails to load so the parent can show a fallback. */
  onLoadError?: () => void;
}

const DEFAULT_AVATAR =
  process.env.NEXT_PUBLIC_AVATAR_URL ||
  // Public Ready Player Me sample (half-body w/ morph targets). Replace via env.
  "https://models.readyplayer.me/64bfa15f0e72c63d7c3934a6.glb?morphTargets=ARKit,Oculus%20Visemes&textureAtlas=512";

export function Avatar({ audioLevel, active, className, onLoadError }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const onLoadErrorRef = useRef(onLoadError);
  useEffect(() => { onLoadErrorRef.current = onLoadError; });

  // Stable refs across renders (updated in an effect to satisfy
  // react-hooks/refs which forbids ref writes during render).
  const audioRef = useRef(0);
  const activeRef = useRef(active);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => { audioRef.current = audioLevel; });
  useEffect(() => { activeRef.current = active; });

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = mount.clientWidth || 320;
    const h = mount.clientHeight || 320;

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(28, w / h, 0.1, 100);
    camera.position.set(0, 1.55, 1.05);
    camera.lookAt(0, 1.55, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    // Three-point-ish lighting tuned for skin
    const ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xfff5e6, 1.1);
    key.position.set(2.5, 3.4, 2.2);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0x9fcfff, 0.45);
    fill.position.set(-2.4, 1.8, 1.8);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0x2BB7DC, 0.6);
    rim.position.set(0, 2.5, -3);
    scene.add(rim);

    let head: THREE.Object3D | null = null;
    let bodyMesh: THREE.SkinnedMesh | null = null;
    let teethMesh: THREE.SkinnedMesh | null = null;

    // Morph target index helpers
    let mouthOpenIdx = -1;
    let jawOpenIdx = -1;
    let blinkLIdx = -1;
    let blinkRIdx = -1;
    let smileLIdx = -1;
    let smileRIdx = -1;
    let visemeAA = -1;
    let visemeOO = -1;
    let visemeEE = -1;

    const findMorph = (mesh: THREE.SkinnedMesh, name: string): number => {
      const dict = mesh.morphTargetDictionary;
      if (!dict) return -1;
      if (name in dict) return dict[name];
      // Try case-insensitive
      const lower = name.toLowerCase();
      for (const k of Object.keys(dict)) {
        if (k.toLowerCase() === lower) return dict[k];
      }
      return -1;
    };

    const loader = new GLTFLoader();
    let cancelled = false;

    loader.load(
      DEFAULT_AVATAR,
      (gltf) => {
        if (cancelled) return;
        const root = gltf.scene;

        // Position so only head + shoulders are visible
        root.position.set(0, 0, 0);
        scene.add(root);

        root.traverse((obj) => {
          if ((obj as THREE.SkinnedMesh).isSkinnedMesh) {
            const m = obj as THREE.SkinnedMesh;
            if (m.morphTargetDictionary && m.morphTargetInfluences) {
              const name = m.name.toLowerCase();
              if (name.includes("head") || name.includes("wolf3d_head") || name.includes("face")) {
                bodyMesh = m;
                mouthOpenIdx = findMorph(m, "mouthOpen");
                jawOpenIdx  = findMorph(m, "jawOpen");
                blinkLIdx   = findMorph(m, "eyeBlinkLeft");
                blinkRIdx   = findMorph(m, "eyeBlinkRight");
                smileLIdx   = findMorph(m, "mouthSmileLeft");
                smileRIdx   = findMorph(m, "mouthSmileRight");
                visemeAA    = findMorph(m, "viseme_aa");
                visemeOO    = findMorph(m, "viseme_O");
                visemeEE    = findMorph(m, "viseme_E");
              }
              if (name.includes("teeth")) {
                teethMesh = m;
              }
            }
          }
        });

        // Grab the head bone for tracking
        head = root.getObjectByName("Head") || root.getObjectByName("Wolf3D_Head") || null;
      },
      undefined,
      (err) => {
        // Loader error (DNS, 404, CORS, malformed GLB). Trigger parent fallback.
        console.warn("[Ernest avatar] GLB load failed:", err);
        onLoadErrorRef.current?.();
      }
    );

    // Mouse tracking (eye/head follow)
    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      mouseRef.current.x = (e.clientX - cx) / window.innerWidth;
      mouseRef.current.y = (e.clientY - cy) / window.innerHeight;
    };
    window.addEventListener("mousemove", onMouseMove);

    // Resize
    const onResize = () => {
      const W = mount.clientWidth || w;
      const H = mount.clientHeight || h;
      renderer.setSize(W, H);
      camera.aspect = W / H;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Animation state
    let raf = 0;
    const clock = new THREE.Clock();
    let nextBlinkAt = 1.2 + Math.random() * 2;
    let blinkPhase = 0; // 0..1 closing, 1..2 opening, else idle
    let smoothedAudio = 0;

    const tick = () => {
      const t = clock.getElapsedTime();
      const dt = Math.max(clock.getDelta(), 1 / 60);

      // Audio smoothing
      smoothedAudio = smoothedAudio * 0.78 + audioRef.current * 0.22;
      const mouthOpen = Math.max(0, Math.min(1, smoothedAudio * 2.4));

      // Pseudo-viseme rotation — split mouth energy across AA / OO / EE
      const vWave = Math.sin(t * 8.5);
      const vAA = mouthOpen * (0.6 + 0.4 * vWave);
      const vOO = mouthOpen * 0.5 * (0.5 - vWave * 0.5);
      const vEE = mouthOpen * 0.35 * Math.max(0, Math.sin(t * 5.2));

      // Blink scheduling
      if (t > nextBlinkAt && blinkPhase === 0) blinkPhase = 0.001;
      let blink = 0;
      if (blinkPhase > 0 && blinkPhase <= 1) {
        blink = blinkPhase;
        blinkPhase += dt * 9;
        if (blinkPhase > 1) blinkPhase = 1.001;
      } else if (blinkPhase > 1 && blinkPhase < 2) {
        blink = 2 - blinkPhase;
        blinkPhase += dt * 7;
        if (blinkPhase >= 2) {
          blinkPhase = 0;
          nextBlinkAt = t + 1.6 + Math.random() * 3.4;
        }
      }

      // Subtle baseline smile when active
      const smile = activeRef.current ? 0.18 : 0.05;

      // Apply morphs
      if (bodyMesh && bodyMesh.morphTargetInfluences) {
        const inf = bodyMesh.morphTargetInfluences;
        if (mouthOpenIdx >= 0) inf[mouthOpenIdx] = mouthOpen * 0.85;
        if (jawOpenIdx >= 0)   inf[jawOpenIdx]   = mouthOpen * 0.6;
        if (visemeAA >= 0)     inf[visemeAA]     = Math.max(0, vAA);
        if (visemeOO >= 0)     inf[visemeOO]     = Math.max(0, vOO);
        if (visemeEE >= 0)     inf[visemeEE]     = Math.max(0, vEE);
        if (blinkLIdx >= 0)    inf[blinkLIdx]    = blink;
        if (blinkRIdx >= 0)    inf[blinkRIdx]    = blink;
        if (smileLIdx >= 0)    inf[smileLIdx]    = smile;
        if (smileRIdx >= 0)    inf[smileRIdx]    = smile;
      }
      if (teethMesh && teethMesh.morphTargetInfluences && jawOpenIdx >= 0) {
        teethMesh.morphTargetInfluences[jawOpenIdx] = mouthOpen * 0.6;
      }

      // Head sway + cursor tracking
      if (head) {
        const targetY = mouseRef.current.x * 0.55 + Math.sin(t * 0.6) * 0.05;
        const targetX = mouseRef.current.y * 0.35 + Math.sin(t * 0.42) * 0.03;
        head.rotation.y += (targetY - head.rotation.y) * 0.08;
        head.rotation.x += (targetX - head.rotation.x) * 0.08;
      }

      // Breathing — gentle vertical bob
      const breathe = Math.sin(t * (activeRef.current ? 1.6 : 1.1)) * 0.005;
      scene.position.y = breathe;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).isMesh) {
          const m = obj as THREE.Mesh;
          m.geometry?.dispose();
          if (Array.isArray(m.material)) m.material.forEach((mat) => mat.dispose());
          else (m.material as THREE.Material | undefined)?.dispose();
        }
      });
      if (renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-label="Ernest, concierge PRISE"
      role="img"
    />
  );
}
