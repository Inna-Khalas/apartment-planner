import { LEGEND_ITEMS } from "@/lib/apartment-plan";

export function FloorPlanLegend() {
  return (
    <div className="space-y-2">
      <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-[#1a2e28]">
        Легенда
      </h3>
      <ul className="space-y-1.5 text-[13px] text-[#2a3530]">
        {LEGEND_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <Swatch color={item.color} kind={item.swatch ?? "fill"} />
            <span>{item.label}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Swatch({
  color,
  kind,
}: {
  color: string;
  kind: "fill" | "line" | "dash" | "thin" | "x";
}) {
  if (kind === "fill") {
    return (
      <span
        className="inline-block h-3.5 w-5 shrink-0 rounded-sm border border-[#000]/15"
        style={{ background: color }}
      />
    );
  }
  return (
    <svg width={20} height={14} className="shrink-0">
      {kind === "line" && (
        <line x1={2} y1={7} x2={18} y2={7} stroke={color} strokeWidth={3} />
      )}
      {kind === "dash" && (
        <line
          x1={2}
          y1={7}
          x2={18}
          y2={7}
          stroke={color}
          strokeWidth={3}
          strokeDasharray="4 3"
        />
      )}
      {kind === "thin" && (
        <line
          x1={2}
          y1={7}
          x2={18}
          y2={7}
          stroke={color}
          strokeWidth={2}
          strokeDasharray="5 3"
        />
      )}
      {kind === "x" && (
        <>
          <line x1={4} y1={3} x2={16} y2={11} stroke={color} strokeWidth={2} />
          <line x1={16} y1={3} x2={4} y2={11} stroke={color} strokeWidth={2} />
        </>
      )}
    </svg>
  );
}
