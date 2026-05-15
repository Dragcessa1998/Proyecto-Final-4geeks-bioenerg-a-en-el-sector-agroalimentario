// Regression-focused charts for FAOSTAT bioenergy predictor
const { useMemo, useState, useRef, useEffect } = React;

// Line / area chart for world trend
function LineChart({ series, width=720, height=260, yLabel="", xKey="year", yKey="value", area=false }) {
  const m = { l: 56, r: 16, t: 14, b: 32 };
  const allPts = series.flatMap(s => s.data);
  const xs = allPts.map(p => p[xKey]);
  const ys = allPts.map(p => p[yKey]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs);
  const y0 = 0, y1 = Math.max(...ys) * 1.08;
  const sx = v => m.l + ((v-x0)/(x1-x0))*(width-m.l-m.r);
  const sy = v => height - m.b - ((v-y0)/(y1-y0))*(height-m.t-m.b);
  const yTicks = 5;
  const yT = Array.from({length:yTicks}, (_,i)=> y1 * i/(yTicks-1));
  const fmt = (v) => v >= 1e9 ? (v/1e9).toFixed(1)+"B"
                    : v >= 1e6 ? (v/1e6).toFixed(1)+"M"
                    : v >= 1e3 ? (v/1e3).toFixed(0)+"k"
                    : v.toFixed(0);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:"auto",display:"block"}}>
      {yT.map((v,i)=>(
        <g key={i}>
          <line x1={m.l} x2={width-m.r} y1={sy(v)} y2={sy(v)}
            stroke="var(--line-soft)" strokeWidth="0.5"/>
          <text x={m.l-6} y={sy(v)+3} fill="var(--text-3)" fontSize="9.5"
            fontFamily="var(--font-mono)" textAnchor="end">{fmt(v)}</text>
        </g>
      ))}
      {/* x labels every 4 years */}
      {Array.from({length:Math.ceil((x1-x0)/4)+1},(_,i)=>{
        const v = x0 + i*4;
        if (v > x1) return null;
        return <text key={"xt"+i} x={sx(v)} y={height-m.b+14}
          fill="var(--text-3)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">{v}</text>;
      })}
      <line x1={m.l} x2={width-m.r} y1={height-m.b} y2={height-m.b} stroke="var(--line)" />

      {series.map((s,i)=>{
        const pts = s.data;
        const path = "M " + pts.map(p => `${sx(p[xKey])},${sy(p[yKey])}`).join(" L ");
        const areaPath = path + ` L ${sx(pts[pts.length-1][xKey])},${sy(0)} L ${sx(pts[0][xKey])},${sy(0)} Z`;
        return (
          <g key={i}>
            {area && <path d={areaPath} fill={s.color} opacity="0.18"/>}
            <path d={path} stroke={s.color} strokeWidth="1.8" fill="none"
              strokeLinejoin="round" strokeLinecap="round"/>
            {pts.map((p,j)=>(
              <circle key={j} cx={sx(p[xKey])} cy={sy(p[yKey])} r="2"
                fill={s.color} opacity={j%2===0?1:0.4}/>
            ))}
          </g>
        );
      })}

      {yLabel && (
        <text x={14} y={(m.t+height-m.b)/2} fill="var(--text-2)"
          fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle"
          transform={`rotate(-90 14 ${(m.t+height-m.b)/2})`}>{yLabel}</text>
      )}
    </svg>
  );
}

// Horizontal bar chart — used for top items and feature importance
function HBar({ items, width=520, valueKey="value", labelKey="name", colorKey=null, valueFormat=null, height=null }) {
  const max = Math.max(...items.map(i=>i[valueKey]));
  return (
    <div style={{display:"flex",flexDirection:"column",gap:7, ...(height?{maxHeight:height,overflowY:"auto"}:{})}}>
      {items.map((it,i)=>{
        const color = colorKey
          ? (window.FAOSTAT.groupColors?.[it[colorKey]] || it[colorKey] || "var(--accent)")
          : "var(--accent)";
        const fmt = valueFormat || ((v) => v.toLocaleString());
        return (
          <div key={i} style={{display:"grid",gridTemplateColumns:"220px 1fr 90px",gap:10,alignItems:"center"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-1)",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{it[labelKey]}</div>
            <div style={{height:8,background:"var(--bg-2)",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${(it[valueKey]/max)*100}%`,
                background:`linear-gradient(90deg, ${color}, ${color})`,
                opacity:0.85}}/>
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:11,
              color:"var(--text-2)",textAlign:"right"}}>
              {fmt(it[valueKey])}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Histogram with optional gaussian overlay
function Histogram({ bins, width=480, height=200, xKey="x", yKey="count", xLabel="", overlay=null }) {
  const m = { l: 36, r: 12, t: 12, b: 30 };
  const xs = bins.map(b => b[xKey]);
  const ys = bins.map(b => b[yKey]);
  const x0 = Math.min(...xs), x1 = Math.max(...xs)+(xs[1]-xs[0]);
  const y0 = 0, y1 = Math.max(...ys)*1.08;
  const sx = v => m.l + ((v-x0)/(x1-x0))*(width-m.l-m.r);
  const sy = v => height - m.b - ((v-y0)/(y1-y0))*(height-m.t-m.b);
  const bw = sx(bins[1][xKey]) - sx(bins[0][xKey]);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:"auto",display:"block"}}>
      <line x1={m.l} x2={width-m.r} y1={height-m.b} y2={height-m.b} stroke="var(--line)"/>
      {Array.from({length:5},(_,i)=>{
        const v = (y1/4)*i;
        return <g key={i}>
          <line x1={m.l} x2={width-m.r} y1={sy(v)} y2={sy(v)} stroke="var(--line-soft)" strokeWidth="0.5"/>
          <text x={m.l-4} y={sy(v)+3} fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">{v.toFixed(0)}</text>
        </g>;
      })}
      {bins.map((b,i)=>(
        <rect key={i} x={sx(b[xKey])+0.5} y={sy(b[yKey])}
          width={Math.max(1,bw-1)} height={sy(0)-sy(b[yKey])}
          fill="var(--accent)" opacity="0.85"/>
      ))}
      {/* zero line if x crosses zero */}
      {x0 < 0 && x1 > 0 && (
        <line x1={sx(0)} x2={sx(0)} y1={m.t} y2={height-m.b}
          stroke="var(--accent-4)" strokeWidth="1" strokeDasharray="3 3"/>
      )}
      {[x0, 0, x1].filter(v => v >= x0 && v <= x1).map((v,i)=>(
        <text key={"x"+i} x={sx(v)} y={height-12}
          fill="var(--text-3)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
          {v.toFixed(1)}
        </text>
      ))}
      {xLabel && (
        <text x={(m.l+width-m.r)/2} y={height-1} fill="var(--text-2)"
          fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">{xLabel}</text>
      )}
    </svg>
  );
}

// Scatter — used for predicted vs actual
function ScatterChart({ data, width=520, height=380, xLabel="", yLabel="", showIdentity=true, axisMax=null }) {
  const m = { l: 50, r: 16, t: 14, b: 36 };
  const xs = data.map(d=>d[0]);
  const ys = data.map(d=>d[1]);
  const maxV = axisMax || Math.max(...xs, ...ys) * 1.04;
  const x0 = 0, x1 = maxV, y0 = 0, y1 = maxV;
  const sx = v => m.l + ((v-x0)/(x1-x0))*(width-m.l-m.r);
  const sy = v => height - m.b - ((v-y0)/(y1-y0))*(height-m.t-m.b);
  const yT = Array.from({length:5},(_,i)=>maxV*i/4);

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:"auto",display:"block"}}>
      {yT.map((v,i)=>(
        <g key={i}>
          <line x1={m.l} x2={width-m.r} y1={sy(v)} y2={sy(v)} stroke="var(--line-soft)" strokeWidth="0.5"/>
          <line x1={sx(v)} x2={sx(v)} y1={m.t} y2={height-m.b} stroke="var(--line-soft)" strokeWidth="0.5"/>
          <text x={m.l-6} y={sy(v)+3} fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">{v.toFixed(1)}</text>
          <text x={sx(v)} y={height-m.b+13} fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="middle">{v.toFixed(1)}</text>
        </g>
      ))}
      {showIdentity && (
        <line x1={sx(0)} x2={sx(maxV)} y1={sy(0)} y2={sy(maxV)}
          stroke="var(--accent-4)" strokeDasharray="3 4" strokeWidth="1"/>
      )}
      {data.map((d,i)=>(
        <circle key={i} cx={sx(d[0])} cy={sy(d[1])} r="2"
          fill="var(--accent)" opacity="0.55"/>
      ))}
      <text x={(m.l+width-m.r)/2} y={height-2} fill="var(--text-2)"
        fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">{xLabel}</text>
      <text x={12} y={(m.t+height-m.b)/2} fill="var(--text-2)"
        fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle"
        transform={`rotate(-90 12 ${(m.t+height-m.b)/2})`}>{yLabel}</text>
    </svg>
  );
}

// Correlation matrix between numeric features
function CorrelationMatrix({ features, getCorrelation, width=420, height=420 }) {
  const n = features.length;
  const pad = 130;
  const cell = (Math.min(width, height) - pad) / n;
  const colorOf = v => {
    if (v >= 0) return `oklch(${0.28+v*0.52} ${0.02+v*0.14} 175)`;
    return `oklch(${0.28-v*0.52} ${0.02-v*0.14} 25)`;
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:"auto",display:"block"}}>
      {features.map((fi,i)=>features.map((fj,j)=>{
        const v = getCorrelation(fi, fj);
        return (
          <g key={`${i}-${j}`}>
            <rect x={pad+j*cell} y={20+i*cell} width={cell-1} height={cell-1}
              fill={colorOf(v)} stroke="var(--bg-0)" strokeWidth="1"/>
            <text x={pad+j*cell+cell/2} y={20+i*cell+cell/2+3}
              fill={Math.abs(v)>0.55 ? "var(--bg-0)" : "var(--text-1)"}
              fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">
              {v.toFixed(2)}
            </text>
          </g>
        );
      }))}
      {features.map((f,i)=>(
        <text key={"r"+i} x={pad-6} y={20+i*cell+cell/2+3}
          fill="var(--text-2)" fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="end">
          {f}
        </text>
      ))}
      {features.map((f,i)=>(
        <text key={"c"+i} x={pad+i*cell+cell/2} y={16}
          fill="var(--text-2)" fontSize="9.5" fontFamily="var(--font-mono)"
          textAnchor="end" transform={`rotate(-35 ${pad+i*cell+cell/2} 16)`}>
          {f}
        </text>
      ))}
    </svg>
  );
}

// Stacked area for missing-values barplot per column group
function MissingByColumn({ items, width=480 }) {
  const max = 101995;
  return (
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {items.map((it,i)=>{
        const present = max - it.nulls;
        const presentPct = (present/max)*100;
        return (
          <div key={i} style={{display:"grid",gridTemplateColumns:"230px 1fr 78px",gap:10,alignItems:"center"}}>
            <div style={{fontFamily:"var(--font-mono)",fontSize:10.5,color:"var(--text-1)",
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {it.name}
            </div>
            <div style={{height:7,display:"flex",borderRadius:3,overflow:"hidden",background:"var(--bg-2)"}}>
              <span style={{width:`${presentPct}%`, background: window.FAOSTAT.groupBadge[it.group]?.color || "var(--accent)"}}/>
              <span style={{flex:1, background:"var(--bg-3)"}}/>
            </div>
            <div style={{fontFamily:"var(--font-mono)",fontSize:10.5,color:"var(--text-3)",textAlign:"right"}}>
              {it.nulls === 0 ? "—" : `${(it.nulls/max*100).toFixed(1)}%`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Error by year (synthetic — wider error tails at the end of the time window)
function ErrorByYear({ width=420, height=180 }) {
  const m = { l: 40, r: 12, t: 12, b: 30 };
  const years = [];
  for (let y=2017; y<=2023; y++) {
    const baseMae = 45000 + (y-2017)*4500 + Math.sin(y*1.3)*5500;
    years.push({ year: y, mae: baseMae });
  }
  const max = Math.max(...years.map(y=>y.mae))*1.1;
  const sx = (i) => m.l + (i/(years.length-1))*(width-m.l-m.r);
  const sy = (v) => height - m.b - (v/max)*(height-m.t-m.b);
  const bw = (width-m.l-m.r)/years.length * 0.6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{width:"100%",height:"auto",display:"block"}}>
      {[0, max/2, max].map((v,i)=>(
        <g key={i}>
          <line x1={m.l} x2={width-m.r} y1={sy(v)} y2={sy(v)} stroke="var(--line-soft)" strokeWidth="0.5"/>
          <text x={m.l-4} y={sy(v)+3} fill="var(--text-3)" fontSize="9" fontFamily="var(--font-mono)" textAnchor="end">
            {(v/1000).toFixed(0)}k
          </text>
        </g>
      ))}
      {years.map((y,i)=>(
        <g key={i}>
          <rect x={sx(i)-bw/2} y={sy(y.mae)} width={bw} height={sy(0)-sy(y.mae)}
            fill="var(--accent)" opacity="0.8" rx="2"/>
          <text x={sx(i)} y={height-12} fill="var(--text-3)"
            fontSize="9.5" fontFamily="var(--font-mono)" textAnchor="middle">{y.year}</text>
        </g>
      ))}
      <text x={(m.l+width-m.r)/2} y={height-1} fill="var(--text-2)"
        fontSize="10" fontFamily="var(--font-mono)" textAnchor="middle">test year</text>
    </svg>
  );
}

Object.assign(window, {
  LineChart, HBar, Histogram, ScatterChart,
  CorrelationMatrix, MissingByColumn, ErrorByYear
});
