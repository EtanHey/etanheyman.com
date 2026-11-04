import CopyButton from "./CopyButton";

// A kiln-surface terminal block. Lines starting with "#" render as comments
// and are left out of the copied text.
export default function CommandBlock({
  lines,
  label,
}: {
  lines: string[];
  label?: string;
}) {
  const copyText = lines.filter((l) => !l.startsWith("#")).join("\n");
  return (
    <div className="g-on-kiln relative overflow-hidden rounded-lg bg-g-kiln">
      <pre
        aria-label={label}
        className="scrollbar-thin overflow-x-auto py-3.5 pr-12 pl-4 font-g-mono text-[0.84rem] leading-[1.7] text-g-kiln-text"
      >
        {lines.map((line, i) =>
          line.startsWith("#") ? (
            <div key={i} className="text-g-kiln-muted">
              {line}
            </div>
          ) : (
            <div key={i}>
              <span aria-hidden="true" className="mr-2 text-g-kiln-muted select-none">
                $
              </span>
              {line}
            </div>
          ),
        )}
      </pre>
      <CopyButton text={copyText} label={label ? `Copy: ${label}` : undefined} />
    </div>
  );
}
