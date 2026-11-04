import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from "react";
import CopyButton from "../components/CopyButton";
import MermaidDiagram from "../components/MermaidDiagram";

// AIDEV-NOTE: Route-local MDX components for the Golems light theme. The shared
// root mdx-components.tsx is dark-themed and used elsewhere, so Golems docs and
// skill pages pass these instead of editing it. Code stays on the dark kiln
// surface because rehype-pretty-code uses the github-dark-dimmed palette.

export function extractTextContent(node: ReactNode): string {
  if (typeof node === "string") return node;
  if (typeof node === "number") return String(node);
  if (!node) return "";
  if (Array.isArray(node)) return node.map(extractTextContent).join("");
  if (typeof node === "object" && "props" in node) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return extractTextContent(el.props.children);
  }
  return "";
}

type PreProps = ComponentPropsWithoutRef<"pre"> & {
  children?: ReactNode;
  "data-language"?: string;
};

function Pre({ children, ...props }: PreProps) {
  const child = children as ReactElement<{ className?: string }> | undefined;
  const lang = props["data-language"] || child?.props?.className?.replace("language-", "");
  if (lang === "mermaid") {
    return <MermaidDiagram chart={extractTextContent(children)} />;
  }
  const codeText = extractTextContent(children);
  return (
    <div className="g-on-kiln relative my-5">
      <pre
        {...props}
        tabIndex={0}
        className="scrollbar-thin overflow-x-auto rounded-lg bg-g-kiln py-4 pr-12 pl-4 font-g-mono text-[0.84rem] leading-[1.7] text-g-kiln-text [&_code]:bg-transparent [&_code]:p-0 [&_code]:text-[inherit]"
      >
        {children}
      </pre>
      {codeText.trim() && <CopyButton text={codeText} />}
    </div>
  );
}

export const golemsMdxComponents = {
  h1: ({ children, id }: ComponentPropsWithoutRef<"h1">) => (
    <h2 id={id} className="mt-12 mb-4 font-g-display text-[2rem] leading-tight text-g-ink">{children}</h2>
  ),
  h2: ({ children, id }: ComponentPropsWithoutRef<"h2">) => (
    <h2 id={id} className="mt-12 mb-4 border-t border-g-rule pt-6 font-g-display text-[1.65rem] leading-tight text-g-ink">
      {children}
    </h2>
  ),
  h3: ({ children, id }: ComponentPropsWithoutRef<"h3">) => (
    <h3 id={id} className="mt-8 mb-2 text-[1.2rem] font-semibold text-g-ink">{children}</h3>
  ),
  h4: ({ children, id }: ComponentPropsWithoutRef<"h4">) => (
    <h4 id={id} className="mt-6 mb-2 text-[1.05rem] font-semibold text-g-ink">{children}</h4>
  ),
  p: ({ children }: ComponentPropsWithoutRef<"p">) => (
    <p className="mb-4 text-[1.02rem] leading-[1.7] text-g-ink">{children}</p>
  ),
  a: ({ href, children }: ComponentPropsWithoutRef<"a">) => {
    if (href?.startsWith("http")) {
      return (
        <a href={href} target="_blank" rel="noopener noreferrer" className="g-link">
          {children}
        </a>
      );
    }
    return (
      <Link href={href || "#"} className="g-link">
        {children}
      </Link>
    );
  },
  ul: ({ children }: ComponentPropsWithoutRef<"ul">) => (
    <ul className="mb-4 list-disc space-y-1.5 pl-6 text-[1.02rem] leading-[1.65] text-g-ink marker:text-g-ash">{children}</ul>
  ),
  ol: ({ children }: ComponentPropsWithoutRef<"ol">) => (
    <ol className="mb-4 list-decimal space-y-1.5 pl-6 text-[1.02rem] leading-[1.65] text-g-ink marker:text-g-ash">{children}</ol>
  ),
  li: ({ children }: ComponentPropsWithoutRef<"li">) => (
    <li className="pl-1 [&>p]:mb-1">{children}</li>
  ),
  code: ({ children, className }: ComponentPropsWithoutRef<"code">) =>
    className ? (
      <code className={className}>{children}</code>
    ) : (
      <code className="rounded-[4px] bg-g-sunk px-1.5 py-0.5 font-g-mono text-[0.88em] text-g-ink">{children}</code>
    ),
  pre: Pre,
  blockquote: ({ children }: ComponentPropsWithoutRef<"blockquote">) => (
    <blockquote className="my-5 border-l-[3px] border-g-cobalt pl-4 text-g-ash [&>p]:text-g-ash">{children}</blockquote>
  ),
  table: ({ children }: ComponentPropsWithoutRef<"table">) => (
    // Focusable so keyboard users can scroll wide tables on small screens.
    <div tabIndex={0} className="scrollbar-thin my-5 overflow-x-auto">
      <table className="w-full border-collapse text-left text-[0.95rem] text-g-ink">{children}</table>
    </div>
  ),
  thead: ({ children }: ComponentPropsWithoutRef<"thead">) => (
    <thead className="border-b border-g-ink">{children}</thead>
  ),
  th: ({ children }: ComponentPropsWithoutRef<"th">) => (
    <th className="px-3 py-2 text-sm font-semibold text-g-ink first:pl-0">{children}</th>
  ),
  td: ({ children }: ComponentPropsWithoutRef<"td">) => (
    <td className="border-b border-g-rule px-3 py-2 align-top first:pl-0">{children}</td>
  ),
  hr: () => <hr className="my-10 border-g-rule" />,
  strong: ({ children }: ComponentPropsWithoutRef<"strong">) => (
    <strong className="font-semibold text-g-ink">{children}</strong>
  ),
  img: (props: ComponentPropsWithoutRef<"img">) => (
    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- markdown images keep their own alt
    <img {...props} className="my-5 max-w-full rounded-lg border border-g-rule" />
  ),
};
