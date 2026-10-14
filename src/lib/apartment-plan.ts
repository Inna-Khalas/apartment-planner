/** Геометрия объединённой квартиры №403 + №404 (концепт, не БТИ). */

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

export type LayerId = "furniture" | "plumbing" | "doors" | "labels" | "walls";

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
  /** SVG polygon points "x,y x,y ..." */
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
  layer: Exclude<LayerId, "labels" | "walls">;
  /** Нельзя перетаскивать (колонны, несущие) */
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

export const VIEWBOX = { w: 1180, h: 860 } as const;

export const STORAGE_KEY = "merged-apt-403-404-v1";

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

export const ZONE_COLORS: Record<ZoneKind, string> = {
  living: "#d8e8d4",
  auxiliary: "#e8ddd0",
  balcony: "#cfe4ef",
};

/** Зоны объединённой планировки — топология по вашим чертежам. */
export const ZONES: Zone[] = [
  {
    id: "balcony730",
    label: "Балкон",
    area: 7.3,
    kind: "balcony",
    points: "40,40 320,40 320,118 210,118 210,210 40,210",
    fill: "#c5dce8",
    centroid: { x: 150, y: 100 },
  },
  {
    id: "balcony390",
    label: "Балкон",
    area: 3.9,
    kind: "balcony",
    points: "40,430 155,430 155,560 40,560",
    fill: "#c5dce8",
    centroid: { x: 97, y: 495 },
  },
  {
    id: "balcony310",
    label: "Балкон",
    area: 3.1,
    kind: "balcony",
    points: "520,40 680,40 680,118 520,118",
    fill: "#c5dce8",
    centroid: { x: 600, y: 79 },
  },
  {
    id: "balcony480",
    label: "Балкон",
    area: 4.8,
    kind: "balcony",
    points: "820,40 1080,40 1080,118 820,118",
    fill: "#c5dce8",
    centroid: { x: 950, y: 79 },
  },
  {
    id: "master",
    label: "Спальня 1 (мастер)",
    area: 15.5,
    kind: "living",
    points: "210,118 500,118 500,340 210,340",
    fill: "#cfe0c8",
    centroid: { x: 340, y: 220 },
  },
  {
    id: "wardrobe",
    label: "Гардероб",
    area: 2.8,
    kind: "auxiliary",
    points: "500,118 580,118 580,220 500,220",
    fill: "#e4d5c4",
    centroid: { x: 540, y: 169 },
  },
  {
    id: "ensuite",
    label: "С/у спальни",
    area: 2.2,
    kind: "auxiliary",
    points: "500,220 580,220 580,340 500,340",
    fill: "#e0d0c0",
    centroid: { x: 540, y: 280 },
  },
  {
    id: "kitchen",
    label: "Кухня-столовая",
    area: 11.0,
    kind: "auxiliary",
    points: "155,340 500,340 500,520 155,520",
    fill: "#e8dcc8",
    centroid: { x: 327, y: 430 },
  },
  {
    id: "living",
    label: "Гостиная",
    area: 20.0,
    kind: "living",
    points: "155,520 580,520 580,720 155,720",
    fill: "#c8dcb8",
    centroid: { x: 367, y: 620 },
  },
  {
    id: "office",
    label: "Кабинет / будущая спальня 2",
    area: 6.3,
    kind: "living",
    points: "580,118 820,118 820,320 580,320",
    fill: "#d2e2c6",
    centroid: { x: 700, y: 219 },
  },
  {
    id: "living404",
    label: "Зона отдыха",
    area: 12.0,
    kind: "living",
    points: "580,320 1080,320 1080,520 820,520 820,420 580,420",
    fill: "#c5d9b8",
    centroid: { x: 820, y: 400 },
  },
  {
    id: "bathMain",
    label: "Санузел с ванной",
    area: 4.8,
    kind: "auxiliary",
    points: "820,520 1000,520 1000,680 820,680",
    fill: "#e2d4c6",
    centroid: { x: 910, y: 600 },
  },
  {
    id: "laundry",
    label: "Прачечная",
    area: 3.2,
    kind: "auxiliary",
    points: "1000,520 1080,520 1080,680 1000,680",
    fill: "#ddd0c2",
    centroid: { x: 1040, y: 600 },
  },
  {
    id: "cats",
    label: "Зона котов",
    area: 2.1,
    kind: "auxiliary",
    // Ниша у прачечной / прихожей (спека)
    points: "820,680 1000,680 1000,760 820,760",
    fill: "#f0e4d2",
    centroid: { x: 910, y: 702 },
  },
  {
    id: "storage",
    label: "Кладовая / техзона",
    area: 3.11,
    kind: "auxiliary",
    points: "1000,680 1080,680 1080,760 1000,760",
    fill: "#d8cec2",
    centroid: { x: 1040, y: 720 },
  },
  {
    id: "hall",
    label: "Прихожая",
    area: 8.0,
    kind: "auxiliary",
    points: "580,420 820,420 820,760 580,760",
    fill: "#ebe0d4",
    centroid: { x: 700, y: 590 },
  },
];

export const WALLS: WallSeg[] = [
  // Exterior outline
  {
    id: "ext-n",
    kind: "exterior",
    d: "M40,40 L320,40 L320,118 L520,118 L520,40 L680,40 L680,118 L820,118 L820,40 L1080,40 L1080,760 L820,760 L820,780 L580,780 L580,760 L155,760 L155,560 L40,560 L40,430 L155,430 L155,340 L210,340 L210,210 L40,210 Z",
  },
  // Demising / load-bearing vertical (kept, with opening)
  { id: "lb-demise-n", kind: "loadbearing", d: "M580,118 L580,420" },
  { id: "lb-demise-s", kind: "loadbearing", d: "M580,560 L580,760" },
  // Opening in demising wall (living zone)
  { id: "opening-main", kind: "opening", d: "M580,420 L580,560" },
  // New light partitions
  { id: "new-ward-n", kind: "newPartition", d: "M500,118 L580,118" },
  { id: "new-ward-w", kind: "newPartition", d: "M500,118 L500,340" },
  { id: "new-ward-mid", kind: "newPartition", d: "M500,220 L580,220" },
  { id: "new-ens-s", kind: "newPartition", d: "M500,340 L580,340" },
  { id: "new-office-s", kind: "partition", d: "M580,320 L820,320" },
  { id: "new-office-e", kind: "partition", d: "M820,118 L820,320" },
  { id: "new-bath-n", kind: "partition", d: "M820,520 L1080,520" },
  { id: "new-bath-w", kind: "partition", d: "M820,520 L820,760" },
  { id: "new-laun-w", kind: "newPartition", d: "M1000,520 L1000,760" },
  { id: "new-cat-n", kind: "newPartition", d: "M820,680 L1080,680" },
  { id: "new-hall-e", kind: "partition", d: "M820,420 L820,520" },
  // Sealed former 404 entrance (right side)
  { id: "seal-404", kind: "demolish", d: "M1080,700 L1080,740" },
  // Interior existing
  { id: "part-kit-n", kind: "partition", d: "M155,340 L500,340" },
  { id: "part-liv-n", kind: "partition", d: "M155,520 L580,520" },
  { id: "part-mas-e-open", kind: "partition", d: "M500,340 L580,340" },
];

export const COLUMNS: Point[] = [
  { x: 500, y: 340 },
  { x: 580, y: 340 },
  { x: 580, y: 520 },
  { x: 820, y: 320 },
  { x: 820, y: 520 },
];

export const WINDOWS: WindowMark[] = [
  { id: "w-bal730-n", x: 80, y: 36, w: 200, h: 10 },
  { id: "w-bal730-w", x: 36, y: 70, w: 10, h: 100 },
  { id: "w-master-n", x: 260, y: 114, w: 160, h: 10 },
  { id: "w-bal310", x: 540, y: 36, w: 120, h: 10 },
  { id: "w-office-n", x: 620, y: 114, w: 140, h: 10 },
  { id: "w-bal480", x: 860, y: 36, w: 180, h: 10 },
  { id: "w-liv404-n", x: 880, y: 316, w: 140, h: 10 },
  { id: "w-bal390-w", x: 36, y: 450, w: 10, h: 80 },
  { id: "w-kit-w", x: 151, y: 380, w: 10, h: 100 },
];

export const DEFAULT_FURNITURE: FurnitureItem[] = [
  // Master
  {
    id: "f-bed",
    zoneId: "master",
    type: "bed",
    label: "Кровать 160",
    x: 250,
    y: 170,
    w: 160,
    h: 200,
    layer: "furniture",
  },
  {
    id: "f-bedside-l",
    zoneId: "master",
    type: "shelves",
    label: "Тумба",
    x: 220,
    y: 180,
    w: 28,
    h: 40,
    layer: "furniture",
  },
  {
    id: "f-bedside-r",
    zoneId: "master",
    type: "shelves",
    label: "Тумба",
    x: 412,
    y: 180,
    w: 28,
    h: 40,
    layer: "furniture",
  },
  // Wardrobe
  {
    id: "f-wardrobe",
    zoneId: "wardrobe",
    type: "wardrobe",
    label: "Гардероб",
    x: 508,
    y: 130,
    w: 64,
    h: 80,
    layer: "furniture",
  },
  // Ensuite
  {
    id: "f-ens-toilet",
    zoneId: "ensuite",
    type: "toilet",
    label: "Унитаз",
    x: 512,
    y: 240,
    w: 36,
    h: 50,
    layer: "plumbing",
  },
  {
    id: "f-ens-sink",
    zoneId: "ensuite",
    type: "sink",
    label: "Умывальник",
    x: 512,
    y: 300,
    w: 56,
    h: 28,
    layer: "plumbing",
  },
  {
    id: "f-ens-shower",
    zoneId: "ensuite",
    type: "shower",
    label: "Душ",
    x: 530,
    y: 250,
    w: 42,
    h: 42,
    layer: "plumbing",
  },
  // Kitchen
  {
    id: "f-kitchen",
    zoneId: "kitchen",
    type: "kitchen",
    label: "Кухонный гарнитур",
    x: 170,
    y: 355,
    w: 200,
    h: 55,
    layer: "furniture",
  },
  {
    id: "f-dining",
    zoneId: "kitchen",
    type: "table",
    label: "Стол обеденный",
    x: 320,
    y: 430,
    w: 120,
    h: 70,
    layer: "furniture",
  },
  {
    id: "f-kit-sink",
    zoneId: "kitchen",
    type: "sink",
    label: "Мойка",
    x: 180,
    y: 365,
    w: 45,
    h: 35,
    layer: "plumbing",
  },
  // Living 403
  {
    id: "f-sofa",
    zoneId: "living",
    type: "sofa",
    label: "Диван",
    x: 200,
    y: 560,
    w: 200,
    h: 80,
    layer: "furniture",
  },
  {
    id: "f-coffee",
    zoneId: "living",
    type: "table",
    label: "Журнальный стол",
    x: 260,
    y: 650,
    w: 80,
    h: 50,
    layer: "furniture",
  },
  {
    id: "f-tv",
    zoneId: "living",
    type: "tv",
    label: "ТВ-зона",
    x: 480,
    y: 580,
    w: 70,
    h: 30,
    layer: "furniture",
  },
  // Office — desk + shelves, NO bed by default
  {
    id: "f-desk",
    zoneId: "office",
    type: "desk",
    label: "Письменный стол",
    x: 620,
    y: 160,
    w: 140,
    h: 60,
    layer: "furniture",
  },
  {
    id: "f-office-chair",
    zoneId: "office",
    type: "chair",
    label: "Кресло",
    x: 670,
    y: 230,
    w: 40,
    h: 40,
    layer: "furniture",
  },
  {
    id: "f-office-shelves",
    zoneId: "office",
    type: "shelves",
    label: "Стеллажи",
    x: 780,
    y: 140,
    w: 30,
    h: 150,
    layer: "furniture",
  },
  // Living 404
  {
    id: "f-sofa404",
    zoneId: "living404",
    type: "sofa",
    label: "Диван",
    x: 860,
    y: 360,
    w: 160,
    h: 70,
    layer: "furniture",
  },
  {
    id: "f-table404",
    zoneId: "living404",
    type: "table",
    label: "Столик",
    x: 900,
    y: 450,
    w: 70,
    h: 50,
    layer: "furniture",
  },
  // Main bath
  {
    id: "f-tub",
    zoneId: "bathMain",
    type: "tub",
    label: "Ванна",
    x: 835,
    y: 540,
    w: 150,
    h: 70,
    layer: "plumbing",
  },
  {
    id: "f-bath-toilet",
    zoneId: "bathMain",
    type: "toilet",
    label: "Унитаз",
    x: 835,
    y: 620,
    w: 36,
    h: 50,
    layer: "plumbing",
  },
  {
    id: "f-bath-sink",
    zoneId: "bathMain",
    type: "sink",
    label: "Умывальник",
    x: 920,
    y: 630,
    w: 55,
    h: 30,
    layer: "plumbing",
  },
  // Laundry — stacked W/D + shelves
  {
    id: "f-washer",
    zoneId: "laundry",
    type: "washer",
    label: "Стиральная",
    x: 1010,
    y: 540,
    w: 55,
    h: 55,
    layer: "plumbing",
  },
  {
    id: "f-dryer",
    zoneId: "laundry",
    type: "dryer",
    label: "Сушильная",
    x: 1010,
    y: 600,
    w: 55,
    h: 55,
    layer: "plumbing",
  },
  {
    id: "f-laun-shelves",
    zoneId: "laundry",
    type: "shelves",
    label: "Полки",
    x: 1015,
    y: 660,
    w: 50,
    h: 15,
    layer: "furniture",
  },
  // Cats — миски, умный лоток, полки (подпись зоны сверху, мебель снизу)
  {
    id: "f-bowls",
    zoneId: "cats",
    type: "bowls",
    label: "Миски",
    x: 835,
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
    x: 900,
    y: 718,
    w: 72,
    h: 36,
    layer: "furniture",
  },
  {
    id: "f-cat-shelves",
    zoneId: "cats",
    type: "shelves",
    label: "Полки",
    x: 835,
    y: 745,
    w: 150,
    h: 12,
    layer: "furniture",
  },
  // Storage (sealed 404 entrance)
  {
    id: "f-storage-shelves",
    zoneId: "storage",
    type: "shelves",
    label: "Стеллаж",
    x: 1010,
    y: 695,
    w: 55,
    h: 50,
    layer: "furniture",
  },
  // Doors
  {
    id: "d-entry-403",
    zoneId: "hall",
    type: "door",
    label: "Главный вход (бывш. 403)",
    x: 640,
    y: 755,
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
    y: 334,
    w: 60,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-kitchen",
    zoneId: "kitchen",
    type: "door",
    label: "Дверь на кухню",
    x: 380,
    y: 514,
    w: 60,
    h: 10,
    layer: "doors",
  },
  {
    id: "d-office",
    zoneId: "office",
    type: "door",
    label: "Дверь в кабинет",
    x: 700,
    y: 314,
    w: 60,
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
    h: 50,
    layer: "doors",
  },
  {
    id: "d-bal730",
    zoneId: "master",
    type: "door",
    label: "Выход на балкон 7.30",
    x: 250,
    y: 114,
    w: 50,
    h: 8,
    layer: "doors",
  },
  {
    id: "d-bal390",
    zoneId: "kitchen",
    type: "door",
    label: "Выход на балкон 3.90",
    x: 151,
    y: 450,
    w: 8,
    h: 45,
    layer: "doors",
  },
  {
    id: "d-bal310",
    zoneId: "office",
    type: "door",
    label: "Выход на балкон 3.10",
    x: 620,
    y: 114,
    w: 50,
    h: 8,
    layer: "doors",
  },
  {
    id: "d-bal480",
    zoneId: "living404",
    type: "door",
    label: "Выход на балкон 4.80",
    x: 900,
    y: 314,
    w: 50,
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
  return zones
    .filter((z) => z.kind === "living")
    .reduce((s, z) => s + z.area, 0);
}

export function auxiliaryArea(zones: Zone[] = ZONES): number {
  return zones
    .filter((z) => z.kind === "auxiliary")
    .reduce((s, z) => s + z.area, 0);
}

export function zoneById(id: ZoneId): Zone | undefined {
  return ZONES.find((z) => z.id === id);
}
