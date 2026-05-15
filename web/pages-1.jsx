// Icons
const Icon = {
  data: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <ellipse cx="8" cy="3.5" rx="5" ry="1.6"/><path d="M3 3.5v9c0 0.9 2.2 1.6 5 1.6s5-0.7 5-1.6v-9"/><path d="M3 8c0 0.9 2.2 1.6 5 1.6s5-0.7 5-1.6"/></svg>,
  eda: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M2 13V3M2 13h11"/><path d="m5 10 2-3 2 2 3-5"/></svg>,
  train: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <circle cx="8" cy="8" r="3"/><path d="M8 2v2M8 12v2M2 8h2M12 8h2M4 4l1.5 1.5M10.5 10.5 12 12M4 12l1.5-1.5M10.5 5.5 12 4"/></svg>,
  evaluate: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <rect x="2" y="2" width="12" height="12" rx="1"/><path d="m5 11 2-3 2 2 2-5"/></svg>,
  predict: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <circle cx="8" cy="8" r="5"/><path d="M8 5v3l2 1"/></svg>,
  code: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="m6 5-4 3 4 3M10 5l4 3-4 3"/></svg>,
  game: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <rect x="1.5" y="5" width="13" height="7" rx="2"/><path d="M5 8.5h2M6 7.5v2M10 8l.01 0M12 9l.01 0"/></svg>,
  sun: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5 13 13M3 13l1.5-1.5M11.5 4.5 13 3"/></svg>,
  moon: (p) => <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M13 9.5A5.5 5.5 0 1 1 6.5 3a4.5 4.5 0 0 0 6.5 6.5z"/></svg>,
  upload: (p) => <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M8 11V3M5 6l3-3 3 3M3 13h10"/></svg>,
  play: (p) => <svg viewBox="0 0 16 16" width="11" height="11" fill="currentColor" {...p}>
    <path d="M4 3l8 5-8 5z"/></svg>,
  link: (p) => <svg viewBox="0 0 16 16" width="11" height="11" fill="none" stroke="currentColor" strokeWidth="1.4" {...p}>
    <path d="M7 9a3 3 0 0 0 4 0l2-2a3 3 0 0 0-4-4l-1 1"/>
    <path d="M9 7a3 3 0 0 0-4 0L3 9a3 3 0 0 0 4 4l1-1"/></svg>,
};

// ============ SIDEBAR ============
function Sidebar({ page, setPage, t, lang }) {
  const items = [
    { key: "data",     icon: "data" },
    { key: "eda",      icon: "eda" },
    { key: "train",    icon: "train" },
    { key: "evaluate", icon: "evaluate" },
    { key: "predict",  icon: "predict" },
    { key: "code",     icon: "code" },
    { key: "game",     icon: "game" },
  ];
  const M = window.FAOSTAT.metrics;
  const D = window.FAOSTAT.dataset;
  return (
    <aside className="sidebar">
      <div className="sidebar-section sidebar-nav-section">
        <div className="sidebar-label">workflow</div>
        <div className="nav-list">
          {items.map((it,i)=>{
            const I = Icon[it.icon];
            return (
              <div key={it.key}
                className={`nav-item ${page===it.key?"active":""}`}
                onClick={()=>setPage(it.key)}>
                <span className="nav-num">{String(i+1).padStart(2,"0")}</span>
                <I className="nav-icon" />
                <span>{t.nav[it.key]}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">{lang==="es"?"dataset":"dataset"}</div>
        <div className="sidebar-card">
          <h4>modeling_dataset.csv</h4>
          <dl className="kv-list">
            <dt>{t.metrics.rows}</dt><dd>{D.rows.toLocaleString()}</dd>
            <dt>{t.metrics.cols}</dt><dd>{D.cols}</dd>
            <dt>{t.common.target}</dt><dd>{D.target}</dd>
            <dt>{t.metrics.missing}</dt><dd>{(D.missing_rate*100).toFixed(1)}%</dd>
            <dt>year range</dt><dd>{D.year_range[0]}–{D.year_range[1]}</dd>
          </dl>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">model</div>
        <div className="sidebar-card">
          <h4 title="HistGradientBoostingRegressor">
            HGBR
            <span style={{
              fontFamily:"var(--font-mono)", fontSize:9.5,
              color:"var(--text-3)", fontWeight:400,
              letterSpacing:"0.02em", marginLeft:8
            }}>hist-gboost</span>
          </h4>
          <dl className="kv-list">
            <dt>train</dt><dd>{M.rows_train.toLocaleString()}</dd>
            <dt>test</dt><dd>{M.rows_test.toLocaleString()}</dd>
            <dt>predictors</dt><dd>{M.predictor_count}</dd>
            <dt>R² log</dt><dd style={{color:"var(--accent-2)"}}>{M.r2_log_target.toFixed(3)}</dd>
            <dt>status</dt><dd style={{color:"var(--accent-2)"}}>● fitted</dd>
          </dl>
        </div>
      </div>

      <div className="sidebar-section">
        <div className="sidebar-label">source</div>
        <div className="sidebar-card">
          <dl className="kv-list">
            <dt>FAOSTAT</dt><dd>v2024</dd>
            <dt>AF · ASTI</dt><dd>required</dd>
            <dt>AE · spend</dt><dd>context</dd>
            <dt>CISP</dt><dd>context</dd>
            <dt>BE · target</dt><dd>primary</dd>
          </dl>
        </div>
      </div>
    </aside>
  );
}

// ============ DATA PAGE ============
function DataPage({ t, lang }) {
  const F = window.FAOSTAT;
  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumb">workflow / 01 · {t.nav.data.toLowerCase()}</div>
          <h1>{t.pages.data.title}</h1>
          <p>{t.pages.data.sub}</p>
        </div>
        <div className="page-actions">
          <span className="chip ok"><span className="dot"/>SQLite · faostat_project.db</span>
          <button className="btn"><Icon.upload/> {lang==="es"?"Descargar CSV":"Download CSV"}</button>
        </div>
      </div>

      {/* Domains row */}
      <div className="panel" style={{marginBottom:16}}>
        <div className="panel-h">
          <h3>{lang==="es"?"Dominios FAOSTAT integrados":"FAOSTAT domains integrated"}</h3>
          <span className="panel-sub">data_download.py · 4 sources</span>
        </div>
        <div className="panel-b">
          <div className="grid" style={{gap:12}}>
            {F.domains.map(d=>(
              <div key={d.code} className="domain-card">
                <div className={`domain-tag ${d.color}`}>{d.code}</div>
                <div className="body">
                  <h4>{d.name}</h4>
                  <div className="role">{lang==="es"?d.role:d.role_en}</div>
                  <div className="desc">{lang==="es"?d.desc:d.desc_en}</div>
                </div>
                <div className="rows-info">
                  <span className="v">{d.rows}</span>
                  <span className="l">rows</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-main">
        <div className="grid" style={{gap:16}}>
          <div className="explainer">
            <h4>{lang==="es" ? "paso 02 · pipeline de datos" : "step 02 · data pipeline"}</h4>
            <p>{lang==="es"
              ? <>El pipeline descarga los 4 dominios FAOSTAT, normaliza nombres de columna y los inserta en <code>SQLite</code>. Después, <code>features.py</code> construye el <code>modeling_dataset.csv</code> con lags temporales (<code>target_lag_1..3</code>, <code>target_roll_mean_3</code>) y una bandera <code>has_asti_context</code> para indicar disponibilidad de I+D agrícola por país-año.</>
              : <>The pipeline downloads the 4 FAOSTAT domains, normalises column names and inserts them into <code>SQLite</code>. Then <code>features.py</code> builds <code>modeling_dataset.csv</code> with temporal lags (<code>target_lag_1..3</code>, <code>target_roll_mean_3</code>) and a <code>has_asti_context</code> flag indicating per-country-year R&D availability.</>}</p>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{t.common.preview} <span className="panel-sub">df.head(12) · 12 of 28 columns</span></h3>
              <span className="panel-sub">{F.dataset.rows.toLocaleString()} {t.metrics.rows} × {F.dataset.cols} {t.metrics.cols}</span>
            </div>
            <div className="panel-b flush">
              <div className="tbl-wrap">
                <table className="tbl">
                  <thead>
                    <tr>
                      <th className="idx">#</th>
                      <th>area</th><th>item</th><th>element</th>
                      <th className="num">year</th>
                      <th className="num">target_value</th>
                      <th className="num">target_lag_1</th>
                      <th className="num">target_lag_2</th>
                      <th className="num">year_since_1990</th>
                      <th className="num">has_asti</th>
                    </tr>
                  </thead>
                  <tbody>
                    {F.sampleRows.map((r,i)=>(
                      <tr key={i}>
                        <td className="idx">{i}</td>
                        <td>{r.area}</td>
                        <td>{r.item}</td>
                        <td className="muted">{r.element}</td>
                        <td className="num">{r.year}</td>
                        <td className="num" style={{color:"var(--accent-2)"}}>
                          {r.target_value.toLocaleString(undefined,{maximumFractionDigits:1})}
                        </td>
                        <td className="num">
                          {r.target_lag_1==null ? <span className="nullval">NaN</span>
                            : r.target_lag_1.toLocaleString(undefined,{maximumFractionDigits:1})}
                        </td>
                        <td className="num">
                          {r.target_lag_2==null ? <span className="nullval">NaN</span>
                            : r.target_lag_2.toLocaleString(undefined,{maximumFractionDigits:1})}
                        </td>
                        <td className="num muted">{r.year_since_1990}</td>
                        <td className="num">
                          <span style={{color: r.has_asti ? "var(--accent-2)" : "var(--text-3)"}}>
                            {r.has_asti}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{t.common.schema}</h3>
              <span className="panel-sub">29 columns · grouped</span>
            </div>
            <div className="panel-b flush">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>column</th>
                    <th>type</th>
                    <th>group</th>
                    <th className="num">nulls</th>
                    <th className="num">unique</th>
                  </tr>
                </thead>
                <tbody>
                  {F.schema.map(s=>(
                    <tr key={s.name}>
                      <td style={{maxWidth:280, overflow:"hidden", textOverflow:"ellipsis"}}>{s.name}</td>
                      <td className="muted">{s.type}</td>
                      <td>
                        <span className="chip" style={{
                          fontSize:9.5, padding:"1px 6px",
                          color: F.groupBadge[s.group]?.color,
                          borderColor: F.groupBadge[s.group]?.color,
                          background: "transparent"
                        }}>{F.groupBadge[s.group]?.label}</span>
                      </td>
                      <td className="num" style={{color: s.nulls>0?"var(--text-1)":"var(--text-3)"}}>
                        {s.nulls.toLocaleString()}
                      </td>
                      <td className="num muted">{s.unique ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right rail */}
        <div className="grid" style={{gap:16, alignContent:"start"}}>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Resumen objetivo":"Target summary"}</h3></div>
            <div className="panel-b">
              <dl className="kv-list" style={{fontSize:12}}>
                <dt>{t.metrics.target_mean}</dt><dd>{F.dataset.target_mean.toLocaleString(undefined,{maximumFractionDigits:0})}</dd>
                <dt>{t.metrics.target_median}</dt><dd>{F.dataset.target_median.toLocaleString()}</dd>
                <dt>std</dt><dd>{(F.dataset.target_std/1e6).toFixed(2)}M</dd>
                <dt>min / max</dt><dd>0 / 49.6M</dd>
                <dt>unit</dt><dd>TJ</dd>
              </dl>
              <div style={{marginTop:12, fontFamily:"var(--font-mono)", fontSize:10.5, color:"var(--text-3)",lineHeight:1.5}}>
                {lang==="es"
                  ? <>El objetivo es de cola larga, por eso se modela <code style={{color:"var(--accent)"}}>log1p(target)</code>.</>
                  : <>The target is long-tailed; the model fits <code style={{color:"var(--accent)"}}>log1p(target)</code>.</>}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Filas por dimensión":"Rows by dimension"}</h3></div>
            <div className="panel-b">
              <dl className="kv-list" style={{fontSize:12}}>
                <dt>areas</dt><dd>270</dd>
                <dt>items</dt><dd>15</dd>
                <dt>elements</dt><dd>2</dd>
                <dt>years</dt><dd>34 (1990–2023)</dd>
                <dt>units</dt><dd>TJ</dd>
              </dl>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Origen de datos":"Bulk source"}</h3></div>
            <div className="panel-b">
              <pre className="code" style={{padding:0,background:"transparent",border:0,fontSize:10.5,whiteSpace:"pre-wrap"}}>
{`bulks-faostat.fao.org/production
  ├─ ASTI_Researchers_E_All_Data.zip
  ├─ ASTI_Expenditures_E_All_Data.zip
  ├─ CISP_E_All_Data.zip
  └─ Bioenergy_E_All_Data.zip`}
              </pre>
              <a className="btn btn-ghost" href="https://www.fao.org/faostat/en/#data" target="_blank" rel="noopener"
                style={{marginTop:10, fontSize:11, padding:"4px 0"}}>
                <Icon.link/> fao.org/faostat
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ EDA PAGE ============
function EdaPage({ t, lang }) {
  const F = window.FAOSTAT;

  const worldSeries = [{ data: F.worldTrend, color: "var(--accent)" }];
  const itemSeries = Object.keys(F.itemTrend).map(it => ({
    data: F.itemTrend[it], color: F.itemColors[it]
  }));

  // log-target distribution (gaussian-ish, mean 9.02 std 3.55)
  const logBins = (() => {
    const bins = [];
    for (let b=0; b<=18; b+=0.6) {
      const c = b + 0.3;
      // bimodal: tail of zeros + main bulk around 9-10
      const v1 = 600 * Math.exp(-((c-9.4)**2)/(2*2.6*2.6));
      const v2 = 320 * Math.exp(-((c-1.2)**2)/(2*0.9*0.9));
      bins.push({ x: b, count: Math.round(v1 + v2) });
    }
    return bins;
  })();

  const numericFeats = ["target","lag_1","lag_2","roll_3","cisp_va","cisp_gfcf","af","ae"];
  const corrPairs = {
    "target":{target:1.0, lag_1:0.97, lag_2:0.93, roll_3:0.96, cisp_va:0.31, cisp_gfcf:0.28, af:0.22, ae:0.19},
    "lag_1":{target:0.97, lag_1:1.0, lag_2:0.97, roll_3:0.98, cisp_va:0.30, cisp_gfcf:0.27, af:0.21, ae:0.18},
    "lag_2":{target:0.93, lag_1:0.97, lag_2:1.0, roll_3:0.97, cisp_va:0.29, cisp_gfcf:0.26, af:0.21, ae:0.18},
    "roll_3":{target:0.96, lag_1:0.98, lag_2:0.97, roll_3:1.0, cisp_va:0.30, cisp_gfcf:0.27, af:0.22, ae:0.19},
    "cisp_va":{target:0.31, lag_1:0.30, lag_2:0.29, roll_3:0.30, cisp_va:1.0, cisp_gfcf:0.78, af:0.42, ae:0.55},
    "cisp_gfcf":{target:0.28, lag_1:0.27, lag_2:0.26, roll_3:0.27, cisp_va:0.78, cisp_gfcf:1.0, af:0.38, ae:0.49},
    "af":{target:0.22, lag_1:0.21, lag_2:0.21, roll_3:0.22, cisp_va:0.42, cisp_gfcf:0.38, af:1.0, ae:0.71},
    "ae":{target:0.19, lag_1:0.18, lag_2:0.18, roll_3:0.19, cisp_va:0.55, cisp_gfcf:0.49, af:0.71, ae:1.0},
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumb">workflow / 02 · {t.nav.eda.toLowerCase()}</div>
          <h1>{t.pages.eda.title}</h1>
          <p>{t.pages.eda.sub}</p>
        </div>
        <div className="page-actions">
          <span className="chip"><span className="dot"/>eda.py · reports/figures/</span>
        </div>
      </div>

      <div className="grid grid-main">
        <div className="grid" style={{gap:16}}>
          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Tendencia mundial de bioenergía":"World bioenergy trend"}</h3>
              <span className="panel-sub">sum(target_value) by year · TJ</span>
            </div>
            <div className="panel-b">
              <LineChart series={worldSeries} yLabel="TJ" area={true}/>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Tendencia por item":"Trend by item"}</h3>
              <span className="panel-sub">top 5 · 1990–2023</span>
            </div>
            <div className="panel-b">
              <LineChart series={itemSeries}/>
              <div style={{display:"flex",gap:14,marginTop:10,flexWrap:"wrap",
                fontFamily:"var(--font-mono)",fontSize:11}}>
                {Object.keys(F.itemColors).map(it=>(
                  <span key={it} style={{display:"inline-flex",alignItems:"center",gap:6}}>
                    <span style={{width:8,height:8,borderRadius:50,background:F.itemColors[it]}}/>
                    <span style={{color:"var(--text-1)"}}>{it}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="panel">
              <div className="panel-h">
                <h3>{lang==="es"?"Distribución de log(objetivo)":"log(target) distribution"}</h3>
                <span className="panel-sub">μ≈9.02 · σ≈3.55</span>
              </div>
              <div className="panel-b">
                <Histogram bins={logBins} xLabel="log1p(target_value)"/>
              </div>
            </div>

            <div className="panel">
              <div className="panel-h">
                <h3>{lang==="es"?"Top items por valor total":"Top items by total value"}</h3>
                <span className="panel-sub">TJ · all-time</span>
              </div>
              <div className="panel-b">
                <HBar items={F.topItemsByValue} labelKey="item" valueKey="value"
                  valueFormat={(v)=> v>=1e6 ? (v/1e6).toFixed(1)+"M" : (v/1e3).toFixed(0)+"k"}/>
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{gap:16,alignContent:"start"}}>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Correlación de variables numéricas":"Numeric feature correlation"}</h3></div>
            <div className="panel-b">
              <CorrelationMatrix features={numericFeats}
                getCorrelation={(a,b)=> corrPairs[a]?.[b] ?? 0}/>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Tasa de nulos por columna":"Missing rate by column"}</h3>
              <span className="panel-sub">19.3% overall</span>
            </div>
            <div className="panel-b">
              <MissingByColumn items={F.schema.filter(s => s.nulls > 0)}/>
            </div>
          </div>

          <div className="explainer alt">
            <h4>{lang==="es"?"observación":"observation"}</h4>
            <p>{lang==="es"
              ? <>Los <code>target_lag_*</code> y <code>target_roll_mean_3</code> son extremadamente predictivos (r ≈ 0.97 con el objetivo). Las variables de contexto (<code>cisp_*</code>, <code>af_*</code>, <code>ae_*</code>) aportan diferenciación entre países pero con correlación moderada al objetivo.</>
              : <>The <code>target_lag_*</code> and <code>target_roll_mean_3</code> features are extremely predictive (r ≈ 0.97 with the target). Context variables (<code>cisp_*</code>, <code>af_*</code>, <code>ae_*</code>) add between-country differentiation but correlate moderately with the target.</>}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ TRAIN PAGE ============
function TrainPage({ t, lang, training, runTraining, log }) {
  const F = window.FAOSTAT;
  const M = F.metrics;

  // Hyperparameter state, defaults to "best" from the project
  const [lr, setLr] = useState(0.08);
  const [maxIter, setMaxIter] = useState(140);
  const [maxLeaves, setMaxLeaves] = useState(31);
  const [splitPct, setSplitPct] = useState(80);
  const [folds, setFolds] = useState(3);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumb">workflow / 03 · {t.nav.train.toLowerCase()}</div>
          <h1>{t.pages.train.title}</h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:8,flexWrap:"wrap"}}>
            <span className="chip model-chip">
              <span className="dot"/>
              <span className="full">{t.pages.train.modelName}</span>
              <span className="short">HGBR</span>
            </span>
            <span style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-3)"}}>
              sklearn.ensemble · regression
            </span>
          </div>
          <p>{t.pages.train.sub}</p>
        </div>
        <div className="page-actions">
          <button className="btn btn-primary" onClick={runTraining} disabled={training}>
            <Icon.play/>{training ? t.refitting : t.refit}
            {!training && <span className="kbd">⌘ ⏎</span>}
          </button>
        </div>
      </div>

      <div className="grid grid-main">
        <div className="grid" style={{gap:16}}>
          <div className="explainer">
            <h4>{lang==="es" ? "paso 03 · pipeline de entrenamiento" : "step 03 · training pipeline"}</h4>
            <p>{lang==="es"
              ? <>Se aplica un <code>ColumnTransformer</code>: <code>SimpleImputer(median)</code> en numéricas y <code>SimpleImputer(most_frequent) → OrdinalEncoder(handle_unknown="use_encoded_value")</code> en categóricas. El estimador es <code>HistGradientBoostingRegressor(l2=0.05)</code>. La partición es temporal (año ≤ percentil 80 a train), y <code>GridSearchCV</code> con CV=3 optimiza <code>neg_root_mean_squared_error</code> sobre 80k filas.</>
              : <>A <code>ColumnTransformer</code> applies <code>SimpleImputer(median)</code> on numeric and <code>SimpleImputer(most_frequent) → OrdinalEncoder(handle_unknown="use_encoded_value")</code> on categorical. The estimator is <code>HistGradientBoostingRegressor(l2=0.05)</code>. The split is time-aware (year ≤ 80th percentile to train), and <code>GridSearchCV</code> with CV=3 optimises <code>neg_root_mean_squared_error</code> over an 80k sample.</>}</p>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Pipeline":"Pipeline"}</h3>
              <span className="panel-sub">sklearn.Pipeline</span>
            </div>
            <div className="panel-b">
              <div style={{display:"flex",gap:0,flexWrap:"wrap",alignItems:"center",fontFamily:"var(--font-mono)",fontSize:11}}>
                {[
                  { l:"ColumnTransformer", c:"var(--accent-3)", s:"impute + encode" },
                  { l:"OrdinalEncoder",    c:"var(--accent-5)", s:"unknown=-1" },
                  { l:"HGBR",             c:"var(--accent)",   s:"l2=0.05 · max_iter=140" },
                  { l:"log1p target",      c:"var(--accent-2)", s:"expm1 inverse" },
                ].map((step,i,arr)=>(
                  <React.Fragment key={i}>
                    <div style={{
                      padding:"8px 12px", border:"1px solid var(--line)",
                      borderRadius:5, background:"var(--bg-2)",
                      borderLeft: `3px solid ${step.c}`,
                    }}>
                      <div style={{color:"var(--text-0)",fontSize:12}}>{step.l}</div>
                      <div style={{color:"var(--text-3)"}}>{step.s}</div>
                    </div>
                    {i<arr.length-1 && (
                      <span style={{color:"var(--text-3)",margin:"0 6px"}}>→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Hiperparámetros":"Hyperparameters"}</h3>
              <span className="panel-sub">GridSearchCV grid</span>
            </div>
            <div className="panel-b">
              <div className="grid grid-2" style={{gap:18}}>
                <div className="field">
                  <label>learning_rate</label>
                  <div className="slider-row">
                    <input type="range" min="0.01" max="0.5" step="0.01" value={lr}
                      onChange={e=>setLr(parseFloat(e.target.value))}/>
                    <span className="val">{lr.toFixed(2)}</span>
                  </div>
                  <span className="hint">grid: 0.05, 0.08 · best=0.08</span>
                </div>
                <div className="field">
                  <label>max_iter</label>
                  <div className="slider-row">
                    <input type="range" min="40" max="400" step="20" value={maxIter}
                      onChange={e=>setMaxIter(parseInt(e.target.value))}/>
                    <span className="val">{maxIter}</span>
                  </div>
                  <span className="hint">grid: 80, 140 · best=140</span>
                </div>
                <div className="field">
                  <label>max_leaf_nodes</label>
                  <div className="slider-row">
                    <input type="range" min="7" max="127" step="4" value={maxLeaves}
                      onChange={e=>setMaxLeaves(parseInt(e.target.value))}/>
                    <span className="val">{maxLeaves}</span>
                  </div>
                  <span className="hint">grid: 31 · best=31</span>
                </div>
                <div className="field">
                  <label>l2_regularization</label>
                  <div className="slider-row">
                    <input type="range" min="0" max="1" step="0.05" defaultValue="0.05"/>
                    <span className="val">0.05</span>
                  </div>
                  <span className="hint">fixed</span>
                </div>
                <div className="field">
                  <label>random_state</label>
                  <input type="number" defaultValue="42"/>
                </div>
                <div className="field">
                  <label>scoring</label>
                  <select defaultValue="neg_rmse">
                    <option value="neg_rmse">neg_root_mean_squared_error</option>
                    <option>neg_mean_absolute_error</option>
                    <option>r2</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{t.common.training_log}</h3>
              <span className="panel-sub">stdout · train_model.py</span>
            </div>
            <div className="panel-b">
              <div className="log">
                {log.length === 0 && <div className="log-line"><span className="t">—</span>{lang==="es"?"esperando…":"waiting…"}</div>}
                {log.map((l,i)=>(
                  <div key={i} className="log-line">
                    <span className="t">{l.t}</span>
                    {l.kind==="ok" && <span className="ok">✓ </span>}
                    {l.kind==="info" && <span className="info">› </span>}
                    {l.msg}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{gap:16,alignContent:"start"}}>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Partición":"Split"}</h3></div>
            <div className="panel-b" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="field">
                <label>train cutoff (percentile of year)</label>
                <div className="slider-row">
                  <input type="range" min="50" max="95" step="5" value={splitPct}
                    onChange={e=>setSplitPct(parseInt(e.target.value))}/>
                  <span className="val">{splitPct}</span>
                </div>
                <span className="hint">{lang==="es"?"año ≤ p80 → train":"year ≤ p80 → train"}</span>
              </div>
              <div className="field">
                <label>cv folds</label>
                <div className="slider-row">
                  <input type="range" min="2" max="8" step="1" value={folds}
                    onChange={e=>setFolds(parseInt(e.target.value))}/>
                  <span className="val">{folds}</span>
                </div>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                <div style={{padding:10,background:"var(--bg-2)",border:"1px solid var(--line)",borderRadius:5}}>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-3)",textTransform:"uppercase"}}>train</div>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:16,color:"var(--accent)",marginTop:2}}>
                    {M.rows_train.toLocaleString()}
                  </div>
                </div>
                <div style={{padding:10,background:"var(--bg-2)",border:"1px solid var(--line)",borderRadius:5}}>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-3)",textTransform:"uppercase"}}>test</div>
                  <div style={{fontFamily:"var(--font-mono)",fontSize:16,color:"var(--accent-3)",marginTop:2}}>
                    {M.rows_test.toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Folds CV":"CV folds"}</h3></div>
            <div className="panel-b">
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-3)",marginBottom:8}}>
                neg_RMSE · 3-fold on 80k sample
              </div>
              {F.cvFolds.map(f=>(
                <div key={f.fold} style={{display:"grid",gridTemplateColumns:"30px 1fr 70px",
                  alignItems:"center",gap:8,fontFamily:"var(--font-mono)",fontSize:11,marginBottom:5}}>
                  <span style={{color:"var(--text-3)"}}>f{f.fold}</span>
                  <div style={{height:5,background:"var(--bg-2)",borderRadius:3,overflow:"hidden"}}>
                    <div style={{height:"100%",width:`${(f.r2/1)*100}%`,background:"var(--accent)"}}/>
                  </div>
                  <span style={{textAlign:"right",color:"var(--text-1)"}}>R²={f.r2.toFixed(3)}</span>
                </div>
              ))}
              <div style={{marginTop:14,paddingTop:12,borderTop:"1px solid var(--line-soft)"}}>
                <div style={{fontFamily:"var(--font-mono)",fontSize:10,color:"var(--text-3)",textTransform:"uppercase"}}>best params</div>
                <pre className="code" style={{padding:0,background:"transparent",border:0,marginTop:4,fontSize:10.5}}>
{`learning_rate = 0.08
max_iter      = 140
max_leaf_nodes= 31`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Sidebar, DataPage, EdaPage, TrainPage });
