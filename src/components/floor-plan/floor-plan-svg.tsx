"use client";

import { useCallback, useRef, useState } from "react";
import {
  COLUMNS,
  PLAN_BASE,
  VIEWBOX,
  WALLS,
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
    const next = Math.min(3.5, Math.max(0.4, view.scale * factor));
    const p = clientToSvg(e.clientX, e.clientY);
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
        return { stroke: "#1a1a1a", strokeWidth: 6, fill: "none", opacity: 0.55 };
      case "partition":
        return { stroke: "#333", strokeWidth: 3, fill: "none" };
      case "newPartition":
        return {
          stroke: "#2f6b3a",
          strokeWidth: 3,
          fill: "none",
          strokeDasharray: "10 5",
        };
      case "opening":
        return {
          stroke: "#c45c26",
          strokeWidth: 8,
          fill: "none",
          strokeDasharray: "12 7",
        };
      case "demolish":
        return {
          stroke: "#666",
          strokeWidth: 6,
          fill: "none",
          strokeDasharray: "5 4",
        };
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-[#c8bda8]/60 bg-[#efe9df] shadow-inner">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VIEWBOX.w} ${VIEWBOX.h}`}
        className="h-full w-full touch-none select-none"
        onWheel={onWheel}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        role="img"
        aria-label="План объединённой квартиры 403 и 404 по исходному чертежу"
      >
        <defs>
          <filter id="soft">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" floodOpacity="0.18" />
          </filter>
        </defs>

        <rect
          width={VIEWBOX.w}
          height={VIEWBOX.h}
          fill="#f4efe6"
          onPointerDown={(e) => {
            onSelectZone(null);
            onSelectFurniture(null);
            onBgPointerDown(e);
          }}
        />

        <g transform={`translate(${view.x} ${view.y}) scale(${view.scale})`}>
          {/* Исходный чертёж — контур 1:1 */}
          {layers.plan && (
            <image
              href={PLAN_BASE.href}
              x={PLAN_BASE.x}
              y={PLAN_BASE.y}
              width={PLAN_BASE.width}
              height={PLAN_BASE.height}
              preserveAspectRatio="none"
              className="pointer-events-none"
            />
          )}

          {/* Зоны программы (полупрозрачные поверх чертежа) */}
          {ZONES.map((z) => {
            const isSelected = selectedZone === z.id;
            const isGlaze = glaze === z.id;
            return (
              <g key={z.id}>
                <polygon
                  points={z.points}
                  fill={z.fill}
                  stroke={isSelected ? "#0f6b5c" : "rgba(0,0,0,0.12)"}
                  strokeWidth={isSelected ? 4 : 1}
                  className="cursor-pointer"
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
                    strokeWidth={4}
                    strokeDasharray="8 5"
                  />
                )}
              </g>
            );
          })}

          {/* Правки объединения */}
          {layers.walls &&
            WALLS.map((w) => {
              const s = wallStroke(w.kind);
              return (
                <path
                  key={w.id}
                  d={w.d}
                  {...s}
                  strokeLinecap="square"
                  strokeLinejoin="round"
                />
              );
            })}

          {layers.labels && (
            <text
              x={800}
              y={880}
              style={{
                fontFamily: "var(--font-plan)",
                fontSize: 16,
                fill: "#c45c26",
                fontWeight: 700,
              }}
              transform="rotate(-90 800 880)"
            >
              новый проём
            </text>
          )}

          {COLUMNS.map((c, i) => (
            <rect
              key={i}
              x={c.x - 9}
              y={c.y - 9}
              width={18}
              height={18}
              fill="#111"
              opacity={0.85}
              filter="url(#soft)"
            />
          ))}

          {layers.labels && (
            <>
              <text
                x={900}
                y={1235}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-plan)",
                  fontSize: 18,
                  fill: "#0f6b5c",
                  fontWeight: 700,
                }}
              >
                Главный вход (бывш. №403)
              </text>
              <text
                x={1430}
                y={1055}
                textAnchor="middle"
                style={{
                  fontFamily: "var(--font-plan)",
                  fontSize: 14,
                  fill: "#444",
                  fontWeight: 600,
                }}
              >
                вход 404 заделан → кладовая
              </text>
            </>
          )}

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
                  fontSize: z.id === "cats" ? 18 : 16,
                  fill: "#15231e",
                  paintOrder: "stroke",
                  stroke: "rgba(255,255,255,0.9)",
                  strokeWidth: 4,
                }}
              >
                <tspan x={z.centroid.x} dy="0" fontWeight={700}>
                  {labels[z.id]}
                </tspan>
                <tspan
                  x={z.centroid.x}
                  dy="20"
                  style={{ fontSize: 14, fill: "#2a3a34", fontWeight: 600 }}
                >
                  {z.area.toFixed(2)} м²
                </tspan>
                {z.kind === "balcony" && glaze === z.id && (
                  <tspan
                    x={z.centroid.x}
                    dy="16"
                    style={{ fontSize: 12, fill: "#0b6e99" }}
                  >
                    остекление
                  </tspan>
                )}
              </text>
            ))}

          <g transform="translate(40, 1300)">
            <text
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                fill: "#1a2e28",
                fontWeight: 700,
              }}
            >
              Объединение №403 + №404 · 91.01 м² без балконов
            </text>
            <text
              y={24}
              style={{ fontFamily: "var(--font-plan)", fontSize: 14, fill: "#5a655e" }}
            >
              Контур = исходный чертёж · правки объединения поверх · концепт, не БТИ
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
