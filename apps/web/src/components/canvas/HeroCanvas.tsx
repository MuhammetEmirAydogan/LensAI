"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, OrbitControls, Sphere } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function AnimatedBlob() {
  const sphereRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere ref={sphereRef} args={[1.5, 64, 64]} scale={1.5}>
        <MeshDistortMaterial 
          color="#8b5cf6"
          attach="material" 
          distort={0.4} 
          speed={2} 
          roughness={0.2} 
          metalness={0.8} 
          emissive="#3b82f6" 
          emissiveIntensity={0.5}
          wireframe={false}
        />
      </Sphere>
    </Float>
  );
}

export const HeroCanvas = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1} />
        <directionalLight position={[10, 10, 5]} intensity={2} color="#22c55e" />
        <pointLight position={[-10, -10, -5]} intensity={3} color="#8b5cf6" />
        <AnimatedBlob />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};
