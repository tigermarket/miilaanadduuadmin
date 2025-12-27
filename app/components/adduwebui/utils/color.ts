function clamp(v: number, a = 0, b = 255) {
  return Math.max(a, Math.min(b, Math.round(v)));
}

function parseColor(
  input: string | { r: number; g: number; b: number; a?: number }
) {
  if (!input) return { r: 0, g: 0, b: 0, a: 1 };
  if (typeof input !== "string")
    return { r: input.r, g: input.g, b: input.b, a: input.a ?? 1 };
  const s = input.trim();
  // hex
  if (s[0] === "#") {
    const h = s.replace("#", "");
    if (h.length === 3) {
      const r = parseInt(h[0] + h[0], 16);
      const g = parseInt(h[1] + h[1], 16);
      const b = parseInt(h[2] + h[2], 16);
      return { r, g, b, a: 1 };
    }
    if (h.length === 6) {
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return { r, g, b, a: 1 };
    }
  }

  // rgb() or rgba()
  const rgbMatch = s.match(/rgba?\(([^)]+)\)/i);
  if (rgbMatch) {
    const parts = rgbMatch[1].split(",").map((p) => p.trim());
    const r = parseInt(parts[0], 10) || 0;
    const g = parseInt(parts[1], 10) || 0;
    const b = parseInt(parts[2], 10) || 0;
    const a = parts[3] !== undefined ? parseFloat(parts[3]) : 1;
    return { r, g, b, a };
  }

  return { r: 0, g: 0, b: 0, a: 1 };
}

function toHex({ r, g, b }: { r: number; g: number; b: number }) {
  return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
}

function rgbString({
  r,
  g,
  b,
  a,
}: {
  r: number;
  g: number;
  b: number;
  a?: number;
}) {
  if (a === undefined || a === 1) return `rgb(${r}, ${g}, ${b})`;
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export default function color(
  input: string | { r: number; g: number; b: number; a?: number }
) {
  const base = parseColor(input);

  return {
    mix(other: any, ratio: number) {
      const o =
        typeof other === "string" ? parseColor(other) : parseColor(other);
      const t = ratio;
      const r = clamp(base.r * (1 - t) + o.r * t);
      const g = clamp(base.g * (1 - t) + o.g * t);
      const b = clamp(base.b * (1 - t) + o.b * t);
      const a =
        typeof base.a === "number" && typeof o.a === "number"
          ? base.a * (1 - t) + o.a * t
          : base.a ?? 1;
      return color({ r, g, b, a });
    },
    // Returns true if the color is perceived as light
    isLight() {
      // Use a simple luminance formula
      const r = base.r / 255;
      const g = base.g / 255;
      const b = base.b / 255;
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      return lum > 0.5;
    },
    alpha(a: number) {
      return color({ r: base.r, g: base.g, b: base.b, a });
    },
    rgb() {
      return { string: () => rgbString(base) };
    },
    hex() {
      return toHex(base);
    },
    string() {
      return rgbString(base);
    },
  };
}
