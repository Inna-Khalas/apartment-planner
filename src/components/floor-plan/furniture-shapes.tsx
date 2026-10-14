import type { FurnitureItem } from "@/lib/apartment-plan";

interface Props {
  item: FurnitureItem;
  selected?: boolean;
  editable?: boolean;
  onPointerDown?: (e: React.PointerEvent) => void;
}

export function FurnitureShape({
  item,
  selected,
  editable,
  onPointerDown,
}: Props) {
  const { x, y, w, h, type, rotation = 0 } = item;
  const stroke = selected ? "#0f6b5c" : "#2a2a2a";
  const fill = selected ? "rgba(15,107,92,0.18)" : "rgba(255,255,255,0.55)";
  const cursor = editable && !item.locked ? "grab" : "default";

  const common = {
    onPointerDown,
    style: { cursor } as React.CSSProperties,
  };

  const gProps = {
    transform: `translate(${x} ${y}) rotate(${rotation})`,
    ...common,
  };

  switch (type) {
    case "bed":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={6} y={6} width={w - 12} height={28} rx={3} fill="none" stroke={stroke} strokeWidth={1} />
          <line x1={w / 2} y1={40} x2={w / 2} y2={h - 8} stroke={stroke} strokeWidth={0.8} strokeDasharray="4 3" />
        </g>
      );
    case "sofa":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={6} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={8} y={8} width={w - 16} height={h - 22} rx={4} fill="none" stroke={stroke} strokeWidth={1} />
          <rect x={4} y={h - 14} width={w - 8} height={10} rx={2} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "table":
    case "desk":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={4} y={4} width={w - 8} height={h - 8} rx={2} fill="none" stroke={stroke} strokeWidth={0.8} strokeDasharray="3 2" />
        </g>
      );
    case "chair":
      return (
        <g {...gProps}>
          <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 2 - 2} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <circle cx={w / 2} cy={h / 2} r={Math.min(w, h) / 4} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "shelves":
    case "wardrobe":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} />
          {[0.33, 0.66].map((t) => (
            <line
              key={t}
              x1={4}
              y1={h * t}
              x2={w - 4}
              y2={h * t}
              stroke={stroke}
              strokeWidth={0.8}
            />
          ))}
        </g>
      );
    case "kitchen":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={10} y={10} width={40} height={35} rx={2} fill="none" stroke={stroke} strokeWidth={1} />
          <circle cx={w - 40} cy={h / 2} r={12} fill="none" stroke={stroke} strokeWidth={1.2} />
          <circle cx={w - 40} cy={h / 2} r={4} fill={stroke} />
        </g>
      );
    case "sink":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={4} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <ellipse cx={w / 2} cy={h / 2} rx={w / 3} ry={h / 3} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "toilet":
      return (
        <g {...gProps}>
          <rect x={w * 0.15} y={0} width={w * 0.7} height={h * 0.35} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <ellipse cx={w / 2} cy={h * 0.62} rx={w * 0.38} ry={h * 0.32} fill={fill} stroke={stroke} strokeWidth={1.5} />
        </g>
      );
    case "tub":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={14} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={10} y={10} width={w - 20} height={h - 20} rx={10} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "shower":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <line x1={0} y1={0} x2={w} y2={h} stroke={stroke} strokeWidth={1} />
          <line x1={w} y1={0} x2={0} y2={h} stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "washer":
    case "dryer":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={3} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <circle cx={w / 2} cy={h / 2 + 2} r={Math.min(w, h) * 0.28} fill="none" stroke={stroke} strokeWidth={1.5} />
          <rect x={8} y={6} width={w - 16} height={8} rx={1} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "litter":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={8} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <ellipse cx={w / 2} cy={h / 2} rx={w * 0.28} ry={h * 0.28} fill="none" stroke={stroke} strokeWidth={1} />
        </g>
      );
    case "bowls":
      return (
        <g {...gProps}>
          <circle cx={w * 0.3} cy={h / 2} r={Math.min(w, h) * 0.28} fill={fill} stroke={stroke} strokeWidth={1.2} />
          <circle cx={w * 0.7} cy={h / 2} r={Math.min(w, h) * 0.28} fill={fill} stroke={stroke} strokeWidth={1.2} />
        </g>
      );
    case "tv":
      return (
        <g {...gProps}>
          <rect width={w} height={h} rx={2} fill={fill} stroke={stroke} strokeWidth={1.5} />
          <rect x={4} y={4} width={w - 8} height={h - 8} rx={1} fill="none" stroke={stroke} strokeWidth={0.8} />
        </g>
      );
    case "door":
      return (
        <g {...gProps}>
          <rect width={w} height={h} fill="#f5f0e8" stroke={stroke} strokeWidth={1.2} />
          {w >= h ? (
            <path
              d={`M0,${h / 2} A${w},${w} 0 0 1 ${w},${h / 2}`}
              fill="none"
              stroke={stroke}
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          ) : (
            <path
              d={`M${w / 2},0 A${h},${h} 0 0 1 ${w / 2},${h}`}
              fill="none"
              stroke={stroke}
              strokeWidth={1}
              strokeDasharray="3 2"
            />
          )}
        </g>
      );
    default:
      return (
        <g {...gProps}>
          <rect width={w} height={h} fill={fill} stroke={stroke} strokeWidth={1} />
        </g>
      );
  }
}
