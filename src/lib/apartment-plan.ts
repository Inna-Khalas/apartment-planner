/** Геометрия объединённой квартиры №403 + №404 — контур по исходным планам. */

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
  | "reference";

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
  layer: Exclude<LayerId, "labels" | "walls" | "reference">;
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

/** ViewBox подогнан под пропорции исходного плана (не квадратная «коробка»). */
export const VIEWBOX = { w: 1280, h: 1000 } as const;

export const STORAGE_KEY = "merged-apt-403-404-v2";

/** Исходник для выравнивания (полупрозрачный слой «Референс»). */
export const REFERENCE_IMAGE = {
  href: "/plans/plan-403-404-source-b.jpg",
  x: 20,
  y: 10,
  width: 1240,
  height: 920,
  opacity: 0.28,
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
 * Контур и комнаты прослежены по plan-403-404-source-b / sales-плану:
 * вертикальный запад, скруглённый СЗ-угол, ломаный морской фасад с уклоном вправо,
 * коридор и входы снизу.
 */
export const ZONES: Zone[] = [
  {
    id: "balcony730",
    label: "Балкон",
    area: 7.3,
    kind: "balcony",
    // L-обёртка: запад закругления + полоса вдоль наклонного фасада
    points: pts(
      [72, 210],
      [72, 95],
      [95, 55],
      [145, 32],
      [520, 88],
      [520, 148],
      [200, 105],
      [165, 115],
      [155, 160],
      [155, 210],
    ),
    fill: "#c5dce8",
    centroid: { x: 250, y: 95 },
  },
  {
    id: "balcony390",
    label: "Балкон",
    area: 3.9,
    kind: "balcony",
    // Западная лоджия у кухни-столовой (11.00) и гостиной
    points: pts([72, 480], [155, 480], [155, 720], [72, 720]),
    fill: "#c5dce8",
    centroid: { x: 112, y: 600 },
  },
  {
    id: "balcony310",
    label: "Балкон",
    area: 3.1,
    kind: "balcony",
    points: pts([560, 95], [740, 140], [740, 195], [560, 155]),
    fill: "#c5dce8",
    centroid: { x: 650, y: 145 },
  },
  {
    id: "balcony480",
    label: "Балкон",
    area: 4.8,
    kind: "balcony",
    points: pts([780, 150], [1085, 235], [1085, 295], [780, 210]),
    fill: "#c5dce8",
    centroid: { x: 930, y: 220 },
  },
  {
    id: "master",
    label: "Спальня 1 (мастер)",
    area: 15.5,
    kind: "living",
    // Трапеция: север по внутренней линии балкона 7.30
    points: pts(
      [155, 210],
      [155, 160],
      [165, 115],
      [200, 105],
      [520, 148],
      [520, 360],
      [155, 360],
    ),
    fill: "#cfe0c8",
    centroid: { x: 330, y: 240 },
  },
  {
    id: "wardrobe",
    label: "Гардероб",
    area: 2.8,
    kind: "auxiliary",
    points: pts([520, 148], [600, 162], [600, 260], [520, 260]),
    fill: "#e4d5c4",
    centroid: { x: 560, y: 205 },
  },
  {
    id: "ensuite",
    label: "С/у спальни",
    area: 2.2,
    kind: "auxiliary",
    points: pts([520, 260], [600, 260], [600, 360], [520, 360]),
    fill: "#e0d0c0",
    centroid: { x: 560, y: 310 },
  },
  {
    id: "kitchen",
    label: "Кухня-столовая",
    area: 11.0,
    kind: "auxiliary",
    // Бывшая комната 11.00 — выход к балкону 3.90
    points: pts([155, 360], [520, 360], [520, 520], [155, 520]),
    fill: "#e8dcc8",
    centroid: { x: 335, y: 440 },
  },
  {
    id: "living",
    label: "Гостиная",
    area: 20.0,
    kind: "living",
    points: pts([155, 520], [600, 520], [600, 760], [200, 760], [200, 720], [155, 720]),
    fill: "#c8dcb8",
    centroid: { x: 370, y: 640 },
  },
  {
    id: "office",
    label: "Кабинет / будущая спальня 2",
    area: 6.3,
    kind: "living",
    points: pts([600, 162], [740, 195], [740, 360], [600, 360]),
    fill: "#d2e2c6",
    centroid: { x: 670, y: 270 },
  },
  {
    id: "living404",
    label: "Зона отдыха",
    area: 12.0,
    kind: "living",
    // Неправильный многоугольник вдоль наклонного фасада 404
    points: pts(
      [600, 360],
      [740, 360],
      [740, 210],
      [780, 210],
      [1085, 295],
      [1085, 520],
      [820, 520],
      [820, 460],
      [600, 460],
    ),
    fill: "#c5d9b8",
    centroid: { x: 860, y: 380 },
  },
  {
    id: "bathMain",
    label: "Санузел с ванной",
    area: 4.8,
    kind: "auxiliary",
    points: pts([820, 520], [1000, 520], [1000, 680], [820, 680]),
    fill: "#e2d4c6",
    centroid: { x: 910, y: 600 },
  },
  {
    id: "laundry",
    label: "Прачечная",
    area: 3.2,
    kind: "auxiliary",
    points: pts([1000, 520], [1085, 520], [1085, 680], [1000, 680]),
    fill: "#ddd0c2",
    centroid: { x: 1042, y: 600 },
  },
  {
    id: "cats",
    label: "Зона котов",
    area: 2.1,
    kind: "auxiliary",
    points: pts([820, 680], [1000, 680], [1000, 760], [820, 760]),
    fill: "#f0e4d2",
    centroid: { x: 910, y: 705 },
  },
  {
    id: "storage",
    label: "Кладовая / техзона",
    area: 3.11,
    kind: "auxiliary",
    // Бывший вход №404 (заделан)
    points: pts([1000, 680], [1085, 680], [1085, 800], [1000, 800]),
    fill: "#d8cec2",
    centroid: { x: 1042, y: 740 },
  },
  {
    id: "hall",
    label: "Прихожая",
    area: 8.0,
    kind: "auxiliary",
    points: pts([600, 460], [820, 460], [820, 800], [560, 800], [560, 760], [600, 760]),
    fill: "#ebe0d4",
    centroid: { x: 700, y: 620 },
  },
];

/** Внешний контур — ломаный фасад, скругление СЗ, коридор снизу. */
export const EXTERIOR_PATH =
  "M72,720 L72,480 L155,480 L155,210 L155,160 C155,110 155,55 210,35 L500,85 L560,95 L740,140 L780,150 L1085,235 L1120,250 L1120,800 L1000,800 L1000,820 L560,820 L560,760 L200,760 L200,720 Z";

export const WALLS: WallSeg[] = [
  { id: "ext", kind: "exterior", d: EXTERIOR_PATH },
  // Несущая межквартирная стена (оставляем), проём в гостиной
  { id: "lb-demise-n", kind: "loadbearing", d: "M600,162 L600,460" },
  { id: "lb-demise-s", kind: "loadbearing", d: "M600,600 L600,760" },
  { id: "opening-main", kind: "opening", d: "M600,460 L600,600" },
  // Новые лёгкие перегородки
  { id: "new-ward-w", kind: "newPartition", d: "M520,148 L520,360" },
  { id: "new-ward-mid", kind: "newPartition", d: "M520,260 L600,260" },
  { id: "new-ward-e", kind: "newPartition", d: "M600,162 L600,360" },
  { id: "new-office-s", kind: "partition", d: "M600,360 L740,360" },
  { id: "new-office-e", kind: "partition", d: "M740,195 L740,360" },
  { id: "part-kit-n", kind: "partition", d: "M155,360 L520,360" },
  { id: "part-liv-n", kind: "partition", d: "M155,520 L600,520" },
  { id: "part-404-liv", kind: "partition", d: "M820,460 L820,760" },
  { id: "part-bath-n", kind: "partition", d: "M820,520 L1085,520" },
  { id: "new-laun-w", kind: "newPartition", d: "M1000,520 L1000,800" },
  { id: "new-cat-n", kind: "newPartition", d: "M820,680 L1000,680" },
  { id: "seal-404", kind: "demolish", d: "M1040,800 L1085,800" },
  // Внутренняя грань балконов / витражи
  { id: "glaze-730", kind: "partition", d: "M155,210 L155,160 L165,115 L200,105 L520,148" },
  { id: "glaze-310", kind: "partition", d: "M560,155 L740,195" },
  { id: "glaze-480", kind: "partition", d: "M780,210 L1085,295" },
  { id: "glaze-390", kind: "partition", d: "M155,480 L155,720" },
];

export const COLUMNS: Point[] = [
  { x: 520, y: 360 },
  { x: 600, y: 360 },
  { x: 600, y: 520 },
  { x: 740, y: 360 },
  { x: 820, y: 520 },
  { x: 600, y: 760 },
];

export const WINDOWS: WindowMark[] = [
  { id: "w-bal730-n", x: 220, y: 48, w: 220, h: 10, rotation: 8 },
  { id: "w-bal730-w", x: 68, y: 120, w: 10, h: 70 },
  { id: "w-master", x: 280, y: 118, w: 140, h: 8, rotation: 8 },
  { id: "w-bal310", x: 600, y: 115, w: 100, h: 10, rotation: 12 },
  { id: "w-office", x: 640, y: 175, w: 80, h: 8, rotation: 12 },
  { id: "w-bal480", x: 860, y: 175, w: 160, h: 10, rotation: 14 },
  { id: "w-liv404", x: 900, y: 268, w: 120, h: 8, rotation: 14 },
  { id: "w-bal390", x: 68, y: 520, w: 10, h: 140 },
  { id: "w-kit", x: 151, y: 400, w: 10, h: 70 },
];

export const DEFAULT_FURNITURE: FurnitureItem[] = [
  {
    id: "f-bed",
    zoneId: "master",
    type: "bed",
    label: "Кровать 160",
    x: 230,
    y: 195,
    w: 160,
    h: 140,
    layer: "furniture",
  },
  {
    id: "f-bedside-l",
    zoneId: "master",
    type: "shelves",
    label: "Тумба",
    x: 200,
    y: 205,
    w: 26,
    h: 36,
    layer: "furniture",
  },
  {
    id: "f-bedside-r",
    zoneId: "master",
    type: "shelves",
    label: "Тумба",
    x: 395,
    y: 205,
    w: 26,
    h: 36,
    layer: "furniture",
  },
  {
    id: "f-wardrobe",
    zoneId: "wardrobe",
    type: "wardrobe",
    label: "Гардероб",
    x: 528,
    y: 170,
    w: 62,
    h: 78,
    layer: "furniture",
  },
  {
    id: "f-ens-toilet",
    zoneId: "ensuite",
    type: "toilet",
    label: "Унитаз",
    x: 530,
    y: 275,
    w: 34,
    h: 48,
    layer: "plumbing",
  },
  {
    id: "f-ens-sink",
    zoneId: "ensuite",
    type: "sink",
    label: "Умывальник",
    x: 530,
    y: 330,
    w: 54,
    h: 26,
    layer: "plumbing",
  },
  {
    id: "f-ens-shower",
    zoneId: "ensuite",
    type: "shower",
    label: "Душ",
    x: 555,
    y: 275,
    w: 38,
    h: 38,
    layer: "plumbing",
  },
  {
    id: "f-kitchen",
    zoneId: "kitchen",
    type: "kitchen",
    label: "Кухонный гарнитур",
    x: 170,
    y: 375,
    w: 190,
    h: 52,
    layer: "furniture",
  },
  {
    id: "f-kit-sink",
    zoneId: "kitchen",
    type: "sink",
    label: "Мойка",
    x: 180,
    y: 382,
    w: 42,
    h: 32,
    layer: "plumbing",
  },
  {
    id: "f-dining",
    zoneId: "kitchen",
    type: "table",
    label: "Стол обеденный",
    x: 320,
    y: 430,
    w: 120,
    h: 68,
    layer: "furniture",
  },
  {
    id: "f-sofa",
    zoneId: "living",
    type: "sofa",
    label: "Диван",
    x: 220,
    y: 560,
    w: 200,
    h: 78,
    layer: "furniture",
  },
  {
    id: "f-coffee",
    zoneId: "living",
    type: "table",
    label: "Журнальный стол",
    x: 270,
    y: 655,
    w: 80,
    h: 48,
    layer: "furniture",
  },
  {
    id: "f-tv",
    zoneId: "living",
    type: "tv",
    label: "ТВ-зона",
    x: 500,
    y: 600,
    w: 70,
    h: 28,
    layer: "furniture",
  },
  {
    id: "f-desk",
    zoneId: "office",
    type: "desk",
    label: "Письменный стол",
    x: 620,
    y: 210,
    w: 100,
    h: 55,
    layer: "furniture",
  },
  {
    id: "f-office-chair",
    zoneId: "office",
    type: "chair",
    label: "Кресло",
    x: 650,
    y: 275,
    w: 38,
    h: 38,
    layer: "furniture",
  },
  {
    id: "f-office-shelves",
    zoneId: "office",
    type: "shelves",
    label: "Стеллажи",
    x: 705,
    y: 210,
    w: 28,
    h: 130,
    layer: "furniture",
  },
  {
    id: "f-sofa404",
    zoneId: "living404",
    type: "sofa",
    label: "Диван",
    x: 860,
    y: 340,
    w: 150,
    h: 68,
    layer: "furniture",
  },
  {
    id: "f-table404",
    zoneId: "living404",
    type: "table",
    label: "Столик",
    x: 900,
    y: 430,
    w: 70,
    h: 48,
    layer: "furniture",
  },
  {
    id: "f-tub",
    zoneId: "bathMain",
    type: "tub",
    label: "Ванна",
    x: 835,
    y: 540,
    w: 145,
    h: 68,
    layer: "plumbing",
  },
  {
    id: "f-bath-toilet",
    zoneId: "bathMain",
    type: "toilet",
    label: "Унитаз",
    x: 835,
    y: 620,
    w: 34,
    h: 48,
    layer: "plumbing",
  },
  {
    id: "f-bath-sink",
    zoneId: "bathMain",
    type: "sink",
    label: "Умывальник",
    x: 920,
    y: 630,
    w: 52,
    h: 28,
    layer: "plumbing",
  },
  {
    id: "f-washer",
    zoneId: "laundry",
    type: "washer",
    label: "Стиральная",
    x: 1012,
    y: 540,
    w: 52,
    h: 52,
    layer: "plumbing",
  },
  {
    id: "f-dryer",
    zoneId: "laundry",
    type: "dryer",
    label: "Сушильная",
    x: 1012,
    y: 600,
    w: 52,
    h: 52,
    layer: "plumbing",
  },
  {
    id: "f-laun-shelves",
    zoneId: "laundry",
    type: "shelves",
    label: "Полки",
    x: 1015,
    y: 658,
    w: 50,
    h: 14,
    layer: "furniture",
  },
  {
    id: "f-bowls",
    zoneId: "cats",
    type: "bowls",
    label: "Миски",
    x: 840,
    y: 722,
    w: 48,
    h: 28,
    layer: "furniture",
  },
  {
    id: "f-litter",
    zoneId: "cats",
    type: "litter",
    label: "Умный лоток",
    x: 905,
    y: 718,
    w: 70,
    h: 36,
    layer: "furniture",
  },
  {
    id: "f-cat-shelves",
    zoneId: "cats",
    type: "shelves",
    label: "Полки",
    x: 840,
    y: 745,
    w: 145,
    h: 12,
    layer: "furniture",
  },
  {
    id: "f-storage-shelves",
    zoneId: "storage",
    type: "shelves",
    label: "Стеллаж",
    x: 1012,
    y: 700,
    w: 55,
    h: 80,
    layer: "furniture",
  },
  {
    id: "d-entry-403",
    zoneId: "hall",
    type: "door",
    label: "Главный вход (бывш. 403)",
    x: 620,
    y: 808,
    w: 90,
    h: 12,
    layer: "doors",
    locked: true,
  },
  {
    id: "d-master",
    zoneId: "master",
    type: "door",
    label: "Дверь в спальню",
    x: 430,
    y: 354,
    w: 55,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-kitchen",
    zoneId: "kitchen",
    type: "door",
    label: "Дверь на кухню",
    x: 360,
    y: 514,
    w: 55,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-office",
    zoneId: "office",
    type: "door",
    label: "Дверь в кабинет",
    x: 650,
    y: 354,
    w: 55,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-bath",
    zoneId: "bathMain",
    type: "door",
    label: "Дверь в с/у",
    x: 814,
    y: 580,
    w: 10,
    h: 48,
    layer: "doors",
  },
  {
    id: "d-bal730",
    zoneId: "master",
    type: "door",
    label: "Выход на балкон 7.30",
    x: 280,
    y: 118,
    w: 48,
    h: 8,
    layer: "doors",
  },
  {
    id: "d-bal390",
    zoneId: "kitchen",
    type: "door",
    label: "Выход на балкон 3.90",
    x: 151,
    y: 485,
    w: 8,
    h: 45,
    layer: "doors",
  },
  {
    id: "d-bal310",
    zoneId: "office",
    type: "door",
    label: "Выход на балкон 3.10",
    x: 640,
    y: 178,
    w: 48,
    h: 8,
    layer: "doors",
  },
  {
    id: "d-bal480",
    zoneId: "living404",
    type: "door",
    label: "Выход на балкон 4.80",
    x: 900,
    y: 268,
    w: 48,
    h: 8,
    layer: "doors",
  },
];

export const LEGEND_ITEMS = [
  { color: "#cfe0c8", label: "Жилая зона" },
  { color: "#e8dcc8", label: "Вспомогательная" },
  { color: "#c5dce8", label: "Балкон" },
  { color: "#1a1a1a", label: "Несущая стена / колонна", swatch: "line" as const },
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
  reference: false,
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
