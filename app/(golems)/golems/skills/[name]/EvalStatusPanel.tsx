// AIDEV-NOTE: No eval results are published on the site. The old panels were
// seeded-random mock data plus March 2026 numbers golems has withdrawn. Only
// render real results once they come from provenance-stamped runs
// (model_effective recorded); until then every skill shows this state.
// The ladder below only restates manifest facts (scenarios defined, fixtures
// present); steps 2 and 3 stay empty until real runs exist.
export const NOT_EVALUATED_LABEL = "Not yet evaluated on current models";

interface EvalStatusPanelProps {
  evalCount?: number;
  hasFixtures?: boolean;
  compact?: boolean;
}

export default function EvalStatusPanel({
  evalCount = 0,
  hasFixtures = false,
  compact = false,
}: EvalStatusPanelProps) {
  const steps = [
    {
      title: "Scenarios written",
      mark: evalCount > 0 ? "g-mark-written" : "g-mark-none w-2.5",
      detail:
        evalCount > 0
          ? `${evalCount} in evals/evals.json${hasFixtures ? ", with fixtures" : ""}`
          : "No eval suite yet",
    },
    {
      title: "Run on a recorded model",
      mark: "g-mark-pending",
      detail: "Not yet",
    },
    {
      title: "Results published",
      mark: "g-mark-pending",
      detail: "Not yet",
    },
  ];

  return (
    <div className="rounded-xl border border-g-rule bg-g-raised p-5">
      <p className="flex items-center gap-2.5 font-g-display text-[1.15rem] leading-snug text-g-ink">
        <span aria-hidden="true" className="g-mark g-mark-pending" />
        {NOT_EVALUATED_LABEL}
      </p>
      {!compact && (
        <p className="mt-2 text-[0.95rem] leading-relaxed text-g-ash">
          Results will appear here once runs with a recorded model are published.
        </p>
      )}
      <ol className="mt-4 divide-y divide-g-rule border-t border-g-rule">
        {steps.map((step) => (
          <li key={step.title} className="flex items-start justify-between gap-4 py-2.5 text-[0.92rem]">
            <span className="flex items-center gap-2.5 text-g-ink">
              <span aria-hidden="true" className={`g-mark ${step.mark}`} />
              {step.title}
            </span>
            <span className="text-right text-g-ash">{step.detail}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
