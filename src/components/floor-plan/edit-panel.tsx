"use client";

import {
  BALCONY_IDS,
  ZONES,
  type GlazeChoice,
  type LayerId,
  type ZoneId,
} from "@/lib/apartment-plan";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const LAYER_LABELS: Record<LayerId, string> = {
  plan: "Чертёж (подложка)",
  furniture: "Мебель",
  plumbing: "Сантехника",
  doors: "Двери",
  labels: "Подписи",
  walls: "Правки объединения",
};

interface Props {
  editMode: boolean;
  onEditModeChange: (v: boolean) => void;
  layers: Record<LayerId, boolean>;
  onToggleLayer: (id: LayerId) => void;
  labels: Record<ZoneId, string>;
  onLabelChange: (id: ZoneId, value: string) => void;
  glaze: GlazeChoice;
  onGlazeChange: (v: GlazeChoice) => void;
  selectedZone: ZoneId | null;
  onReset: () => void;
}

export function EditPanel({
  editMode,
  onEditModeChange,
  layers,
  onToggleLayer,
  labels,
  onLabelChange,
  glaze,
  onGlazeChange,
  selectedZone,
  onReset,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-[#1a2e28]">
            Редактирование
          </h3>
          <p className="text-[11px] text-[#5a655e]">
            Лёгкий режим — не CAD. Сохраняется в браузере.
          </p>
        </div>
        <Switch
          checked={editMode}
          onCheckedChange={onEditModeChange}
          aria-label="Режим редактирования"
        />
      </div>

      <Separator className="bg-[#c8bda8]/50" />

      <div className="space-y-2">
        <p className="text-[12px] font-medium text-[#1a2e28]">Слои</p>
        {(Object.keys(LAYER_LABELS) as LayerId[]).map((id) => (
          <div key={id} className="flex items-center justify-between">
            <Label htmlFor={`layer-${id}`} className="text-[13px] font-normal">
              {LAYER_LABELS[id]}
            </Label>
            <Switch
              id={`layer-${id}`}
              checked={layers[id]}
              onCheckedChange={() => onToggleLayer(id)}
            />
          </div>
        ))}
      </div>

      <Separator className="bg-[#c8bda8]/50" />

      <div className="space-y-2">
        <p className="text-[12px] font-medium text-[#1a2e28]">
          Остекление балкона
        </p>
        <p className="text-[11px] text-[#5a655e]">
          Один кандидат или «ещё не решили»
        </p>
        <div className="flex flex-col gap-1.5">
          <GlazeOption
            active={glaze === "undecided"}
            onClick={() => onGlazeChange("undecided")}
            label="Ещё не решили"
          />
          {BALCONY_IDS.map((id) => {
            const z = ZONES.find((zone) => zone.id === id)!;
            return (
              <GlazeOption
                key={id}
                active={glaze === id}
                onClick={() => onGlazeChange(id)}
                label={`${labels[id]} · ${z.area.toFixed(2)} м²`}
              />
            );
          })}
        </div>
      </div>

      {editMode && selectedZone && (
        <>
          <Separator className="bg-[#c8bda8]/50" />
          <div className="space-y-2">
            <Label htmlFor="zone-label" className="text-[12px]">
              Подпись зоны
            </Label>
            <Input
              id="zone-label"
              value={labels[selectedZone]}
              onChange={(e) => onLabelChange(selectedZone, e.target.value)}
              className="border-[#c8bda8] bg-white/70"
            />
            <p className="text-[11px] text-[#5a655e]">
              Перетаскивайте мебель на плане в режиме редактирования.
            </p>
          </div>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={onReset}
        className="w-full border-[#c8bda8] text-[#1a2e28]"
      >
        Сбросить изменения
      </Button>
    </div>
  );
}

function GlazeOption({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md border px-2.5 py-1.5 text-left text-[12px] transition-colors ${
        active
          ? "border-[#0b6e99] bg-[#cfe4ef] text-[#0b6e99]"
          : "border-[#c8bda8]/70 bg-white/40 text-[#2a3530] hover:bg-white/70"
      }`}
    >
      {label}
    </button>
  );
}
