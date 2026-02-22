import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

async function getShikiHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["github-dark"],
      langs: ["typescript", "python", "bash", "json", "yaml", "sql"],
    });
  }
  return highlighter;
}

export async function highlightCode(
  code: string,
  lang: string,
): Promise<string> {
  const normalizedLang = lang.toLowerCase().replace("shell", "bash");
  const supported = [
    "typescript",
    "python",
    "bash",
    "json",
    "yaml",
    "sql",
    "ts",
    "py",
    "sh",
  ];
  const langMap: Record<string, string> = {
    ts: "typescript",
    py: "python",
    sh: "bash",
  };
  const finalLang = langMap[normalizedLang] ?? normalizedLang;

  if (!supported.includes(normalizedLang) && !supported.includes(finalLang)) {
    // Return plain text for unsupported languages
    return code;
  }

  try {
    const h = await getShikiHighlighter();
    const html = h.codeToHtml(code, {
      lang: finalLang,
      theme: "github-dark",
    });
    return html;
  } catch {
    return code;
  }
}
