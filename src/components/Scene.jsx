import {
  AccumulativeShadows,
  Environment,
  Html,
  Lightformer,
  OrbitControls,
  PerspectiveCamera,
  RandomizedLight,
  Sphere,
  useGLTF,
} from "@react-three/drei";

import * as THREE from "three";
import { useRef, useState, useEffect, useMemo } from "react";
import React from "react";
import { DEG2RAD } from "three/src/math/MathUtils";
import { useFrame } from "@react-three/fiber";
import { atom, useAtom } from "jotai";
import Card from './Card';

export const cameraStateAtom = atom({
  position: [3, 5, 20],
  lookAt: [0, 0, 0],
  needsReset: false
});

export const Scene = ({ mainColor, path, name, description, price, range, spheres, isActive, ...props }) => {
  const { scene } = useGLTF(path);
  const camera = useRef();
  const [cameraState, setCameraState] = useAtom(cameraStateAtom);
  const [targetPosition, setTargetPosition] = useState(cameraState.position);
  const [targetLookAt, setTargetLookAt] = useState(cameraState.lookAt);
  const [activeAnnotation, setActiveAnnotation] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeout = useRef(null);
  const initialCameraPosition = [3, 5, 20];
  const initialLookAt = [0, 0, 0];

  const ratioScale = useMemo(() => {
    return Math.min(1.2, Math.max(0.5, window.innerWidth / 1920));
  }, []);

 
  const handleSphereClick = (sphereId) => {
    const sphere = spheres.find(s => s.id === sphereId);
    if (sphere) {
      setIsTransitioning(true);
      setTargetPosition(sphere.cameraPos);
      setTargetLookAt(sphere.position);
      setActiveAnnotation(sphereId);
      setCameraState(prev => ({
        ...prev,
        position: sphere.cameraPos,
        lookAt: sphere.position,
        rotation: sphere.cameraRotation // Add camera rotation
      }));
    }
  };

  useEffect(() => {
    if (cameraState.needsReset) {
      setActiveAnnotation(null); // Clear annotation immediately
      requestAnimationFrame(() => {
        if (camera.current) {
          camera.current.position.set(...initialCameraPosition);
          camera.current.lookAt(...initialLookAt);
        }
        setTargetPosition(initialCameraPosition);
        setTargetLookAt(initialLookAt);
        setIsTransitioning(false);
        setCameraState(prev => ({
          position: initialCameraPosition,
          lookAt: initialLookAt,
          needsReset: false
        }));
      });
    }
  }, [cameraState.needsReset]);

  useFrame(() => {
    if (camera.current && isTransitioning) {
      camera.current.position.lerp(new THREE.Vector3(...targetPosition), 0.1);
      camera.current.lookAt(new THREE.Vector3(...targetLookAt));
      
      if (camera.current.position.distanceTo(new THREE.Vector3(...targetPosition)) < 0.1) {
        setIsTransitioning(false);
      }
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />
      <group {...props} dispose={null}>
        <PerspectiveCamera 
          ref={camera}
          makeDefault 
          position={[3, 5, 20]} 
          near={0.5} 
        />
        <OrbitControls
          enablePan={false}
          maxPolarAngle={DEG2RAD * 75}
          minDistance={6}
          maxDistance={20}
          endabled={!isTransitioning}
        />
        <primitive object={scene} scale={ratioScale} rotation={[0, 0, 0]} />
        
        {/* Invisible proxy objects for interaction */}
        {spheres.map((sphere) => (
          <group key={sphere.id}>
            <mesh 
              position={sphere.position}
              onClick={() => handleSphereClick(sphere.id, sphere.cameraPos)}
            >
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial visible={false} />
            </mesh>
          </group>
        ))}

        {/* Model-specific annotations */}
        {isActive && activeAnnotation && !cameraState.needsReset && 
          spheres
            .filter(sphere => sphere.id === activeAnnotation)
            .map(sphere => (
              <Html
                key={sphere.id}
                distanceFactor={1}
                position={sphere.annotation.position}
                rotation={sphere.annotation.rotation}
                transform
                occlude={false}
              >
                <div className="container mx-auto p-4">
                  <Card
                    title={sphere.annotation.title}
                    description={sphere.annotation.description}
                    imageUrl={sphere.annotation.imageUrl}
                    linkUrl={sphere.annotation.linkUrl}
                    linkText={sphere.annotation.linkText}
                  />
                </div>
              </Html>
            ))
        }

        {/* Rest of the existing component code (lights, environment, etc.) */}
        <ambientLight intensity={0.1} color="white" />
        <AccumulativeShadows
          frames={100}
          alphaTest={0.9}
          scale={30}
          position={[0, -0.005, 0]}
          color="white"
          opacity={0.8}
        >
          <RandomizedLight
            amount={4}
            radius={9}
            intensity={0.8}
            ambient={0.25}
            position={[10, 5, 15]}
          />
          <RandomizedLight
            amount={4}
            radius={5}
            intensity={0.5}
            position={[-5, 5, 15]}
            bias={0.001}
          />
        </AccumulativeShadows>
        <Environment blur={0.8} background>
          <Sphere scale={15}>
            <meshBasicMaterial color={mainColor} side={THREE.BackSide} />
          </Sphere>
          <Lightformer
            position={[5, 0, -5]}
            form="rect"
            intensity={1}
            color="gray"
            scale={[3, 5]}
            target={[0, 0, 0]}
          />
          <Lightformer
            position={[-5, 0, 1]}
            form="circle"
            intensity={1}
            color="gray"
            scale={[2, 5]}
            target={[0, 0, 0]}
          />
          <Lightformer
            position={[0, 5, -2]}
            form="ring"
            intensity={0.5}
            color="gray"
            scale={[10, 5]}
            target={[0, 0, 0]}
          />
          <Lightformer
            position={[0, 0, 5]}
            form="rect"
            intensity={1}
            color="gray"
            scale={[10, 5]}
            target={[0, 0, 0]}
          />
        </Environment>
      </group>
    </>
  );
};

useGLTF.preload("/models/mt6.glb");
useGLTF.preload("/models/ma2.glb");
useGLTF.preload("/models/mb5.glb");