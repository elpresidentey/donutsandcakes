"use client";

import dynamic from "next/dynamic";
import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ProductPreviewModel } from "./product-preview-model";

const ProductCanvas = dynamic(() => import("./ProductCanvas"), { ssr: false });

export default function PreviewStage({
  children,
  sliceContent,
  model,
}: {
  children: ReactNode;
  sliceContent?: ReactNode;
  model: ProductPreviewModel;
}) {
  const [rotation, setRotation] = useState(-0.08);
  const [zoom, setZoom] = useState(1);
  const [spinning, setSpinning] = useState(false);
  const [showInside, setShowInside] = useState(false);
  const [showSlicePopup, setShowSlicePopup] = useState(false);
  const [webglReady, setWebglReady] = useState(false);
  const drag = useRef<{ id: number; x: number; angle: number } | null>(null);
  const sliceTimer = useRef<number | null>(null);

  const closeSlice = () => {
    if (sliceTimer.current !== null) window.clearTimeout(sliceTimer.current);
    sliceTimer.current = null;
    setShowSlicePopup(false);
    setShowInside(false);
  };

  const openSlice = () => {
    if (sliceTimer.current !== null) window.clearTimeout(sliceTimer.current);
    setShowInside(true);
    setShowSlicePopup(true);
    sliceTimer.current = window.setTimeout(closeSlice, 2800);
  };

  const startDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    drag.current = { id: event.pointerId, x: event.clientX, angle: rotation };
    event.currentTarget.setPointerCapture(event.pointerId);
    setSpinning(false);
  };

  const moveDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId) return;
    setRotation(drag.current.angle + (event.clientX - drag.current.x) * 0.012);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (drag.current?.id === event.pointerId) drag.current = null;
  };

  const reset = () => {
    setRotation(-0.08);
    setZoom(1);
    setSpinning(false);
    closeSlice();
  };

  return (
    <div className="relative">
      <div
        role="group"
        aria-label="Interactive product preview. Drag horizontally to rotate. Use plus and minus to zoom."
        tabIndex={0}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") setRotation((value) => value - 0.18);
          if (event.key === "ArrowRight") setRotation((value) => value + 0.18);
          if (event.key === "+" || event.key === "=") setZoom((value) => Math.min(1.28, value + 0.08));
          if (event.key === "-") setZoom((value) => Math.max(0.82, value - 0.08));
        }}
        className="relative min-h-[300px] touch-pan-y select-none overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ember sm:min-h-[390px]"
        style={{ cursor: drag.current ? "grabbing" : "grab" }}
      >
        <div aria-hidden={webglReady} className={cn("absolute inset-0 flex items-center justify-center p-5 transition-opacity duration-500 sm:p-8", webglReady && "pointer-events-none opacity-0")}>
          {children}
        </div>
        <div className="absolute inset-0">
          <ProductCanvas
            model={model}
            rotation={rotation}
            zoom={zoom}
            spinning={spinning}
            sliced={showInside}
            fallback={children}
            onReady={() => setWebglReady(true)}
            onRotation={setRotation}
          />
        </div>
        <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-choco/55 backdrop-blur-sm">
          Drag to turn
        </span>
      </div>

      {sliceContent && showInside && showSlicePopup && (
        <div role="status" className="absolute right-3 top-3 z-20 animate-[fade-up_0.22s_ease-out_both] rounded-2xl border border-choco/10 bg-milk/95 px-3 py-2.5 shadow-lg backdrop-blur sm:right-5 sm:top-5">
          <div className="flex items-center gap-3">
            <div className="min-w-0">{sliceContent}</div>
            <button type="button" aria-label="Dismiss slice view" onClick={closeSlice} className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-sm font-bold text-choco/50 transition hover:bg-sand hover:text-choco">×</button>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-choco/10 bg-milk/45 px-4 py-3 sm:px-6">
        <p className="hidden text-[10px] font-bold uppercase tracking-[0.14em] text-choco/50 sm:block">Drag to rotate · zoom to inspect</p>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" onClick={() => setZoom((value) => Math.max(0.82, value - 0.08))} aria-label="Zoom out" className="grid h-9 w-9 place-items-center rounded-full border border-choco/15 bg-white text-lg font-bold transition hover:border-ember hover:text-ember">−</button>
          <button type="button" onClick={() => setZoom((value) => Math.min(1.28, value + 0.08))} aria-label="Zoom in" className="grid h-9 w-9 place-items-center rounded-full border border-choco/15 bg-white text-lg font-bold transition hover:border-ember hover:text-ember">+</button>
          <button type="button" onClick={() => setSpinning((value) => !value)} aria-pressed={spinning} className={cn("min-h-9 rounded-full border px-3 text-xs font-bold transition", spinning ? "border-ember bg-ember text-white" : "border-choco/15 bg-white hover:border-ember hover:text-ember")}>
            {spinning ? "Pause" : "Spin"}
          </button>
          {sliceContent && (
            <button type="button" onClick={() => showInside ? closeSlice() : openSlice()} aria-pressed={showInside} className={cn("min-h-9 rounded-full border px-3 text-xs font-bold transition active:scale-95", showInside ? "border-ember bg-ember text-white" : "border-choco/15 bg-white hover:border-ember hover:text-ember")}>
              {showInside ? "Hide inside" : "Slice"}
            </button>
          )}
          <button type="button" onClick={reset} className="min-h-9 rounded-full px-2 text-xs font-bold text-choco/60 transition hover:text-choco">Reset</button>
        </div>
      </div>
    </div>
  );
}
