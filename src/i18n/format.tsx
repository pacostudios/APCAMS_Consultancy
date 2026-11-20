import React from "react";

const TOKEN = /\{(\w+)\}/g;

/** Fills "{name}" placeholders in a translated string with plain values. */
export function fmt(template: string, vars: Record<string, string | number>) {
  return template.replace(TOKEN, (_, key: string) => String(vars[key] ?? `{${key}}`));
}

/**
 * Fills "{name}" placeholders with React content (links, bold text), so each language can put them
 * wherever its word order needs.
 */
export function rich(template: string, vars: Record<string, React.ReactNode>) {
  return template.split(TOKEN).map((part, i) => (i % 2 === 1 ? <React.Fragment key={i}>{vars[part]}</React.Fragment> : part));
}
