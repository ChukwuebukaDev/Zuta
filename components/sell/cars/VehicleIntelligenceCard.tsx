"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Gauge,
  Globe2,
  Layers3,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { resolveVehicleIntelligence } from "@/app/modules/ai-search/knowledge/reference/vehicles/vehicle-intelligence";

export interface VehicleIntelligenceInput {
  brand: string;
  model: string;
  year: number;

  engineCode?: string | null;
  engineSize?: string | null;

  fuelType?: string | null;
  transmission?: string | null;
  drivetrain?: string | null;

  country?: string | null;
}

interface VehicleIntelligenceCardProps {
  vehicle: VehicleIntelligenceInput;
}

export default function VehicleIntelligenceCard({
  vehicle,
}: VehicleIntelligenceCardProps) {
  let intelligence: any = null;

  try {
    intelligence = resolveVehicleIntelligence({
      brand: vehicle.brand,
      model: vehicle.model,
      year: Number(vehicle.year),
        
      engineCode: vehicle.engineCode ?? undefined,
      engineSize: vehicle.engineSize ?? undefined,

      fuelType: vehicle.fuelType ?? undefined,
      transmission: vehicle.transmission ?? undefined,
      drivetrain: vehicle.drivetrain ?? undefined,

      country: vehicle.country ?? undefined,
    });
  } catch (error) {
    console.error("[VEHICLE_INTELLIGENCE_RESOLVER_ERROR]", error);
  }

  if (!intelligence) {
    return null;
  }

  const {
    identity,
    candidates = [],
    selection,
    decision,
    engineFacts,
  } = intelligence;

  const confidencePercent = Math.round(
    (decision?.confidence ?? selection?.confidence ?? 0) * 100
  );

  const configurationCoveragePercent = Math.round(
    (selection?.configurationCoverage ?? 0) * 100
  );

  const identificationStrengthPercent = Math.round(
    (selection?.identificationStrength ?? 0) * 100
  );

  const isAmbiguous =
    selection?.isAmbiguous || decision?.decision === "AMBIGUOUS";

  return (
    <div className="relative w-full max-h-[82vh] overflow-y-auto rounded-3xl sm:rounded-[2.5rem] border border-zinc-800/90 bg-zinc-950 text-white shadow-2xl p-5 sm:p-7 md:p-9 custom-scrollbar selection:bg-blue-600 selection:text-white">
      {/* Dynamic ambient lighting backdrop */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-indigo-600/10 blur-[100px]" />

      <div className="relative z-10 space-y-8">
        {/* =========================================================
            HEADER
        ========================================================= */}
        <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-950/60 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 backdrop-blur-md">
              <Sparkles size={11} className="text-blue-400 animate-pulse" />
              Zuta Intelligence Engine
            </div>

            <h2 className="mt-2 text-2xl font-black uppercase italic tracking-tighter sm:text-3xl text-white">
              Vehicle Intelligence
            </h2>

            <p className="mt-0.5 text-xs text-zinc-400">
              Evidence-backed vehicle telemetry & variant identification
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <StatusBadge
              icon={
                isAmbiguous ? (
                  <AlertTriangle size={13} />
                ) : (
                  <CheckCircle2 size={13} />
                )
              }
              label={
                isAmbiguous ? "Variant Ambiguous" : "Variant Identified"
              }
              warning={isAmbiguous}
            />

            {engineFacts && (
              <StatusBadge
                icon={<Cpu size={13} />}
                label="Engine Identified"
              />
            )}
          </div>
        </div>

        {/* =========================================================
            VEHICLE IDENTITY TILES
        ========================================================= */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <MetricTile
            icon={<Target size={15} />}
            label="Vehicle"
            value={`${identity?.brand ?? vehicle.brand} ${
              identity?.model ?? vehicle.model
            }`}
          />

          <MetricTile
            icon={<Layers3 size={15} />}
            label="Year"
            value={String(identity?.year ?? vehicle.year)}
          />

          <MetricTile
            icon={<Gauge size={15} />}
            label="Confidence"
            value={`${confidencePercent}%`}
            highlight
          />

          <MetricTile
            icon={<Trophy size={15} />}
            label="Candidates"
            value={String(candidates.length)}
          />
        </div>

        {/* =========================================================
            ANALYSIS METRICS PROGRESS BARS
        ========================================================= */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <ProgressTile
            icon={<Gauge size={15} />}
            label="Match Confidence"
            value={confidencePercent}
          />

          <ProgressTile
            icon={<Layers3 size={15} />}
            label="Configuration Coverage"
            value={configurationCoveragePercent}
          />

          <ProgressTile
            icon={<Target size={15} />}
            label="Identification Strength"
            value={identificationStrengthPercent}
          />
        </div>

        {/* =========================================================
            DECISION CARD
        ========================================================= */}
        {decision && (
          <div
            className={`rounded-2xl border p-4 sm:p-5 backdrop-blur-md ${
              isAmbiguous
                ? "border-amber-500/30 bg-amber-950/20 text-amber-200"
                : "border-emerald-500/30 bg-emerald-950/20 text-emerald-200"
            }`}
          >
            <div className="flex items-start gap-3">
              {isAmbiguous ? (
                <AlertTriangle
                  size={18}
                  className="mt-0.5 shrink-0 text-amber-400"
                />
              ) : (
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-400"
                />
              )}

              <div>
                <p
                  className={`text-[10px] font-black uppercase tracking-widest ${
                    isAmbiguous ? "text-amber-400" : "text-emerald-400"
                  }`}
                >
                  Vehicle Decision
                </p>

                <p className="mt-0.5 text-sm font-bold text-white">
                  {decision.decision}
                </p>

                {decision.reason && (
                  <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                    {decision.reason}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================
            COMPETITIVE CANDIDATES
        ========================================================= */}
        {selection?.competitiveCandidates?.length > 0 && (
          <div className="space-y-4 border-t border-zinc-800/80 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-zinc-200">
                  <Trophy size={14} className="text-amber-400" />
                  Competitive Variants
                </h3>

                <p className="mt-0.5 text-[11px] text-zinc-400">
                  Variants close enough to the winning match score
                </p>
              </div>

              <span className="rounded-full bg-zinc-900 border border-zinc-800 px-2.5 py-0.5 text-[10px] font-bold text-zinc-400">
                {selection.competitiveCandidates.length}
              </span>
            </div>

            <div className="space-y-2.5">
              {selection.competitiveCandidates.map(
                (match: any, index: number) => {
                  const candidate = match.candidate;
                  const isBest =
                    candidate === selection.best?.candidate;

                  return (
                    <div
                      key={`${candidate.engineCode}-${candidate.transmission}-${index}`}
                      className={`rounded-2xl border p-3.5 sm:p-4 transition-all ${
                        isBest
                          ? "border-blue-500/40 bg-blue-950/20"
                          : "border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900"
                      }`}
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${
                              isBest
                                ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                                : "border-zinc-800 bg-zinc-900 text-zinc-500"
                            }`}
                          >
                            {isBest ? (
                              <Trophy size={15} />
                            ) : (
                              <Cpu size={15} />
                            )}
                          </div>

                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs sm:text-sm font-bold text-white font-mono">
                                {candidate.engineCode ?? "Unknown Engine"}
                              </p>

                              {isBest && (
                                <span className="rounded-md bg-blue-500/20 border border-blue-500/30 px-2 py-0.5 text-[9px] font-black uppercase text-blue-300">
                                  Best Match
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-[11px] text-zinc-400">
                              {candidate.engineDisplacementLiters
                                ? `${candidate.engineDisplacementLiters}L`
                                : "Displacement unknown"}

                              {candidate.transmission &&
                                ` • ${candidate.transmission}`}

                              {candidate.drivetrain &&
                                ` • ${candidate.drivetrain}`}
                            </p>
                          </div>
                        </div>

                        <div className="text-left sm:text-right flex sm:flex-col justify-between items-center sm:items-end border-t sm:border-0 border-zinc-800/60 pt-2 sm:pt-0">
                          <p className="text-base sm:text-lg font-black text-white font-mono">
                            {match.score}
                          </p>

                          <p className="text-[9px] font-bold uppercase tracking-wider text-zinc-500">
                            Match Score
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </div>
        )}

        {/* =========================================================
            ENGINE KNOWLEDGE
        ========================================================= */}
        {engineFacts && (
          <div className="space-y-4 border-t border-zinc-800/80 pt-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                <Cpu size={17} />
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-400">
                  Verified Engine Knowledge
                </h3>

                <p className="mt-0.5 text-[11px] text-zinc-400">
                  Evidence-backed factory specification parameters
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
              <FactTile
                label="Engine Code"
                value={
                  selection?.best?.candidate?.engineCode ?? "Unknown"
                }
              />

              {engineFacts.displacementLiters && (
                <FactTile
                  label="Displacement"
                  value={`${engineFacts.displacementLiters.value} L`}
                  confidence={
                    engineFacts.displacementLiters.confidence
                  }
                />
              )}

              {engineFacts.cylinders && (
                <FactTile
                  label="Cylinders"
                  value={String(engineFacts.cylinders.value)}
                  confidence={engineFacts.cylinders.confidence}
                />
              )}

              {engineFacts.displacementLiters?.verifiedAt && (
                <FactTile
                  label="Verified"
                  value={engineFacts.displacementLiters.verifiedAt}
                />
              )}
            </div>

            {/* Evidence Source */}
            {engineFacts.displacementLiters?.evidence?.[0]?.source && (
              <div className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900/70 p-3 text-xs text-zinc-400">
                <ShieldCheck size={15} className="text-emerald-400 shrink-0" />
                <span>
                  Source:{" "}
                  <strong className="text-zinc-200">
                    {
                      engineFacts.displacementLiters.evidence[0].source
                        .name
                    }
                  </strong>
                </span>
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            INPUT CONFIGURATION MATRIX
        ========================================================= */}
        <div className="border-t border-zinc-800/80 pt-6">
          <h3 className="mb-3 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            Raw Query Fingerprint
          </h3>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            <MiniValue label="Engine" value={vehicle.engineCode} />
            <MiniValue label="Size" value={vehicle.engineSize} />
            <MiniValue label="Fuel" value={vehicle.fuelType} />
            <MiniValue label="Transmission" value={vehicle.transmission} />
            <MiniValue label="Drivetrain" value={vehicle.drivetrain} />
            <MiniValue label="Market" value={vehicle.country} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===============================================================
    UI SUB-COMPONENTS
================================================================ */

function StatusBadge({
  icon,
  label,
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  warning?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-[10px] font-black uppercase tracking-wider backdrop-blur-md ${
        warning
          ? "border-amber-500/30 bg-amber-950/40 text-amber-400"
          : "border-emerald-500/30 bg-emerald-950/40 text-emerald-400"
      }`}
    >
      {icon}
      {label}
    </span>
  );
}

function MetricTile({
  icon,
  label,
  value,
  highlight = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 sm:p-4">
      <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
        {icon}
        {label}
      </div>

      <p
        className={`mt-1.5 truncate text-sm sm:text-base font-black ${
          highlight ? "text-blue-400" : "text-white"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ProgressTile({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-zinc-400">
          {icon}
          {label}
        </div>

        <span className="text-xs font-black text-white font-mono">
          {value}%
        </span>
      </div>

      <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-zinc-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-700"
          style={{
            width: `${Math.min(value, 100)}%`,
          }}
        />
      </div>
    </div>
  );
}

function FactTile({
  label,
  value,
  confidence,
}: {
  label: string;
  value: string;
  confidence?: number;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-3.5">
      <p className="text-[9px] font-black uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-1 text-xs sm:text-sm font-bold text-white font-mono truncate">
        {value}
      </p>

      {confidence !== undefined && (
        <p className="mt-1 text-[10px] font-semibold text-emerald-400">
          {Math.round(confidence * 100)}% confidence
        </p>
      )}
    </div>
  );
}

function MiniValue({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-2.5">
      <p className="truncate text-[8px] font-black uppercase tracking-wider text-zinc-400">
        {label}
      </p>

      <p className="mt-0.5 truncate text-[11px] font-bold text-zinc-200">
        {value || "—"}
      </p>
    </div>
  );
}