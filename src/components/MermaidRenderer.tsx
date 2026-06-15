"use client";

import { useEffect } from "react";

export function MermaidRenderer() {
  useEffect(() => {
    let cancelled = false;

    async function renderDiagrams() {
      const diagrams = document.querySelectorAll<HTMLElement>("[data-mermaid-diagram]");
      if (diagrams.length === 0) return;

      const { default: mermaid } = await import("mermaid");
      if (cancelled) return;

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        themeVariables: {
          background: "transparent",
          fontFamily: "NanumSquare, Apple SD Gothic Neo, Noto Sans KR, sans-serif",
          primaryColor: "#111827",
          primaryTextColor: "#f9fafb",
          primaryBorderColor: "#38bdf8",
          secondaryColor: "#1f2937",
          secondaryTextColor: "#f9fafb",
          secondaryBorderColor: "#a78bfa",
          tertiaryColor: "#f8fafc",
          tertiaryTextColor: "#1f2937",
          tertiaryBorderColor: "#cbd5e1",
          lineColor: "#64748b",
          textColor: "#1f2937",
          clusterBkg: "#f8fafc",
          clusterBorder: "#cbd5e1",
          edgeLabelBackground: "#ffffff",
          nodeBorder: "#38bdf8",
          actorBkg: "#0f172a",
          actorBorder: "#38bdf8",
          actorTextColor: "#f8fafc",
          actorLineColor: "#475569",
          signalColor: "#67e8f9",
          signalTextColor: "#f8fafc",
          labelBoxBkgColor: "#111827",
          labelBoxBorderColor: "#38bdf8",
          labelTextColor: "#f8fafc",
          loopTextColor: "#f8fafc",
          noteBkgColor: "#111827",
          noteBorderColor: "#f59e0b",
          noteTextColor: "#f8fafc",
          activationBkgColor: "#1e293b",
          activationBorderColor: "#67e8f9",
        },
        themeCSS: `
          .actor > text,
          text.actor,
          .messageText,
          .loopText,
          .labelText,
          .noteText,
          .sequenceNumber {
            fill: #f8fafc !important;
            color: #f8fafc !important;
            font-weight: 700 !important;
          }

          .messageLine0,
          .messageLine1 {
            stroke: #67e8f9 !important;
          }

          .actor-line {
            stroke: #64748b !important;
          }
        `,
      });

      diagrams.forEach(async (diagram, index) => {
        if (diagram.dataset.mermaidRendered === "true") return;

        const source = diagram.querySelector("code")?.textContent?.trim();
        const target = diagram.querySelector<HTMLElement>(".diagram-render");

        if (!source || !target) return;

        diagram.dataset.mermaidRendered = "true";
        diagram.classList.add("is-rendering");

        try {
          const id = `mermaid-${Date.now()}-${index}`;
          const { svg } = await mermaid.render(id, source);
          if (cancelled) return;

          target.innerHTML = svg;
          diagram.classList.remove("is-rendering");
          diagram.classList.add("is-rendered");
        } catch (error) {
          diagram.classList.remove("is-rendering");
          diagram.classList.add("has-render-error");
          target.textContent = error instanceof Error ? error.message : "Failed to render diagram.";
        }
      });
    }

    void renderDiagrams();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
