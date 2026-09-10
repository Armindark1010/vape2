/* Lightweight hand-rolled SVG charts — zero dependencies */

function lastMonths(n: number): string[] {
  const out: string[] = [];
  const d = new Date();
  d.setDate(1);
  for (let i = n - 1; i >= 0; i--) {
    const m = new Date(d.getFullYear(), d.getMonth() - i, 1);
    out.push(`${m.getFullYear()}-${String(m.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

function label(m: string) {
  return new Date(m + "-02").toLocaleDateString("en-US", { month: "short" });
}

export function AreaChart({ data, money = true }: { data: { m: string; total: number }[]; money?: boolean }) {
  const months = lastMonths(6);
  const series = months.map((k) => ({ m: k, v: data.find((d) => d.m === k)?.total ?? 0 }));
  const W = 600;
  const H = 200;
  const P = 10;
  const max = Math.max(1, ...series.map((s) => s.v));
  const stepX = (W - P * 2) / (series.length - 1 || 1);
  const pts = series.map((s, i) => [P + i * stepX, H - P - (s.v / max) * (H - P * 2 - 24)] as const);
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H - P} L${pts[0][0]},${H - P} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H + 26}`} className="w-full" role="img" aria-label="Revenue by month">
        <defs>
          <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c7a16a" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c7a16a" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line
            key={f}
            x1={P}
            x2={W - P}
            y1={H - P - f * (H - P * 2 - 24)}
            y2={H - P - f * (H - P * 2 - 24)}
            stroke="#232329"
            strokeDasharray="3 5"
            strokeWidth="1"
          />
        ))}
        <path d={area} fill="url(#rev)" />
        <path d={line} fill="none" stroke="#c7a16a" strokeWidth="2" strokeLinecap="round" />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r="3.5" fill="#0a0a0c" stroke="#c7a16a" strokeWidth="1.5">
              <title>{`${label(series[i].m)}: $${Math.round(series[i].v / 100).toLocaleString()}`}</title>
            </circle>
            <text x={x} y={y - 10} textAnchor="middle" fill="#6d6a64" fontSize="9">
              {money ? `$${series[i].v >= 100000 ? `${(series[i].v / 100000).toFixed(1)}k` : Math.round(series[i].v / 100)}` : series[i].v}
            </text>
            <text x={x} y={H + 14} textAnchor="middle" fill="#6d6a64" fontSize="10" letterSpacing="1">
              {label(series[i].m).toUpperCase()}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function BarChart({ data }: { data: { m: string; n: number }[] }) {
  const months = lastMonths(6);
  const series = months.map((k) => ({ m: k, v: data.find((d) => d.m === k)?.n ?? 0 }));
  const W = 600;
  const H = 200;
  const P = 10;
  const max = Math.max(1, ...series.map((s) => s.v));
  const bw = 34;
  const stepX = (W - P * 2) / series.length;

  return (
    <svg viewBox={`0 0 ${W} ${H + 26}`} className="w-full" role="img" aria-label="Orders by month">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <line
          key={f}
          x1={P}
          x2={W - P}
          y1={H - P - f * (H - P * 2 - 24)}
          y2={H - P - f * (H - P * 2 - 24)}
          stroke="#232329"
          strokeDasharray="3 5"
          strokeWidth="1"
        />
      ))}
      {series.map((s, i) => {
        const h = (s.v / max) * (H - P * 2 - 24);
        const x = P + i * stepX + (stepX - bw) / 2;
        return (
          <g key={s.m}>
            <rect x={x} y={H - P - h} width={bw} height={Math.max(2, h)} rx="4" fill="#2e2e36">
              <title>{`${label(s.m)}: ${s.v} orders`}</title>
            </rect>
            <rect x={x} y={H - P - h} width={bw} height={Math.max(2, h * 0.35)} rx="4" fill="#c7a16a" opacity="0.85" />
            <text x={x + bw / 2} y={H - P - h - 8} textAnchor="middle" fill="#98948c" fontSize="10">
              {s.v}
            </text>
            <text x={x + bw / 2} y={H + 14} textAnchor="middle" fill="#6d6a64" fontSize="10" letterSpacing="1">
              {label(s.m).toUpperCase()}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
