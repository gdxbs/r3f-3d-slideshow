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

export const cameraStateAtom = atom({
  position: [3, 5, 20],
  lookAt: [0, 0, 0],
  needsReset: false
});

export const Scene = ({ mainColor, path, name, description, price, range, isActive, ...props }) => {
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

  const spherePositions = [
    {
      id: 'sphere1',
      position: [4.5, 0.8, -2.3],
      cameraPos: [6, 1, 0],
      annotation: {
        position: [8, 2, 0],
        content: (
          <div className="bg-white/90 p-3 rounded">
            <h3 className="font-bold">Engine Compartment</h3>
            <p>Advanced powertrain system</p>
          </div>
        )
      }
    },
    {
      id: 'sphere2',
      position: [4.2, .9, 3],
      cameraPos: [2, 1, 6],
      annotation: {
        position: [4, 2, 6],
        content: (
          <div className="bg-white/90 p-3 rounded">
            <h3 className="font-bold">Front Suspension</h3>
            <p>Innovative suspension design</p>
          </div>
        )
      }
    },
    {
      id: 'sphere3',
      position: [-4.5, 1.5, 2.5],
      cameraPos: [-6, 1, 6],
      annotation: {
        position: [-4, 2, 6],
        content: (
          <div className="bg-white/90 p-3 rounded">
            <h3 className="font-bold">Interior Features</h3>
            <p>Luxurious cabin details</p>
          </div>
        )
      }
    },
    {
      id: 'sphere4',
      position: [-4.2, 3.5, -.8],
      cameraPos: [-10, 1, 0],
      annotation: {
        position: [-8, 2, 0],
        content: (
          <div className="bg-white/90 p-3 rounded">
            <h3 className="font-bold">Rear Design</h3>
            <p>Aerodynamic styling</p>
          </div>
        )
      }
    },
    {
      id: 'sphere5',
      position: [-3.5, 1.4, -4],
      cameraPos: [0, 1, -10],
      annotation: {
        position: [-4, 6, -8],
        content: (
          <div className="bg-white/90 p-3 rounded">
            <h3 className="font-bold">Roof Structure</h3>
            <p>Reinforced framework</p>
          </div>
        )
      }
    }
  ];

  const handleSphereClick = (sphereId) => {
    const sphere = spherePositions.find(s => s.id === sphereId);
    if (sphere) {
      setIsTransitioning(true);
      setTargetPosition(sphere.cameraPos);
      setTargetLookAt(sphere.position);
      setActiveAnnotation(sphereId);
      setCameraState(prev => ({
        ...prev,
        position: sphere.cameraPos,
        lookAt: sphere.position
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
        {spherePositions.map((sphere) => (
          <group key={sphere.id}>
            {/* Invisible interaction sphere */}
            <mesh 
              position={sphere.position}
              onClick={() => handleSphereClick(sphere.id)}
            >
              <sphereGeometry args={[1, 32, 32]} />
              <meshBasicMaterial visible={false} />
            </mesh>
            
            {/* Optional: Visual indicator for development */}
            <mesh position={sphere.position}>
              <sphereGeometry args={[0.1, 16, 16]} />
              <meshStandardMaterial color="red" />
            </mesh>
          </group>
        ))}

        {isActive && activeAnnotation && !cameraState.needsReset && 
          spherePositions
            .filter(sphere => sphere.id === activeAnnotation)
            .map(sphere => (
              <Html
                key={sphere.id}
                distanceFactor={10}
                position={sphere.annotation.position}
                transform
                occlude
              >
                {sphere.annotation.content}
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

useGLTF.preload("/models/macame.glb");
useGLTF.preload("/models/macame.glb");
useGLTF.preload("/models/modelbnoanim.glb");