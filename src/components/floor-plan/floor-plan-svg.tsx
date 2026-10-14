"use client";

import { useCallback, useRef, useState } from "react";
import {
  COLUMNS,
  REFERENCE_IMAGE,
  VIEWBOX,
  WALLS,
  WINDOWS,
  ZONES,
  type FurnitureItem,
  type GlazeChoice,
  type LayerId,
  type ZoneId,
} from "@/lib/apartment-plan";
import { FurnitureShape } from "./furniture-shapes";

interface Props {
  furniture: FurnitureItem[];
  labels: Record<ZoneId, string>;
  layers: Record<LayerId, boolean>;
  glaze: GlazeChoice;
  selectedZone: ZoneId | null;
  selectedFurniture: string | null;
  editMode: boolean;
  onSelectZone: (id: ZoneId | null) => void;
  onSelectFurniture: (id: string | null) => void;
  onMoveFurniture: (id: string, x: number, y: number) => void;
}

export function FloorPlanSvg({
  furniture,
  labels,
  layers,
  glaze,
  selectedZone,
  selectedFurniture,
  editMode,
  onSelectZone,
  onSelectFurniture,
  onMoveFurniture,
}: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [view, setView] = useState({ x: 0, y: 0, scale: 1 });
  const panRef = useRef<{
    active: boolean;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const dragRef = useRef<{
    id: string;
    offsetX: number;
    offsetY: number;
  } | null>(null);

  const clientToSvg = useCallback(
    (clientX: number, clientY: number) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const pt = svg.createSVGPoint();
      pt.x = clientX;
      pt.y = clientY;
      const ctm = svg.getScreenCTM();
      if (!ctm) return { x: 0, y: 0 };
      const local = pt.matrixTransform(ctm.inverse());
      return {
        x: (local.x - view.x) / view.scale,
        y: (local.y - view.y) / view.scale,
      };
    },
    [view],
  );

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 0.92 : 1.08;
    const next = Math.min(3.5, Math.max(0.45, view.scale * factor));
    const p = clientToSvg(e.clientX, e.clientY);
    // zoom toward cursor
    const nx = view.x + p.x * view.scale - p.x * next;
    const ny = view.y + p.y * view.scale - p.y * next;
    setView({ x: nx, y: ny, scale: next });
  };

  const onBgPointerDown = (e: React.PointerEvent) => {
    if (dragRef.current) return;
    if (e.button !== 0) return;
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    panRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      origX: view.x,
      origY: view.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragRef.current && editMode) {
      const p = clientToSvg(e.clientX, e.clientY);
      onMoveFurniture(
        dragRef.current.id,
        p.x - dragRef.current.offsetX,
        p.y - dragRef.current.offsetY,
      );
      return;
    }
    if (!panRef.current?.active) return;
    const dx = e.clientX - panRef.current.startX;
    const dy = e.clientY - panRef.current.startY;
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const sx = VIEWBOX.w / rect.width;
    const sy = VIEWBOX.h / rect.height;
    setView((v) => ({
      ...v,
      x: panRef.current!.origX + dx * sx,
      y: panRef.current!.origY + dy * sy,
    }));
  };

  const onPointerUp = () => {
    panRef.current = null;
    dragRef.current = null;
  };

  const wallStroke = (kind: (typeof WALLS)[number]["kind"]) => {
    switch (kind) {
      case "exterior":
        return { stroke: "#1a1a1a", strokeWidth: 5, fill: "none" };
      case "loadbearing":
        return { stroke: "#1a1a1a", strokeWidth: 7, fill: "none" };
      case "partition":
        return { stroke: "#333", strokeWidth: 3, fill: "none" };
      case "newPartition":
        return { stroke: "#5a7a4a", strokeWidth: 2.5, fill: "none", strokeDasharray: "8 4" };
      case "opening":
        return {
          stroke: "#c45c26",
          strokeWidth: 6,
          fill: "none",
          strokeDasharray: "10 6",
        };
      case "demolish":
        return {
          stroke: "#888",
          strokeWidth: 5,
          fill: "none",
          strokeDasharray: "4 4",
        };
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#c8bda8]/60 bg-[#f3efe6] shadow-inner">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        className="h-full w-full touch-none select-none"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="План объединённой квартиры 403 и 404"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="#d4cbb8"
              strokeWidth="0.6"
            />
          </pattern>
          <filter id="soft">
            <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.15" />
          </filter>
        </defs>

        <rect
          width={VIEWBOX.w}
          height={VIEWBOX.h}
          fill="url(#grid)"
          onPointerDown={(e) => {
            onSelectZone(null);
            onSelectFurniture(null);
            onBgPointerDown(e);
          }}
        />

        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {layers.reference && (
            <image
              href={REFERENCE_IMAGE.href}
              x={REFERENCE_IMAGE.x}
              y={REFERENCE_IMAGE.y}
              width={REFERENCE_IMAGE.width}
              height={REFERENCE_IMAGE.height}
              opacity={REFERENCE_IMAGE.opacity}
              preserveAspectRatio="xMidYMid meet"
              className="pointer-events-none"
            />
          )}

          {/* Zone fills (labels drawn later, above furniture) */}
          {ZONES.map((z) => {
            const isSelected = selectedZone === z.id;
            const isGlaze = glaze === z.id;
            return (
              <g key={z.id}>
                <polygon
                  points={z.points}
                  fill={z.fill}
                  stroke={isSelected ? "#0f6b5c" : "transparent"}
                  strokeWidth={isSelected ? 3 : 0}
                  opacity={0.92}
                  className="cursor-pointer transition-opacity hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectZone(z.id);
                    onSelectFurniture(null);
                  }}
                />
                {isGlaze && (
                  <polygon
                    points={z.points}
                    fill="none"
                    stroke="#0b6e99"
                    strokeWidth={3}
                    strokeDasharray="6 4"
                  />
                )}
              </g>
            );
          })}

          {/* Windows */}
          {WINDOWS.map((w) => (
            <rect
              key={w.id}
              x={w.x}
              y={w.y}
              width={w.w}
              height={w.h}
              fill="#e8f4fa"
              stroke="#4a6a7a"
              strokeWidth={1}
              transform={
                w.rotation
                  ? `rotate(${w.rotation} ${w.x + w.w / 2} ${w.y + w.h / 2})`
                  : undefined
              }
            />
          ))}

          {/* Walls */}
          {layers.walls &&
            WALLS.map((w) => {
              const s = wallStroke(w.kind);
              return (
                <path
                  key={w.id}
                  d={w.d}
                  {...s}
                  strokeLinecap={w.kind === "exterior" ? "round" : "square"}
                  strokeLinejoin="round"
                />
              );
            })}

          {/* Opening label */}
          {layers.labels && (
            <text
              x={615}
              y={530}
              style={{ fontFamily: "var(--font-plan)", fontSize: 11, fill: "#c45c26" }}
              transform="rotate(-90 615 530)"
            >
              новый проём
            </text>
          )}

          {/* Columns */}
          {COLUMNS.map((c, i) => (
            <rect
              key={i}
              x={c.x - 10}
              y={c.y - 10}
              width={20}
              height={20}
              fill="#1a1a1a"
              filter="url(#soft)"
            />
          ))}

          {/* Entry labels */}
          {layers.labels && (
            <>
              <text
                x={680}
                y={845}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-plan)",
                  fontSize: 12,
                  fill: "#0f6b5c",
                  fontWeight: 600,
                }}
              >
                Главный вход (бывш. №403)
              </text>
              <text
                x={1042}
                y={825}
                textAnchor="middle"
                style={{ fontFamily: "var(--font-plan)", fontSize: 10, fill: "#666" }}
              >
                вход 404 заделан → кладовая
              </text>
            </>
          )}

          {/* Furniture */}
          {furniture.map((item) => {
            if (!layers[item.layer]) return null;
            return (
              <FurnitureShape
                key={item.id}
                item={item}
                selected={selectedFurniture === item.id}
                editable={editMode}
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onSelectFurniture(item.id);
                  onSelectZone(item.zoneId);
                  if (!editMode || item.locked) return;
                  const p = clientToSvg(e.clientX, e.clientY);
                  dragRef.current = {
                    id: item.id,
                    offsetX: p.x - item.x,
                    offsetY: p.y - item.y,
                  };
                  (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
                }}
              />
            );
          })}

          {/* Zone labels above furniture so «Зона котов» etc. stay readable */}
          {layers.labels &&
            ZONES.map((z) => (
              <text
                key={`label-${z.id}`}
                x={z.centroid.x}
                y={z.centroid.y}
                textAnchor="middle"
                className="pointer-events-none"
                style={{
                  fontFamily: "var(--font-plan)",
                  fontSize: z.id === "cats" ? 14 : 13,
                  fill: "#1f2a24",
                  paintOrder: "stroke",
                  stroke: "rgba(243,239,230,0.85)",
                  strokeWidth: 3,
                }}
              >
                <tspan x={z.centroid.x} dy="0" fontWeight={700}>
                  {labels[z.id]}
                </tspan>
                <tspan
                  x={z.centroid.x}
                  dy="16"
                  style={{ fontSize: 12, fill: "#3d4a42", fontWeight: 600 }}
                >
                  {z.area.toFixed(2)} м²
                </tspan>
                {z.kind === "balcony" && glaze === z.id && (
                  <tspan
                    x={z.centroid.x}
                    dy="14"
                    style={{ fontSize: 10, fill: "#0b6e99" }}
                  >
                    остекление
                  </tspan>
                )}
              </text>
            ))}

          {/* Title block */}
          <g transform="translate(40, 880)">
            <text
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 15,
                fill: "#1a2e28",
                fontWeight: 700,
              }}
            >
              Объединение №403 + №404 · 91.01 м² без балконов
            </text>
            <text
              y={18}
              style={{ fontFamily: "var(--font-plan)", fontSize: 11, fill: "#5a655e" }}
            >
              Контур по исходным планам · концепт, не рабочий проект для БТИ
            </text>
          </g>
        </g>
      </svg>

      <div className="pointer-events-none absolute bottom-3 right-3 flex gap-1">
        <span className="rounded-md bg-[#1a2e28]/80 px-2 py-1 text-[11px] text-[#f3efe6]">
          колёсико — масштаб · перетаскивание — панорама
        </span>
      </div>
    </div>
  );
}
