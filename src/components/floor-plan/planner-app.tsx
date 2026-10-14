"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ZONES,
  getDefaultState,
  STORAGE_KEY,
  type FurnitureItem,
  type GlazeChoice,
  type LayerId,
  type PersistedState,
  type ZoneId,
} from "@/lib/apartment-plan";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EditPanel } from "./edit-panel";
import { FloorPlanLegend } from "./legend";
import { FloorPlanSvg } from "./floor-plan-svg";
import { SummaryPanel } from "./summary-panel";

export function PlannerApp() {
  const [state, setState] = useState<PersistedState>(getDefaultState);
  const [hydrated, setHydrated] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneId | null>(null);
  const [selectedFurniture, setSelectedFurniture] = useState<string | null>(
    null,
  );
  const [sideOpen, setSideOpen] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as PersistedState;
        setState({
          ...getDefaultState(),
          ...parsed,
          layers: { ...getDefaultState().layers, ...parsed.layers },
          labels: { ...getDefaultState().labels, ...parsed.labels },
        });
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  const onMoveFurniture = useCallback((id: string, x: number, y: number) => {
    setState((s) => ({
      ...s,
      furniture: s.furniture.map((f) =>
        f.id === id ? { ...f, x: Math.round(x), y: Math.round(y) } : f,
      ),
    }));
  }, []);

  const onToggleLayer = (id: LayerId) => {
    setState((s) => ({
      ...s,
      layers: { ...s.layers, [id]: !s.layers[id] },
    }));
  };

  const onLabelChange = (id: ZoneId, value: string) => {
    setState((s) => ({
      ...s,
      labels: { ...s.labels, [id]: value },
    }));
  };

  const onGlazeChange = (v: GlazeChoice) => {
    setState((s) => ({ ...s, glaze: v }));
  };

  const onReset = () => {
    setState(getDefaultState());
    setSelectedZone(null);
    setSelectedFurniture(null);
  };

  return (
    <TooltipProvider>
      <div className="flex min-h-dvh flex-col">
        <header className="relative z-10 border-b border-[#c8bda8]/50 bg-[#f7f3eb]/90 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="min-w-0">
              <p className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight text-[#1a2e28] md:text-xl">
                Планировщик 403+404
              </p>
              <p className="truncate text-[12px] text-[#5a655e] md:text-[13px]">
                Объединённая квартира ·{" "}
                <span className="font-semibold text-[#0f6b5c]">91.01 м²</span>{" "}
                без балконов · балконы 19.10 м² отдельно
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="secondary"
                className="bg-[#0f6b5c]/12 text-[#0f6b5c]"
              >
                концепт, не БТИ
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="border-[#c8bda8] md:hidden"
                onClick={() => setSideOpen((v) => !v)}
              >
                {sideOpen ? "Скрыть панель" : "Панель"}
              </Button>
            </div>
          </div>
        </header>

        <main className="relative mx-auto flex w-full max-w-[1600px] flex-1 flex-col gap-3 p-3 md:flex-row md:gap-4 md:p-5">
          <section className="relative min-h-[55dvh] flex-1 md:min-h-0">
            <FloorPlanSvg
              furniture={state.furniture as FurnitureItem[]}
              labels={state.labels}
              layers={state.layers}
              glaze={state.glaze}
              selectedZone={selectedZone}
              selectedFurniture={selectedFurniture}
              editMode={editMode}
              onSelectZone={setSelectedZone}
              onSelectFurniture={setSelectedFurniture}
              onMoveFurniture={onMoveFurniture}
            />
          </section>

          <aside
            className={`${
              sideOpen ? "flex" : "hidden"
            } w-full shrink-0 flex-col gap-3 md:flex md:w-[320px] lg:w-[340px]`}
          >
            <div className="planner-panel flex-1 overflow-y-auto p-4">
              <Tabs defaultValue="summary">
                <TabsList className="mb-3 grid w-full grid-cols-3 bg-[#1a2e28]/8">
                  <TabsTrigger value="summary">Сводка</TabsTrigger>
                  <TabsTrigger value="legend">Легенда</TabsTrigger>
                  <TabsTrigger value="edit">Правка</TabsTrigger>
                </TabsList>
                <TabsContent value="summary">
                  <SummaryPanel
                    selectedZone={selectedZone}
                    glaze={state.glaze}
                    labels={state.labels}
                  />
                </TabsContent>
                <TabsContent value="legend">
                  <FloorPlanLegend />
                  <Separator className="my-4 bg-[#c8bda8]/50" />
                  <ZoneList
                    labels={state.labels}
                    selected={selectedZone}
                    onSelect={setSelectedZone}
                  />
                </TabsContent>
                <TabsContent value="edit">
                  <EditPanel
                    editMode={editMode}
                    onEditModeChange={setEditMode}
                    layers={state.layers}
                    onToggleLayer={onToggleLayer}
                    labels={state.labels}
                    onLabelChange={onLabelChange}
                    glaze={state.glaze}
                    onGlazeChange={onGlazeChange}
                    selectedZone={selectedZone}
                    onReset={onReset}
                  />
                </TabsContent>
              </Tabs>
            </div>

            <p className="px-1 text-[11px] leading-relaxed text-[#5a655e]">
              Несущие стены и колонны сохраняются. Один широкий проём в
              межквартирной стене. Вход №404 заделан → кладовая/техзона. Это
              концепт для обсуждения, не проект для согласования в БТИ.
            </p>
          </aside>
        </main>
      </div>
    </TooltipProvider>
  );
}

function ZoneList({
  labels,
  selected,
  onSelect,
}: {
  labels: Record<ZoneId, string>;
  selected: ZoneId | null;
  onSelect: (id: ZoneId) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-[12px] font-medium text-[#1a2e28]">Зоны</p>
      <ul className="max-h-64 space-y-1 overflow-y-auto text-[12px]">
        {ZONES.filter((z) => z.kind !== "balcony").map((z) => (
          <li key={z.id}>
            <button
              type="button"
              onClick={() => onSelect(z.id)}
              className={`flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left transition-colors ${
                selected === z.id
                  ? "bg-[#0f6b5c]/15 text-[#0f6b5c]"
                  : "hover:bg-[#1a2e28]/5"
              }`}
            >
              <span className="truncate">{labels[z.id]}</span>
              <span className="tabular-nums text-[#5a655e]">
                {z.area.toFixed(2)}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
