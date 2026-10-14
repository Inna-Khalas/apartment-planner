/**
 * Геометрия объединённой квартиры №403 + №404.
 * Координаты в пикселях кропа исходного чертежа plan-base.png (1800×1400),
 * чтобы контур совпадал с планировкой 1:1.
 */

export type ZoneKind = "living" | "auxiliary" | "balcony";

export type ZoneId =
  | "master"
  | "wardrobe"
  | "ensuite"
  | "kitchen"
  | "living"
  | "living404"
  | "office"
  | "bathMain"
  | "laundry"
  | "cats"
  | "hall"
  | "storage"
  | "balcony730"
  | "balcony390"
  | "balcony310"
  | "balcony480";

export type LayerId =
  | "furniture"
  | "plumbing"
  | "doors"
  | "labels"
  | "walls"
  | "plan";

export type FurnitureType =
  | "bed"
  | "sofa"
  | "table"
  | "desk"
  | "chair"
  | "shelves"
  | "wardrobe"
  | "kitchen"
  | "sink"
  | "toilet"
  | "tub"
  | "shower"
  | "washer"
  | "dryer"
  | "litter"
  | "bowls"
  | "tv"
  | "door"
  | "column";

export interface Point {
  x: number;
  y: number;
}

export interface Zone {
  id: ZoneId;
  label: string;
  area: number;
  kind: ZoneKind;
  points: string;
  fill: string;
  centroid: Point;
}

export interface FurnitureItem {
  id: string;
  zoneId: ZoneId;
  type: FurnitureType;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
  layer: Exclude<LayerId, "labels" | "walls" | "plan">;
  locked?: boolean;
}

export interface WallSeg {
  id: string;
  kind: "exterior" | "loadbearing" | "partition" | "newPartition" | "opening" | "demolish";
  d: string;
}

export interface WindowMark {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation?: number;
}

export interface AreaSummary {
  apt403: number;
  apt404: number;
  sumWithBalconies: number;
  balconies: number;
  withoutBalconies: number;
  living: number;
  auxiliary: number;
}

/** = размер public/plans/plan-base.png */
export const VIEWBOX = { w: 1800, h: 1400 } as const;

export const STORAGE_KEY = "merged-apt-403-404-v3";

/** Исходный чертёж — всегда подложка (контур 1:1). */
export const PLAN_BASE = {
  href: "/plans/plan-base.png",
  x: 0,
  y: 0,
  width: 1800,
  height: 1400,
} as const;

export const AREA: AreaSummary = {
  apt403: 68.89,
  apt404: 41.22,
  sumWithBalconies: 110.11,
  balconies: 19.1,
  withoutBalconies: 91.01,
  living: 53.8,
  auxiliary: 37.21,
};

export const BALCONY_IDS: ZoneId[] = [
  "balcony730",
  "balcony390",
  "balcony310",
  "balcony480",
];

function pts(...coords: number[][]): string {
  return coords.map(([x, y]) => `${x},${y}`).join(" ");
}

/**
 * Полигоны зон — обводка комнат на кропе source-b (1800×1400).
 * Внешний контур берётся с подложки; здесь hit-area + заливка программы.
 */
export const ZONES: Zone[] = [
  {
    id: "balcony730",
    label: "Балкон",
    area: 7.3,
    kind: "balcony",
    points: pts(
      [95, 280],
      [95, 140],
      [130, 85],
      [220, 55],
      [720, 130],
      [720, 210],
      [280, 145],
      [210, 155],
      [185, 210],
      [185, 280],
    ),
    fill: "rgba(140, 190, 215, 0.22)",
    centroid: { x: 340, y: 130 },
  },
  {
    id: "balcony390",
    label: "Балкон",
    area: 3.9,
    kind: "balcony",
    points: pts([70, 720], [185, 720], [185, 1020], [70, 1020]),
    fill: "rgba(140, 190, 215, 0.22)",
    centroid: { x: 125, y: 870 },
  },
  {
    id: "balcony310",
    label: "Балкон",
    area: 3.1,
    kind: "balcony",
    points: pts([760, 145], [1020, 210], [1020, 285], [760, 225]),
    fill: "rgba(140, 190, 215, 0.22)",
    centroid: { x: 890, y: 210 },
  },
  {
    id: "balcony480",
    label: "Балкон",
    area: 4.8,
    kind: "balcony",
    points: pts([1060, 220], [1480, 340], [1480, 420], [1060, 300]),
    fill: "rgba(140, 190, 215, 0.22)",
    centroid: { x: 1270, y: 320 },
  },
  {
    id: "master",
    label: "Спальня 1 (мастер)",
    area: 15.5,
    kind: "living",
    points: pts(
      [185, 280],
      [185, 210],
      [210, 155],
      [280, 145],
      [720, 210],
      [720, 520],
      [185, 520],
    ),
    fill: "rgba(170, 210, 160, 0.28)",
    centroid: { x: 440, y: 340 },
  },
  {
    id: "kitchen",
    label: "Кухня-столовая",
    area: 11.0,
    kind: "auxiliary",
    // бывшая комната 11.00
    points: pts([185, 520], [720, 520], [720, 780], [185, 780]),
    fill: "rgba(220, 200, 170, 0.28)",
    centroid: { x: 450, y: 650 },
  },
  {
    id: "living",
    label: "Гостиная",
    area: 20.0,
    kind: "living",
    points: pts(
      [185, 780],
      [780, 780],
      [780, 1180],
      [220, 1180],
      [220, 1020],
      [185, 1020],
    ),
    fill: "rgba(160, 205, 150, 0.28)",
    centroid: { x: 470, y: 960 },
  },
  {
    id: "wardrobe",
    label: "Гардероб",
    area: 2.8,
    kind: "auxiliary",
    // новые перегородки у бывшей мокрой зоны 403
    points: pts([780, 520], [900, 520], [900, 640], [780, 640]),
    fill: "rgba(220, 200, 180, 0.32)",
    centroid: { x: 840, y: 580 },
  },
  {
    id: "ensuite",
    label: "С/у спальни",
    area: 2.2,
    kind: "auxiliary",
    points: pts([780, 640], [900, 640], [900, 780], [780, 780]),
    fill: "rgba(215, 195, 175, 0.32)",
    centroid: { x: 840, y: 710 },
  },
  {
    id: "office",
    label: "Кабинет / будущая спальня 2",
    area: 6.3,
    kind: "living",
    // бывшая 6.30 у балкона 3.10 — стол, без кровати
    points: pts([780, 225], [1020, 285], [1020, 520], [780, 520]),
    fill: "rgba(175, 210, 165, 0.28)",
    centroid: { x: 900, y: 380 },
  },
  {
    id: "living404",
    label: "Зона отдыха",
    area: 12.0,
    kind: "living",
    points: pts(
      [1020, 300],
      [1480, 420],
      [1480, 780],
      [1180, 780],
      [1180, 620],
      [1020, 620],
    ),
    fill: "rgba(160, 200, 150, 0.28)",
    centroid: { x: 1250, y: 520 },
  },
  {
    id: "bathMain",
    label: "Санузел с ванной",
    area: 4.8,
    kind: "auxiliary",
    // на базе мокрой зоны 404
    points: pts([1020, 620], [1180, 620], [1180, 860], [1020, 860]),
    fill: "rgba(220, 200, 185, 0.32)",
    centroid: { x: 1100, y: 740 },
  },
  {
    id: "hall",
    label: "Прихожая",
    area: 8.0,
    kind: "auxiliary",
    // от главного входа 403
    points: pts([780, 780], [1020, 780], [1020, 1180], [780, 1180]),
    fill: "rgba(230, 215, 195, 0.3)",
    centroid: { x: 900, y: 980 },
  },
  {
    id: "laundry",
    label: "Прачечная",
    area: 3.2,
    kind: "auxiliary",
    points: pts([1180, 780], [1340, 780], [1340, 980], [1180, 980]),
    fill: "rgba(210, 200, 185, 0.32)",
    centroid: { x: 1260, y: 880 },
  },
  {
    id: "cats",
    label: "Зона котов",
    area: 2.1,
    kind: "auxiliary",
    points: pts([1020, 860], [1180, 860], [1180, 1020], [1020, 1020]),
    fill: "rgba(235, 215, 190, 0.35)",
    centroid: { x: 1100, y: 920 },
  },
  {
    id: "storage",
    label: "Кладовая / техзона",
    area: 3.11,
    kind: "auxiliary",
    // заделанный вход 404
    points: pts([1340, 780], [1520, 780], [1520, 1020], [1340, 1020]),
    fill: "rgba(200, 195, 185, 0.35)",
    centroid: { x: 1430, y: 900 },
  },
];

/**
 * Только правки объединения поверх чертежа:
 * проём, заделка входа 404, новые лёгкие перегородки.
 * Несущий контур — на подложке.
 */
export const WALLS: WallSeg[] = [
  // Межквартирная стена: оставляем, один проём в жилой зоне
  { id: "lb-demise-n", kind: "loadbearing", d: "M780,210 L780,780" },
  { id: "lb-demise-s", kind: "loadbearing", d: "M780,980 L780,1180" },
  { id: "opening-main", kind: "opening", d: "M780,780 L780,980" },
  // Новые перегородки (гардероб / ensuite / прачечная / коты / кладовая)
  { id: "new-ward-n", kind: "newPartition", d: "M780,520 L900,520" },
  { id: "new-ward-e", kind: "newPartition", d: "M900,520 L900,780" },
  { id: "new-ward-mid", kind: "newPartition", d: "M780,640 L900,640" },
  { id: "new-office-s", kind: "newPartition", d: "M780,520 L1020,520" },
  { id: "new-bath-e", kind: "newPartition", d: "M1180,620 L1180,1020" },
  { id: "new-bath-n", kind: "newPartition", d: "M1020,620 L1180,620" },
  { id: "new-cat-n", kind: "newPartition", d: "M1020,860 L1180,860" },
  { id: "new-laun-w", kind: "newPartition", d: "M1340,780 L1340,1020" },
  { id: "new-wet-s", kind: "newPartition", d: "M1020,780 L1520,780" },
  { id: "seal-404", kind: "demolish", d: "M1480,900 L1520,900" },
];

export const COLUMNS: Point[] = [
  { x: 780, y: 520 },
  { x: 780, y: 780 },
  { x: 1020, y: 520 },
  { x: 780, y: 1180 },
];

export const WINDOWS: WindowMark[] = [];

export const DEFAULT_FURNITURE: FurnitureItem[] = [
  {
    id: "f-bed",
    zoneId: "master",
    type: "bed",
    label: "Кровать 160",
    x: 320,
    y: 280,
    w: 200,
    h: 180,
    layer: "furniture",
  },
  {
    id: "f-bedside-l",
    zoneId: "master",
    type: "shelves",
    label: "Тумба",
    x: 280,
    y: 300,
    w: 32,
    h: 40,
    layer: "furniture",
  },
  {
    id: "f-bedside-r",
    zoneId: "master",
    type: "shelves",
    label: "Тумба",
    x: 530,
    y: 300,
    w: 32,
    h: 40,
    layer: "furniture",
  },
  {
    id: "f-wardrobe",
    zoneId: "wardrobe",
    type: "wardrobe",
    label: "Гардероб",
    x: 792,
    y: 535,
    w: 96,
    h: 95,
    layer: "furniture",
  },
  {
    id: "f-ens-toilet",
    zoneId: "ensuite",
    type: "toilet",
    label: "Унитаз",
    x: 795,
    y: 660,
    w: 36,
    h: 50,
    layer: "plumbing",
  },
  {
    id: "f-ens-shower",
    zoneId: "ensuite",
    type: "shower",
    label: "Душ",
    x: 845,
    y: 660,
    w: 45,
    h: 45,
    layer: "plumbing",
  },
  {
    id: "f-ens-sink",
    zoneId: "ensuite",
    type: "sink",
    label: "Умывальник",
    x: 795,
    y: 730,
    w: 55,
    h: 30,
    layer: "plumbing",
  },
  {
    id: "f-kitchen",
    zoneId: "kitchen",
    type: "kitchen",
    label: "Кухонный гарнитур",
    x: 210,
    y: 545,
    w: 240,
    h: 60,
    layer: "furniture",
  },
  {
    id: "f-kit-sink",
    zoneId: "kitchen",
    type: "sink",
    label: "Мойка",
    x: 230,
    y: 555,
    w: 48,
    h: 36,
    layer: "plumbing",
  },
  {
    id: "f-dining",
    zoneId: "kitchen",
    type: "table",
    label: "Стол обеденный",
    x: 420,
    y: 640,
    w: 140,
    h: 80,
    layer: "furniture",
  },
  {
    id: "f-sofa",
    zoneId: "living",
    type: "sofa",
    label: "Диван",
    x: 280,
    y: 860,
    w: 240,
    h: 90,
    layer: "furniture",
  },
  {
    id: "f-coffee",
    zoneId: "living",
    type: "table",
    label: "Журнальный стол",
    x: 340,
    y: 980,
    w: 100,
    h: 60,
    layer: "furniture",
  },
  {
    id: "f-tv",
    zoneId: "living",
    type: "tv",
    label: "ТВ-зона",
    x: 640,
    y: 920,
    w: 80,
    h: 32,
    layer: "furniture",
  },
  {
    id: "f-desk",
    zoneId: "office",
    type: "desk",
    label: "Письменный стол",
    x: 820,
    y: 300,
    w: 140,
    h: 70,
    layer: "furniture",
  },
  {
    id: "f-office-chair",
    zoneId: "office",
    type: "chair",
    label: "Кресло",
    x: 870,
    y: 390,
    w: 42,
    h: 42,
    layer: "furniture",
  },
  {
    id: "f-office-shelves",
    zoneId: "office",
    type: "shelves",
    label: "Стеллажи",
    x: 970,
    y: 300,
    w: 36,
    h: 180,
    layer: "furniture",
  },
  {
    id: "f-sofa404",
    zoneId: "living404",
    type: "sofa",
    label: "Диван",
    x: 1180,
    y: 450,
    w: 200,
    h: 85,
    layer: "furniture",
  },
  {
    id: "f-table404",
    zoneId: "living404",
    type: "table",
    label: "Столик",
    x: 1240,
    y: 560,
    w: 80,
    h: 55,
    layer: "furniture",
  },
  {
    id: "f-tub",
    zoneId: "bathMain",
    type: "tub",
    label: "Ванна",
    x: 1035,
    y: 640,
    w: 130,
    h: 70,
    layer: "plumbing",
  },
  {
    id: "f-bath-toilet",
    zoneId: "bathMain",
    type: "toilet",
    label: "Унитаз",
    x: 1035,
    y: 740,
    w: 36,
    h: 50,
    layer: "plumbing",
  },
  {
    id: "f-bath-sink",
    zoneId: "bathMain",
    type: "sink",
    label: "Умывальник",
    x: 1100,
    y: 750,
    w: 55,
    h: 30,
    layer: "plumbing",
  },
  {
    id: "f-washer",
    zoneId: "laundry",
    type: "washer",
    label: "Стиральная",
    x: 1200,
    y: 800,
    w: 55,
    h: 55,
    layer: "plumbing",
  },
  {
    id: "f-dryer",
    zoneId: "laundry",
    type: "dryer",
    label: "Сушильная",
    x: 1200,
    y: 870,
    w: 55,
    h: 55,
    layer: "plumbing",
  },
  {
    id: "f-laun-shelves",
    zoneId: "laundry",
    type: "shelves",
    label: "Полки",
    x: 1270,
    y: 810,
    w: 50,
    h: 140,
    layer: "furniture",
  },
  {
    id: "f-bowls",
    zoneId: "cats",
    type: "bowls",
    label: "Миски",
    x: 1040,
    y: 900,
    w: 50,
    h: 30,
    layer: "furniture",
  },
  {
    id: "f-litter",
    zoneId: "cats",
    type: "litter",
    label: "Умный лоток",
    x: 1110,
    y: 890,
    w: 55,
    h: 50,
    layer: "furniture",
  },
  {
    id: "f-cat-shelves",
    zoneId: "cats",
    type: "shelves",
    label: "Полки",
    x: 1040,
    y: 970,
    w: 120,
    h: 14,
    layer: "furniture",
  },
  {
    id: "f-storage-shelves",
    zoneId: "storage",
    type: "shelves",
    label: "Стеллаж",
    x: 1370,
    y: 820,
    w: 100,
    h: 160,
    layer: "furniture",
  },
  {
    id: "d-entry-403",
    zoneId: "hall",
    type: "door",
    label: "Главный вход (бывш. 403)",
    x: 840,
    y: 1170,
    w: 100,
    h: 14,
    layer: "doors",
    locked: true,
  },
  {
    id: "d-bal730",
    zoneId: "master",
    type: "door",
    label: "Выход на балкон 7.30",
    x: 400,
    y: 160,
    w: 55,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-bal390",
    zoneId: "kitchen",
    type: "door",
    label: "Выход на балкон 3.90",
    x: 181,
    y: 700,
    w: 10,
    h: 55,
    layer: "doors",
  },
  {
    id: "d-bal310",
    zoneId: "office",
    type: "door",
    label: "Выход на балкон 3.10",
    x: 860,
    y: 240,
    w: 50,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-bal480",
    zoneId: "living404",
    type: "door",
    label: "Выход на балкон 4.80",
    x: 1200,
    y: 320,
    w: 50,
    h: 10,
    layer: "doors",
  },
];

export const LEGEND_ITEMS = [
  { color: "rgba(170, 210, 160, 0.7)", label: "Жилая зона" },
  { color: "rgba(220, 200, 170, 0.7)", label: "Вспомогательная" },
  { color: "rgba(140, 190, 215, 0.7)", label: "Балкон" },
  { color: "#1a1a1a", label: "Чертёж / несущие (подложка)", swatch: "line" as const },
  { color: "#c45c26", label: "Новый проём", swatch: "dash" as const },
  { color: "#5a7a4a", label: "Новая лёгкая перегородка", swatch: "thin" as const },
  { color: "#888", label: "Заделка входа 404", swatch: "x" as const },
];

export const DEFAULT_LAYERS: Record<LayerId, boolean> = {
  furniture: true,
  plumbing: true,
  doors: true,
  labels: true,
  walls: true,
  plan: true,
};

export const DEFAULT_LABELS: Record<ZoneId, string> = Object.fromEntries(
  ZONES.map((z) => [z.id, z.label]),
) as Record<ZoneId, string>;

export type GlazeChoice = ZoneId | "undecided";

export interface PersistedState {
  furniture: FurnitureItem[];
  labels: Record<ZoneId, string>;
  layers: Record<LayerId, boolean>;
  glaze: GlazeChoice;
}

export function getDefaultState(): PersistedState {
  return {
    furniture: DEFAULT_FURNITURE.map((f) => ({ ...f })),
    labels: { ...DEFAULT_LABELS },
    layers: { ...DEFAULT_LAYERS },
    glaze: "undecided",
  };
}

export function livingArea(zones: Zone[] = ZONES): number {
  return zones.filter((z) => z.kind === "living").reduce((s, z) => s + z.area, 0);
}

export function auxiliaryArea(zones: Zone[] = ZONES): number {
  return zones
    .filter((z) => z.kind === "auxiliary")
    .reduce((s, z) => s + z.area, 0);
}

export function zoneById(id: ZoneId): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}
