"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { type ShaderMaterial, Vector2, Vector3 } from "three";
import { hexToRgb } from "@/lib/color";
import { silkFragment, silkVertex } from "./shader";

const color = (hex: string) => new Vector3(...hexToRgb(hex));

function SilkPlane() {
  const material = useRef<ShaderMaterial>(null);
  const pointer = useRef(new Vector2(0.5, 0.5));
  const size = useThree((state) => state.size);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new Vector2(0.5, 0.5) },
      uRes: { value: new Vector2(1, 1) },
      uLight: { value: color("#f7f3ec") },
      uBase: { value: color("#e6dccf") },
      uShadow: { value: color("#d4aa78") },
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
    current.uniforms.uTime.value += delta * 0.6;
    current.uniforms.uMouse.value.lerp(pointer.current, 0.05);
    current.uniforms.uRes.value.set(size.width, size.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
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
        frameloop={visible ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <SilkPlane />
      </Canvas>
    </div>
  );
}
