export type MermaidLayout = "fit" | "scroll";

export function getMermaidLayout(source: string): MermaidLayout {
  const header = source.trimStart().split(/\r?\n/, 1)[0].trim();

  if (/^sequenceDiagram\b/i.test(header)) {
    return "scroll";
  }

  if (/^(?:flowchart|graph)\s+(?:LR|RL)\b/i.test(header)) {
    return "scroll";
  }

  return "fit";
}
