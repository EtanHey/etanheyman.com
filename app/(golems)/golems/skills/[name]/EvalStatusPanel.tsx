// AIDEV-NOTE: No eval results are published on the site. The old panels were
// seeded-random mock data plus March 2026 numbers golems has withdrawn. Only
// render real results once they come from provenance-stamped runs
// (model_effective recorded); until then every skill shows this state.
export const NOT_EVALUATED_LABEL = "Not yet evaluated on current models";

export default function EvalStatusPanel() {
  return (
    <div className="rounded-xl border border-[#e5950015] bg-[#0d0c0a] p-5">
      <p className="text-sm font-medium text-[#f0ebe0]">
        {NOT_EVALUATED_LABEL}
      </p>
      <p className="mt-2 text-xs text-[#b0a89c]">
        Results will appear here once runs with a recorded model are published.
      </p>
    </div>
  );
}
