"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedStars() {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      ref.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      ref.current.position.z = Math.sin(state.clock.getElapsedTime() * 0.2) * 2;
    }
  });

  return (
    <group ref={ref}>
      <Stars radius={50} depth={50} count={5000} factor={4} saturation={1} fade speed={1} />
    </group>
  );
}

export const DataGridCanvas = () => {
  return (
    <div className="fixed inset-0 -z-20 pointer-events-none opacity-40">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <AnimatedStars />
      </Canvas>
    </div>
  );
};
