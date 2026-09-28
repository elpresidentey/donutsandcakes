/** Average a list of hex colours into one hex colour. */
export function mixHex(hexes: string[]): string {
  const valid = hexes.filter((h) => /^#[0-9a-fA-F]{6}$/.test(h));
  if (valid.length === 0) return "#f6e3b4";
  let r = 0, g = 0, b = 0;
  for (const h of valid) {
    r += parseInt(h.slice(1, 3), 16);
    g += parseInt(h.slice(3, 5), 16);
    b += parseInt(h.slice(5, 7), 16);
  }
  const n = valid.length;
  const to = (v: number) =>
    Math.round(v / n)
      .toString(16)
      .padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`;
}

/** Mix a colour toward white by `amount` (0–1). */
export function lighten(hex: string, amount = 0.35): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const mix = (v: number) => Math.round(v + (255 - v) * amount);
  const to = (v: number) => v.toString(16).padStart(2, "0");
  return `#${to(mix(r))}${to(mix(g))}${to(mix(b))}`;
}
