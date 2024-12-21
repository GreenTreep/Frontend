import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, useCursor } from "@react-three/drei";
import { Backpack } from "./Backpack";
import { Boots } from "./Boots";

const RotatingModel = ({ children, rotationSpeed = 0.005 }) => {
  const ref = useRef();
  const [hovered, setHovered] = React.useState(false);
  useCursor(hovered, 'grab');

  // Rotation automatique
  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += rotationSpeed;
    }
  });

  return (
    <group
      ref={ref}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {children}
    </group>
  );
};

const Equipment3D = ({ model }) => {
  const modelSettings = {
    backpack: { position: [0, 0, 0], scale: 1, rotation: [0, 0, 0] },
    boots: { position: [0, 0, 0], scale: 1, rotation: [0, 0, 0] },
  };

  const settings = modelSettings[model] || {};

  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Environment preset="sunset" />
      <OrbitControls enableZoom={false} target={[0, 0, 0]} />
      <RotatingModel>
        {model === "backpack" && (
          <Backpack
            position={settings.position}
            scale={settings.scale}
            rotation={settings.rotation}
          />
        )}
        {model === "boots" && (
          <Boots
            position={settings.position}
            scale={settings.scale}
            rotation={settings.rotation}
          />
        )}
      </RotatingModel>
    </Canvas>
  );
};

export default Equipment3D;
