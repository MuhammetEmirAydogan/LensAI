"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Torus, Float, MeshDistortMaterial } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function GyroAperture({ progress }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const speedMultiplier = progress > 0 ? 1 + (progress / 50) : 0.5;

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.x = state.clock.getElapsedTime() * 0.5 * speedMultiplier;
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.8 * speedMultiplier;
    }
  });

  // Rengi progress'a göre yeşile (başarı) kaydır
  const isProcessing = progress > 0;
  const glowColor = isProcessing ? "#22c55e" : "#3b82f6";
  const emissiveColor = isProcessing ? "#10b981" : "#8b5cf6";

  return (
    <group ref={groupRef}>
      {/* Dış Halka */}
      <Torus args={[2, 0.1, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={glowColor} emissive={emissiveColor} emissiveIntensity={isProcessing ? 2 : 0.5} wireframe />
      </Torus>
      {/* İç Çekirdek */}
      <Torus args={[1, 0.4, 32, 100]}>
        <MeshDistortMaterial 
          color={emissiveColor} 
          distort={isProcessing ? 0.6 : 0.2} 
          speed={isProcessing ? 4 : 1} 
          roughness={0.1}
          metalness={1}
          emissive={glowColor}
          emissiveIntensity={isProcessing ? Math.max(1, progress / 20) : 0.5}
        />
      </Torus>
    </group>
  );
}

export const LensCanvas = ({ progress }: { progress: number }) => {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <GyroAperture progress={progress} />
      </Canvas>
    </div>
  );
};
