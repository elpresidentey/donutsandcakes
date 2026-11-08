"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  CanvasTexture,
  CylinderGeometry,
  ExtrudeGeometry,
  LatheGeometry,
  Shape,
  Vector2,
} from "three";
import type { Group } from "three";
import { SMOOTHIE_FRUITS } from "@/lib/catalog";
import { mixHex } from "@/lib/color";
import type { ProductPreviewModel } from "./product-preview-model";

function cakeGeometry(shape: string, radius: number, height: number, sliced: boolean) {
  if (shape === "square") return new BoxGeometry(radius * 2, height, radius * 2);
  if (shape === "heart") {
    const outline = new Shape();
    outline.moveTo(0, radius * 0.92);
    outline.bezierCurveTo(-radius * 0.22, radius * 1.2, -radius, radius * 1.18, -radius, radius * 0.48);
    outline.bezierCurveTo(-radius, -radius * 0.18, -radius * 0.35, -radius * 0.75, 0, -radius);
    outline.bezierCurveTo(radius * 0.35, -radius * 0.75, radius, -radius * 0.18, radius, radius * 0.48);
    outline.bezierCurveTo(radius, radius * 1.18, radius * 0.22, radius * 1.2, 0, radius * 0.92);
    const geometry = new ExtrudeGeometry(outline, {
      depth: height,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.025,
      bevelThickness: 0.02,
      curveSegments: 24,
    });
    geometry.translate(0, 0, -height / 2);
    geometry.rotateX(-Math.PI / 2);
    return geometry;
  }
  return new CylinderGeometry(radius, radius, height, 64, 1, false, sliced ? 1.27 : 0, sliced ? Math.PI * 2 - 0.56 : Math.PI * 2);
}

function CakeLayer({
  shape,
  radius,
  height,
  y,
  color,
  sliced,
  roughness = 0.38,
}: {
  shape: string;
  radius: number;
  height: number;
  y: number;
  color: string;
  sliced: boolean;
  roughness?: number;
}) {
  const geometry = useMemo(() => cakeGeometry(shape, radius, height, sliced), [shape, radius, height, sliced]);
  return (
    <mesh geometry={geometry} position={[0, y, 0]} castShadow receiveShadow>
      <meshPhysicalMaterial color={color} roughness={roughness} clearcoat={0.28} clearcoatRoughness={0.32} />
    </mesh>
  );
}

function Inscription({ text, gold }: { text: string; gold: boolean }) {
  const texture = useMemo(() => {
    if (!text || typeof document === "undefined") return null;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const context = canvas.getContext("2d");
    if (!context) return null;
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = "bold 68px cursive";
    context.fillStyle = gold ? "#b8860b" : "#542f20";
    context.shadowColor = "rgba(255,255,255,.65)";
    context.shadowBlur = 5;
    context.fillText(text.slice(0, 20), canvas.width / 2, canvas.height / 2, 490);
    return new CanvasTexture(canvas);
  }, [text, gold]);
  if (!texture) return null;
  return (
    <mesh position={[0, 1.19, 0.14]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[1.28, 0.32]} />
      <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function CakeModel({ model, sliced }: { model: Extract<ProductPreviewModel, { kind: "cake" }>; sliced: boolean }) {
  const radius = model.size.startsWith('6') ? 0.82 : model.size.startsWith('10') ? 1.12 : model.size.startsWith('12') ? 1.25 : 1;
  const fillingColors: Record<string, string> = {
    "Chocolate ganache": "#442317",
    "Strawberry jam": "#c62e50",
    Caramel: "#c07832",
    "Cream cheese": "#fff0d2",
    "Lemon curd": "#edc932",
  };
  const filling = fillingColors[model.filling];
  const toppingPoints = [
    [-0.66, -0.45], [-0.2, -0.66], [0.3, -0.58], [0.67, -0.3], [0.72, 0.25],
    [0.38, 0.58], [-0.16, 0.66], [-0.62, 0.36], [-0.04, -0.18], [0.42, 0.06],
  ] as const;
  const has = (value: string) => model.toppings.includes(value);
  const topY = 1.12;
  return (
    <group position={[0, -0.62, 0]}>
      {/* hand-finished cake board */}
      <mesh position={[0, 0.025, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[radius + 0.19, radius + 0.19, 0.09, 64]} />
        <meshPhysicalMaterial color="#f5ead9" roughness={0.3} clearcoat={0.45} />
      </mesh>
      <mesh position={[0, -0.015, 0]}>
        <cylinderGeometry args={[radius + 0.2, radius + 0.2, 0.035, 64]} />
        <meshStandardMaterial color="#c9a96e" metalness={0.64} roughness={0.28} />
      </mesh>
      <CakeLayer shape={model.shape} radius={radius} height={0.42} y={0.28} color={model.sponge} sliced={sliced} />
      {filling && <CakeLayer shape={model.shape} radius={radius * 0.985} height={0.075} y={0.53} color={filling} sliced={sliced} roughness={0.24} />}
      <CakeLayer shape={model.shape} radius={radius} height={0.42} y={0.78} color={model.sponge} sliced={sliced} />
      <CakeLayer shape={model.shape} radius={radius * 1.015} height={0.14} y={1.06} color={model.frosting} sliced={sliced} roughness={0.24} />
      {model.shape === "round" && (
        <>
          <mesh position={[0, 1.125, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 0.91, 0.045, 12, 72]} />
            <meshPhysicalMaterial color={model.frosting} roughness={0.24} clearcoat={0.55} />
          </mesh>
          <mesh position={[0, 0.13, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 0.98, 0.035, 10, 72]} />
            <meshPhysicalMaterial color={model.frosting} roughness={0.32} />
          </mesh>
        </>
      )}
      {has("Sprinkles") && toppingPoints.map(([x, z], index) => (
        <mesh key={`sprinkle-${index}`} position={[x * radius, topY + 0.025, z * radius]} rotation={[0, index * 0.85, 0]} castShadow>
          <capsuleGeometry args={[0.018, 0.075, 3, 6]} />
          <meshStandardMaterial color={["#e64980", "#4d7cfe", "#f59e0b", "#2f9d63"][index % 4]} roughness={0.32} />
        </mesh>
      ))}
      {has("Fresh berries") && toppingPoints.slice(0, 6).map(([x, z], index) => (
        <mesh key={`berry-${index}`} position={[x * radius, topY + 0.085, z * radius]} scale={[0.1, 0.1, 0.1]} castShadow>
          <sphereGeometry args={[1, 18, 18]} />
          <meshPhysicalMaterial color={index % 2 ? "#6f2444" : "#b62246"} roughness={0.22} clearcoat={0.6} />
        </mesh>
      ))}
      {has("Cherries") && toppingPoints.slice(1, 6).map(([x, z], index) => (
        <group key={`cherry-${index}`} position={[x * radius, topY + 0.09, z * radius]}>
          <mesh castShadow><sphereGeometry args={[0.095, 18, 18]} /><meshPhysicalMaterial color="#c42137" roughness={0.2} clearcoat={0.8} /></mesh>
          <mesh position={[0.025, 0.12, 0]} rotation={[0, 0, -0.3]}><cylinderGeometry args={[0.012, 0.018, 0.18, 8]} /><meshStandardMaterial color="#286942" /></mesh>
        </group>
      ))}
      {has("Gold dust") && toppingPoints.map(([x, z], index) => (
        <mesh key={`gold-${index}`} position={[x * radius, topY + 0.06, z * radius]}>
          <sphereGeometry args={[0.025, 10, 10]} /><meshStandardMaterial color="#dfae3c" metalness={0.7} roughness={0.26} />
        </mesh>
      ))}
      {has("Oreo crunch") && toppingPoints.slice(0, 6).map(([x, z], index) => (
        <mesh key={`oreo-${index}`} position={[x * radius, topY + 0.04, z * radius]} rotation={[0.3, index, 0.5]}>
          <cylinderGeometry args={[0.055, 0.055, 0.035, 8]} /><meshStandardMaterial color="#30231d" roughness={0.56} />
        </mesh>
      ))}
      {has("Toasted coconut") && toppingPoints.map(([x, z], index) => (
        <mesh key={`coconut-${index}`} position={[x * radius, topY + 0.035, z * radius]} rotation={[0.4, index, 0]}>
          <boxGeometry args={[0.07, 0.025, 0.035]} /><meshStandardMaterial color="#fff8e8" roughness={0.7} />
        </mesh>
      ))}
      {has("Chocolate shavings") && toppingPoints.slice(0, 7).map(([x, z], index) => (
        <mesh key={`shaving-${index}`} position={[x * radius, topY + 0.04, z * radius]} rotation={[0, index, 0.4]}>
          <boxGeometry args={[0.16, 0.025, 0.035]} /><meshPhysicalMaterial color="#40251c" roughness={0.35} />
        </mesh>
      ))}
      {has("Fresh flowers") && toppingPoints.slice(0, 5).map(([x, z], index) => (
        <group key={`flower-${index}`} position={[x * radius, topY + 0.06, z * radius]}>
          {Array.from({ length: 5 }, (_, petal) => <mesh key={petal} position={[Math.cos(petal * Math.PI * 0.4) * 0.075, 0, Math.sin(petal * Math.PI * 0.4) * 0.075]} scale={[0.8, 0.35, 1]} rotation={[0, petal * Math.PI * 0.4, 0]}><sphereGeometry args={[0.06, 12, 12]} /><meshPhysicalMaterial color={index % 2 ? "#fff7ec" : "#f6c3d1"} roughness={0.38} /></mesh>)}
          <mesh><sphereGeometry args={[0.035, 12, 12]} /><meshStandardMaterial color="#dda82f" metalness={0.35} /></mesh>
        </group>
      ))}
      {model.inscription && <Inscription text={model.inscription} gold={model.gold} />}
    </group>
  );
}

const DONUT_COLORS: Record<string, string> = {
  Strawberry: "#ed82a1", Chocolate: "#553225", Vanilla: "#f1dcb2", "Honey glaze": "#dc9d42",
  Blueberry: "#7966c5", Lemon: "#e8ca54", Caramel: "#bb773b", "Red velvet": "#9c2e3b",
};
const GLAZE_COLORS: Record<string, string> = {
  "Classic shine": "#fff2dc", "Chocolate dip": "#4a2a1e", "Strawberry dip": "#ed6d91",
  "Caramel drizzle": "#c38335", "Vanilla bean": "#f5e5c8",
};

function DonutModel({ model }: { model: Extract<ProductPreviewModel, { kind: "donut" }> }) {
  const count = model.slots.length;
  const columns = count <= 4 ? 2 : count <= 9 ? 3 : 4;
  const rows = Math.ceil(count / columns);
  const radius = count >= 12 ? 0.36 : count >= 9 ? 0.43 : count >= 6 ? 0.52 : 0.67;
  const step = radius * 2 + 0.12;
  const boxWidth = Math.max(2.6, columns * step + 0.32);
  const boxDepth = rows * step + 0.42;
  return (
    <group position={[0, -0.55, 0]}>
      <mesh position={[0, 0.02, 0]} receiveShadow castShadow><boxGeometry args={[boxWidth + 0.3, 0.12, boxDepth + 0.3]} /><meshPhysicalMaterial color="#d1aa73" roughness={0.62} /></mesh>
      <mesh position={[0, 0.12, 0]} castShadow><boxGeometry args={[boxWidth, 0.08, boxDepth]} /><meshPhysicalMaterial color="#fbf4e7" roughness={0.58} /></mesh>
      <mesh position={[0, 0.18, 0]}><boxGeometry args={[boxWidth, 0.035, boxDepth]} /><meshStandardMaterial color="#ead7b8" roughness={0.7} /></mesh>
      {model.slots.map((flavour, index) => {
        const col = index % columns;
        const row = Math.floor(index / columns);
        const x = (col - (columns - 1) / 2) * step;
        const z = (row - (rows - 1) / 2) * step;
        const dough = DONUT_COLORS[flavour] ?? "#e7b663";
        const glaze = GLAZE_COLORS[model.glaze] ?? "#fff2dc";
        return (
          <group key={`${index}-${flavour}`} position={[x, 0.3, z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <torusGeometry args={[radius * 0.56, radius * 0.34, 24, 48]} />
              <meshPhysicalMaterial color={dough} roughness={0.42} clearcoat={0.25} />
            </mesh>
            <mesh position={[0, 0.075, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
              <torusGeometry args={[radius * 0.58, radius * 0.25, 20, 48]} />
              <meshPhysicalMaterial color={model.glaze === "Classic shine" ? dough : glaze} roughness={0.22} clearcoat={0.75} clearcoatRoughness={0.14} />
            </mesh>
            {model.toppings.includes("Sprinkles") && Array.from({ length: 8 }, (_, sprinkle) => {
              const a = (sprinkle / 8) * Math.PI * 2 + index * 0.31;
              const x2 = Math.cos(a) * radius * 0.57;
              const z2 = Math.sin(a) * radius * 0.57;
              return <mesh key={sprinkle} position={[x2, 0.21, z2]} rotation={[0, -a, 0]}><capsuleGeometry args={[0.012, radius * 0.17, 3, 5]} /><meshStandardMaterial color={["#f45d87", "#52a36b", "#f6c74a", "#7054bb"][sprinkle % 4]} roughness={0.35} /></mesh>;
            })}
            {model.toppings.includes("Chopped nuts") && Array.from({ length: 6 }, (_, nut) => {
              const a = (nut / 6) * Math.PI * 2;
              return <mesh key={nut} position={[Math.cos(a) * radius * 0.56, 0.2, Math.sin(a) * radius * 0.56]} rotation={[0.2, a, 0.3]}><boxGeometry args={[0.07, 0.035, 0.045]} /><meshStandardMaterial color="#9b6238" roughness={0.68} /></mesh>;
            })}
            {model.toppings.includes("Oreo crumbs") && Array.from({ length: 5 }, (_, crumb) => <mesh key={crumb} position={[(crumb - 2) * 0.09, 0.2, ((crumb % 2) - 0.5) * 0.3]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#28201d" roughness={0.75} /></mesh>)}
            {model.toppings.includes("Coconut flakes") && Array.from({ length: 6 }, (_, flake) => <mesh key={flake} position={[Math.cos(flake) * radius * 0.55, 0.2, Math.sin(flake) * radius * 0.55]} rotation={[0.2, flake, 0.2]}><boxGeometry args={[0.08, 0.015, 0.04]} /><meshStandardMaterial color="#fff8ea" roughness={0.7} /></mesh>)}
            {model.toppings.includes("Choc chips") && Array.from({ length: 5 }, (_, chip) => <mesh key={chip} position={[Math.cos(chip * 1.2) * radius * 0.54, 0.2, Math.sin(chip * 1.2) * radius * 0.54]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#47251b" roughness={0.4} /></mesh>)}
            {model.toppings.includes("Dried berries") && Array.from({ length: 5 }, (_, berry) => <mesh key={berry} position={[Math.cos(berry * 1.2) * radius * 0.52, 0.2, Math.sin(berry * 1.2) * radius * 0.52]}><sphereGeometry args={[0.035, 8, 8]} /><meshStandardMaterial color="#7b3451" roughness={0.32} /></mesh>)}
          </group>
        );
      })}
    </group>
  );
}

const FRUIT_COLORS: Record<string, string> = Object.fromEntries(SMOOTHIE_FRUITS.map((fruit) => [fruit.value, fruit.swatch ?? "#ed6d91"]));

function smoothieLiquidColor(model: Extract<ProductPreviewModel, { kind: "smoothie" }>) {
  return model.fruits.length ? mixHex([...model.fruits.map((fruit) => FRUIT_COLORS[fruit] ?? "#ed6d91"), model.baseSwatch]) : model.baseSwatch;
}

function SmoothieModel({ model }: { model: Extract<ProductPreviewModel, { kind: "smoothie" }> }) {
  const large = model.size.startsWith("Large");
  const height = large ? 2.32 : 1.94;
  const color = smoothieLiquidColor(model);
  const glassGeometry = useMemo(() => new LatheGeometry([
    new Vector2(0.4, 0.08), new Vector2(0.43, 0.13), new Vector2(0.5, height * 0.5), new Vector2(0.61, height),
  ], 48), [height]);
  const liquidGeometry = useMemo(() => new LatheGeometry([
    new Vector2(0.35, 0.12), new Vector2(0.39, 0.18), new Vector2(0.46, height * 0.48), new Vector2(0.55, height * 0.82),
  ], 48), [height]);
  return (
    <group position={[0, -0.65, 0]}>
      {/* weighted glass base */}
      <mesh position={[0, 0.08, 0]} castShadow><cylinderGeometry args={[0.43, 0.43, 0.13, 48]} /><meshPhysicalMaterial color="#fffdfa" transparent opacity={0.28} roughness={0.08} clearcoat={1} /></mesh>
      <mesh geometry={liquidGeometry} position={[0, 0.13, 0]} castShadow>
        <meshPhysicalMaterial color={color} roughness={0.2} clearcoat={0.82} clearcoatRoughness={0.14} />
      </mesh>
      <mesh position={[0, 0.13 + height * 0.82, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.54, 48]} /><meshPhysicalMaterial color={color} roughness={0.24} clearcoat={0.6} />
      </mesh>
      <mesh geometry={glassGeometry} position={[0, 0.08, 0]}>
        <meshPhysicalMaterial color="#eff8ff" transparent opacity={0.22} roughness={0.06} metalness={0.08} clearcoat={1} side={2} depthWrite={false} />
      </mesh>
      {/* straw and rim highlights */}
      <mesh position={[0.34, height * 0.57, -0.02]} rotation={[0, 0, -0.12]} castShadow><cylinderGeometry args={[0.045, 0.045, height * 1.02, 16]} /><meshPhysicalMaterial color="#c34724" roughness={0.28} clearcoat={0.5} /></mesh>
      <mesh position={[0.34, height * 0.57, 0.03]} rotation={[0, 0, -0.12]}><cylinderGeometry args={[0.012, 0.012, height * 0.95, 8]} /><meshStandardMaterial color="#ffd8ba" roughness={0.45} /></mesh>
      <mesh position={[0, height * 0.85 + 0.09, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.58, 0.025, 10, 48]} /><meshPhysicalMaterial color="#ffffff" roughness={0.1} clearcoat={1} /></mesh>
      {/* fruit pieces and bubbles */}
      {model.fruits.slice(0, 4).map((fruit, index) => (
        <mesh key={`${fruit}-${index}`} position={[-0.15 + index * 0.1, 0.45 + ((index * 41) % 100) / 100, 0.31 - (index % 2) * 0.12]} scale={[0.12, 0.075, 0.055]} rotation={[0.2, index * 0.7, 0.45]} castShadow>
          <sphereGeometry args={[1, 16, 16]} /><meshPhysicalMaterial color={FRUIT_COLORS[fruit] ?? "#ed6d91"} roughness={0.28} clearcoat={0.45} />
        </mesh>
      ))}
      {Array.from({ length: 14 }, (_, index) => <mesh key={`bubble-${index}`} position={[-0.34 + ((index * 47) % 68) / 100, 0.34 + ((index * 61) % 140) / 100, 0.29]}><sphereGeometry args={[index % 4 === 0 ? 0.028 : 0.016, 8, 8]} /><meshBasicMaterial color="#fff7e8" transparent opacity={0.6} /></mesh>)}
      {model.extras.includes("Extra ice") && Array.from({ length: 3 }, (_, index) => <mesh key={`ice-${index}`} position={[-0.26 + index * 0.26, height * 0.84, 0.03]} rotation={[0.1, index, 0.3]} castShadow><boxGeometry args={[0.24, 0.15, 0.2]} /><meshPhysicalMaterial color="#edfbff" transparent opacity={0.68} roughness={0.08} clearcoat={1} /></mesh>)}
      {model.extras.includes("Mint") && <group position={[-0.18, height * 0.88, 0]} rotation={[0.2, 0, -0.1]}><mesh rotation={[0, 0, -0.45]}><sphereGeometry args={[0.18, 16, 12]} /><meshStandardMaterial color="#34804b" roughness={0.56} /></mesh><mesh rotation={[0, 0, 0.55]} position={[0.2, 0.02, 0]}><sphereGeometry args={[0.16, 16, 12]} /><meshStandardMaterial color="#4f9b5f" roughness={0.56} /></mesh></group>}
      {model.fruits[0] && <mesh position={[-0.42, height * 0.91, 0.04]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.065, 12, 24]} /><meshPhysicalMaterial color={FRUIT_COLORS[model.fruits[0]] ?? "#ed6d91"} roughness={0.28} clearcoat={0.45} /></mesh>}
    </group>
  );
}

function ProductObject({ model, sliced }: { model: ProductPreviewModel; sliced: boolean }) {
  if (model.kind === "cake") return <CakeModel model={model} sliced={sliced} />;
  if (model.kind === "donut") return <DonutModel model={model} />;
  return <SmoothieModel model={model} />;
}

export function ProductScene({ model, rotation, zoom, spinning, sliced, onRotation }: {
  model: ProductPreviewModel;
  rotation: number;
  zoom: number;
  spinning: boolean;
  sliced: boolean;
  onRotation: (rotation: number) => void;
}) {
  const turntable = useRef<Group>(null);
  const wasSpinning = useRef(spinning);
  useFrame((_, delta) => {
    if (!turntable.current) return;
    if (spinning) turntable.current.rotation.y += delta * 0.5;
    else {
      if (wasSpinning.current) onRotation(turntable.current.rotation.y);
      turntable.current.rotation.y += (rotation - turntable.current.rotation.y) * Math.min(1, delta * 8);
    }
    wasSpinning.current = spinning;
  });
  return (
    <>
      <ambientLight intensity={0.72} />
      <hemisphereLight args={["#fff5e7", "#7f5b43", 1.15]} />
      <directionalLight position={[-4, 8, 5]} intensity={3.2} color="#fff1da" castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
      <directionalLight position={[4, 3, -5]} intensity={1.25} color="#ffd6b3" />
      <pointLight position={[0, 2.5, 3]} intensity={0.65} color="#ffffff" />
      <group ref={turntable} scale={zoom}>
        <ProductObject model={model} sliced={sliced} />
      </group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.64, 0]} receiveShadow>
        <circleGeometry args={[3.8, 64]} /><shadowMaterial opacity={0.22} />
      </mesh>
    </>
  );
}
