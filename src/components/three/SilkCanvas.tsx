"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { type ShaderMaterial, Vector2, Vector3 } from "three";
import { hexToRgb } from "@/lib/color";
import { silkFragment, silkVertex } from "./shader";

const color = (hex: string) => new Vector3(...hexToRgb(hex));

// Наклон полотна (верх уходит вглубь) и запас размера, чтобы края не попадали в кадр
const TILT = -0.35;
const COVER = { x: 1.35, y: 1.6 };
const SEGMENTS = { x: 220, y: 140 };

function SilkCloth() {
  const material = useRef<ShaderMaterial>(null);
  const pointer = useRef(new Vector2(0.5, 0.5));
  const lastPointer = useRef(new Vector2(0.5, 0.5));
  const viewport = useThree((state) => state.viewport);
  const width = viewport.width * COVER.x;
  const height = viewport.height * COVER.y;

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uRipple: { value: 0 },
      uSize: { value: new Vector2(1, 1) },
      uAmplitude: { value: 0.45 },
      uLight: { value: color("#f7f3ec") },
      uShadow: { value: color("#ecdcc6") },
      uDeep: { value: color("#c49a6c") },
      uGold: { value: color("#e8c98a") },
    }),
    [],
  );

  useEffect(() => {
    const move = (event: PointerEvent) => {
      pointer.current.set(
        event.clientX / window.innerWidth,
        1 - event.clientY / window.innerHeight,
      );
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, []);

  useFrame((_, delta) => {
    const current = material.current;
    if (!current) return;
    const { uniforms: u } = current;
    u.uTime.value += delta * 0.6;
    u.uSize.value.set(width, height);
    u.uMouse.value.lerp(pointer.current, 0.06);
    // скорость курсора раскачивает волну, затем она плавно затухает
    const speed =
      pointer.current.distanceTo(lastPointer.current) / Math.max(delta, 1e-3);
    lastPointer.current.copy(pointer.current);
    u.uRipple.value += (Math.min(speed * 0.6, 1) - u.uRipple.value) * 0.05;
  });

  return (
    <mesh rotation={[TILT, 0, 0]}>
      <planeGeometry args={[width, height, SEGMENTS.x, SEGMENTS.y]} />
      <shaderMaterial
        ref={material}
        vertexShader={silkVertex}
        fragmentShader={silkFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export default function SilkCanvas() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 animate-[fade-in_1.6s_ease_forwards] opacity-0"
    >
      <Canvas
        flat
        linear
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 3], fov: 40 }}
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "low-power" }}
      >
        <SilkCloth />
      </Canvas>
    </div>
  );
}
