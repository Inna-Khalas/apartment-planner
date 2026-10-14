import {
  AREA,
  BALCONY_IDS,
  ZONES,
  type GlazeChoice,
  type ZoneId,
} from "@/lib/apartment-plan";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Props {
  selectedZone: ZoneId | null;
  glaze: GlazeChoice;
  labels: Record<ZoneId, string>;
}

export function SummaryPanel({ selectedZone, glaze, labels }: Props) {
  const selected = ZONES.find((z) => z.id === selectedZone);
  const glazeZone =
    glaze !== "undecided" ? ZONES.find((z) => z.id === glaze) : null;

  return (
    <div className="space-y-3">
      <h3 className="font-[family-name:var(--font-display)] text-sm font-semibold tracking-wide text-[#1a2e28]">
        Сводка площадей
      </h3>

      <div className="grid grid-cols-2 gap-2 text-[13px]">
        <Stat label="Без балконов" value={`${AREA.withoutBalconies} м²`} accent />
        <Stat label="Балконы" value={`${AREA.balconies.toFixed(2)} м²`} />
        <Stat label="Жилая" value={`${AREA.living.toFixed(2)} м²`} />
        <Stat label="Вспомогательная" value={`${AREA.auxiliary.toFixed(2)} м²`} />
      </div>

      <p className="text-[11px] leading-relaxed text-[#5a655e]">
        Исходные: №403 = {AREA.apt403} · №404 = {AREA.apt404} · сумма с балконами{" "}
        {AREA.sumWithBalconies} м²
      </p>

      <Separator className="bg-[#c8bda8]/50" />

      <div className="space-y-1.5">
        <p className="text-[12px] font-medium text-[#1a2e28]">Балконы</p>
        <ul className="space-y-1 text-[12px] text-[#2a3530]">
          {BALCONY_IDS.map((id) => {
            const z = ZONES.find((zone) => zone.id === id)!;
            return (
              <li key={id} className="flex items-center justify-between gap-2">
                <span>
                  {labels[id]} {z.area.toFixed(2)}
                </span>
                {glaze === id ? (
                  <Badge
                    variant="secondary"
                    className="bg-[#cfe4ef] text-[#0b6e99]"
                  >
                    остекление
                  </Badge>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-[#5a655e]">
          Остекление:{" "}
          {glazeZone
            ? `${labels[glazeZone.id]} ${glazeZone.area.toFixed(2)} м²`
            : "ещё не решили"}
        </p>
      </div>

      {selected && (
        <>
          <Separator className="bg-[#c8bda8]/50" />
          <div className="rounded-lg bg-[#1a2e28]/5 px-3 py-2">
            <p className="text-[11px] uppercase tracking-wider text-[#5a655e]">
              Выбрано
            </p>
            <p className="font-[family-name:var(--font-display)] text-sm font-semibold text-[#1a2e28]">
              {labels[selected.id]}
            </p>
            <p className="text-[13px] text-[#2a3530]">
              {selected.area.toFixed(2)} м² ·{" "}
              {selected.kind === "living"
                ? "жилая"
                : selected.kind === "balcony"
                  ? "балкон"
                  : "вспомогательная"}
            </p>
          </div>
        </>
      )}
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-lg px-2.5 py-2 ${
        accent ? "bg-[#0f6b5c]/10" : "bg-[#1a2e28]/4"
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-[#5a655e]">
        {label}
      </p>
      <p
        className={`font-[family-name:var(--font-display)] text-base font-semibold ${
          accent ? "text-[#0f6b5c]" : "text-[#1a2e28]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
