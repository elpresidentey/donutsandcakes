"use client";

import { Canvas } from "@react-three/fiber";
import { ACESFilmicToneMapping } from "three";
import type { ReactNode } from "react";
import { ProductScene } from "./ProductScene";
import type { ProductPreviewModel } from "./product-preview-model";

export default function ProductCanvas({
  model,
  rotation,
  zoom,
  spinning,
  sliced,
  fallback,
  onReady,
  onRotation,
}: {
  model: ProductPreviewModel;
  rotation: number;
  zoom: number;
  spinning: boolean;
  sliced: boolean;
  fallback: ReactNode;
  onReady: () => void;
  onRotation: (rotation: number) => void;
}) {
  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{ position: [0, 3.65, 7], fov: 34, near: 0.1, far: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      fallback={fallback}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.08;
        gl.setClearColor(0x000000, 0);
        onReady();
      }}
    >
      <ProductScene model={model} rotation={rotation} zoom={zoom} spinning={spinning} sliced={sliced} onRotation={onRotation} />
    </Canvas>
  );
}
