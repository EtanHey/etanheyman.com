import Link from "next/link";

// Presentational only (no hooks, no manifest import) so both server pages and
// client filters can render it with small, pre-computed rows.

export interface LedgerRow {
  name: string;
  command: string;
  summary: string;
  category: string;
  evalCount: number;
  hasFixtures: boolean;
  updated: string;
}

function SuiteCell({ row, verbose = false }: { row: LedgerRow; verbose?: boolean }) {
  return row.evalCount > 0 ? (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-g-ink">
      <span aria-hidden="true" className="g-mark g-mark-written" />
      <span>
        <span className="g-tabular">{row.evalCount}</span>
        {verbose ? " eval scenarios written" : " written"}
      </span>
    </span>
  ) : (
    <span className="inline-flex items-center gap-2 whitespace-nowrap text-g-ash">
      <span aria-hidden="true" className="g-mark g-mark-none w-2.5" />
      {verbose ? "No eval suite yet" : "None yet"}
    </span>
  );
}

function FixturesCell({ row }: { row: LedgerRow }) {
  return row.hasFixtures ? (
    <span className="inline-flex items-center gap-2 text-g-ochre">
      <span aria-hidden="true" className="g-mark g-mark-fixtures" />
      Included
    </span>
  ) : (
    <span className="text-g-ash">None</span>
  );
}

export default function LedgerTable({
  rows,
  caption,
  showCategory = false,
}: {
  rows: LedgerRow[];
  caption: string;
  showCategory?: boolean;
}) {
  if (rows.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-g-edge px-5 py-8 text-center text-g-ash">
        No skills match these filters. Clear a filter to see more.
      </p>
    );
  }

  return (
    <>
      {/* Wide screens: a real table */}
      <table className="hidden w-full border-collapse text-left text-[0.95rem] md:table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-g-ink text-sm text-g-ash">
            <th scope="col" className="py-3 pr-4 font-medium">Skill</th>
            <th scope="col" className="py-3 pr-4 font-medium">What it does</th>
            <th scope="col" className="py-3 pr-4 font-medium whitespace-nowrap">Eval scenarios</th>
            <th scope="col" className="py-3 pr-4 font-medium">Fixtures</th>
            <th scope="col" className="py-3 font-medium">Updated</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.name}
              className="group border-b border-g-rule align-top transition-colors duration-150 hover:bg-g-raised/70"
            >
              <th scope="row" className="py-3.5 pr-4 font-normal">
                <Link
                  href={`/golems/skills/${row.name}`}
                  className="rounded-sm font-g-mono text-[0.92rem] font-medium text-g-cobalt underline decoration-transparent underline-offset-4 transition-colors duration-150 group-hover:decoration-current"
                >
                  {row.command}
                </Link>
                {showCategory && (
                  <span className="mt-1 block text-[0.8rem] text-g-ash">{row.category}</span>
                )}
              </th>
              <td className="max-w-[46ch] py-3.5 pr-4 leading-relaxed text-g-ink">
                <span className="line-clamp-2">{row.summary}</span>
              </td>
              <td className="py-3.5 pr-4"><SuiteCell row={row} /></td>
              <td className="py-3.5 pr-4"><FixturesCell row={row} /></td>
              <td className="g-tabular py-3.5 whitespace-nowrap text-g-ash">{row.updated}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Narrow screens: one block per skill */}
      <ul className="divide-y divide-g-rule border-y border-g-ink md:hidden" aria-label={caption}>
        {rows.map((row) => (
          <li key={row.name} className="py-4">
            <Link
              href={`/golems/skills/${row.name}`}
              className="font-g-mono text-[0.95rem] font-medium text-g-cobalt underline underline-offset-4"
            >
              {row.command}
            </Link>
            <p className="mt-1.5 line-clamp-3 text-[0.95rem] leading-relaxed text-g-ink">{row.summary}</p>
            <dl className="mt-2.5 flex flex-wrap gap-x-5 gap-y-1.5 text-[0.85rem]">
              <div className="flex gap-1.5">
                <dt className="sr-only">Eval scenarios</dt>
                <dd><SuiteCell row={row} verbose /></dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-g-ash">Fixtures</dt>
                <dd><FixturesCell row={row} /></dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-g-ash">Updated</dt>
                <dd className="g-tabular text-g-ash">{row.updated}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}
