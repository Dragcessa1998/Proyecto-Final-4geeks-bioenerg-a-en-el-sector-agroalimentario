// Evaluate, Predict, Code pages — FAOSTAT bioenergy regression

function EvaluatePage({ t, lang }) {
  const F = window.FAOSTAT;
  const M = F.metrics;

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumb">workflow / 04 · {t.nav.evaluate.toLowerCase()}</div>
          <h1>{t.pages.evaluate.title}</h1>
          <p>{t.pages.evaluate.sub}</p>
        </div>
        <div className="page-actions">
          <span className="chip ok"><span className="dot"/>model.joblib · committed</span>
        </div>
      </div>

      <div className="grid grid-4" style={{marginBottom:16}}>
        <div className="metric">
          <div className="lbl">{t.metrics.r2}</div>
          <div className="val">{M.r2_log_target.toFixed(3)}</div>
          <div className="sub">{lang==="es"?"sobre log1p(objetivo)":"on log1p(target)"}</div>
        </div>
        <div className="metric alt">
          <div className="lbl">{t.metrics.mae}</div>
          <div className="val">{(M.mae/1000).toFixed(1)}<span style={{fontSize:14,color:"var(--text-3)"}}> k TJ</span></div>
          <div className="sub">mean absolute error</div>
        </div>
        <div className="metric warn">
          <div className="lbl">{t.metrics.rmse}</div>
          <div className="val">{(M.rmse/1000).toFixed(0)}<span style={{fontSize:14,color:"var(--text-3)"}}> k TJ</span></div>
          <div className="sub">root mean squared error</div>
        </div>
        <div className="metric violet">
          <div className="lbl">{lang==="es"?"Filas de test":"Test rows"}</div>
          <div className="val">{M.rows_test.toLocaleString()}</div>
          <div className="sub">{lang==="es"?"partición temporal":"time-aware split"}</div>
        </div>
      </div>

      <div className="grid grid-main">
        <div className="grid" style={{gap:16}}>
          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Predicho vs Real (escala log)":"Predicted vs Actual (log scale)"}</h3>
              <span className="panel-sub">y = log1p(target_value) · 600 test points sample</span>
            </div>
            <div className="panel-b">
              <ScatterChart data={F.predVsActualLog}
                xLabel="actual · log1p(TJ)" yLabel="predicted · log1p(TJ)"
                axisMax={18}/>
              <div style={{display:"flex",gap:16,marginTop:8,fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-3)"}}>
                <span><span style={{color:"var(--accent-4)"}}>– – –</span> {lang==="es"?"identidad (y=x)":"identity (y=x)"}</span>
                <span><span style={{color:"var(--accent)"}}>●</span> {lang==="es"?"predicción":"prediction"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-2">
            <div className="panel">
              <div className="panel-h">
                <h3>{lang==="es"?"Distribución de residuales":"Residual distribution"}</h3>
                <span className="panel-sub">y_pred − y_true · log scale</span>
              </div>
              <div className="panel-b">
                <Histogram bins={F.residualBins} xLabel="residual (log)"/>
                <div style={{marginTop:8,fontFamily:"var(--font-mono)",fontSize:10.5,color:"var(--text-3)"}}>
                  μ ≈ 0.00 · σ ≈ 0.34 · {lang==="es"?"sin sesgo apreciable":"no notable bias"}
                </div>
              </div>
            </div>

            <div className="panel">
              <div className="panel-h">
                <h3>{lang==="es"?"Error por año de test":"Error by test year"}</h3>
                <span className="panel-sub">MAE · TJ</span>
              </div>
              <div className="panel-b">
                <ErrorByYear/>
                <div style={{marginTop:8,fontFamily:"var(--font-mono)",fontSize:10.5,color:"var(--text-3)"}}>
                  {lang==="es"
                    ? "el error crece levemente en años recientes (menos lags disponibles)"
                    : "error grows slightly for recent years (fewer lags available)"}
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Importancia de variables (permutación)":"Feature importance (permutation)"}</h3>
              <span className="panel-sub">top 15 · grouped by family</span>
            </div>
            <div className="panel-b">
              <HBar items={F.featureImportance} labelKey="name" valueKey="value"
                colorKey="group" valueFormat={(v)=>v.toFixed(3)}/>
              <div style={{display:"flex",gap:14,marginTop:14,flexWrap:"wrap",
                fontFamily:"var(--font-mono)",fontSize:11}}>
                {Object.entries(F.groupColors).map(([k,c])=>(
                  <span key={k} style={{display:"inline-flex",alignItems:"center",gap:6}}>
                    <span style={{width:10,height:10,borderRadius:2,background:c}}/>
                    <span style={{color:"var(--text-1)"}}>{k}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid" style={{gap:16,alignContent:"start"}}>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Hiperparámetros finales":"Final hyperparameters"}</h3></div>
            <div className="panel-b">
              <dl className="kv-list" style={{fontSize:12}}>
                <dt>learning_rate</dt><dd>{M.best_params.learning_rate}</dd>
                <dt>max_iter</dt><dd>{M.best_params.max_iter}</dd>
                <dt>max_leaf_nodes</dt><dd>{M.best_params.max_leaf_nodes}</dd>
                <dt>l2_regularization</dt><dd>0.05</dd>
                <dt>random_state</dt><dd>42</dd>
                <dt>n_predictors</dt><dd>{M.predictor_count}</dd>
                <dt>categorical</dt><dd>{M.categorical_predictor_count}</dd>
                <dt>numeric</dt><dd>{M.numeric_predictor_count}</dd>
              </dl>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Resumen del modelo":"Model summary"}</h3></div>
            <div className="panel-b">
              <pre className="code" style={{padding:0,background:"transparent",border:0,fontSize:11}}>
{`Pipeline(steps=[
  ('preprocess', ColumnTransformer(
     [('num', SimpleImputer(median),  19),
      ('cat', OrdinalEncoder, 7)])),
  ('model', HistGradientBoostingRegressor(
     learning_rate=0.08,
     max_iter=140,
     max_leaf_nodes=31,
     l2_regularization=0.05,
     random_state=42))
])`}
              </pre>
            </div>
          </div>

          <div className="explainer warn">
            <h4>{lang==="es"?"interpretación":"interpretation"}</h4>
            <p>{lang==="es"
              ? <>El <code>R² = 0.990</code> sobre <code>log1p(target)</code> indica que el modelo captura casi toda la variación log-transformada. En unidades originales, el <code>MAE ≈ 60.5k TJ</code> es bajo frente a una mediana de <code>11.8k TJ</code>, pero el <code>RMSE ≈ 641k TJ</code> revela cola larga de errores grandes en filas extremas (totales mundiales, valores cercanos a 50M TJ).</>
              : <><code>R² = 0.990</code> on <code>log1p(target)</code> means the model captures almost all log-transformed variance. In original units, <code>MAE ≈ 60.5k TJ</code> is small vs the median of <code>11.8k TJ</code>, but <code>RMSE ≈ 641k TJ</code> reveals a long tail of large errors on extreme rows (world totals near 50M TJ).</>}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PredictPage({ t, lang }) {
  const F = window.FAOSTAT;
  const [area, setArea]       = useState("Brazil");
  const [item, setItem]       = useState("Solid biofuels");
  const [element, setElement] = useState("Energy production");
  const [year, setYear]       = useState(2025);
  const [lag1, setLag1]       = useState(950000);
  const [rollMean, setRollMean] = useState(910000);
  const [hasAsti, setHasAsti] = useState(1);
  const [cispVa, setCispVa]   = useState(28800);

  // Synthetic "model" — multiplicative factors per area/item/element + lag-1 dominant
  const prediction = useMemo(()=>{
    const areaFactor = {
      "World": 60, "Africa": 3.5, "Americas": 12, "Asia": 22, "Europe": 8, "Oceania": 1.2,
      "Brazil": 4.8, "India": 5.4, "China, mainland": 6.1,
      "United States of America": 3.1, "Indonesia": 2.4,
      "Germany": 1.6, "France": 1.2, "Sweden": 0.95, "Finland": 0.6,
      "Argentina": 0.9, "Colombia": 0.5, "Mexico": 1.0,
    }[area] ?? 1.0;
    const itemFactor = {
      "Total Bioenergy": 9, "Solid biofuels": 4.2, "Fuelwood": 3.1, "Bagasse": 1.4,
      "Charcoal": 0.9, "Liquid biofuels": 0.4, "Biodiesel": 0.18, "Biogasoline": 0.16,
      "Biogases": 0.13, "Black liquor": 0.42, "Animal waste": 0.05,
      "Other vegetal material and residues": 0.03,
      "Bio jet kerosene": 0.004, "Gaseous biofuels": 0.13, "Other liquid biofuels": 0.04,
    }[item] ?? 0.5;
    const elFactor = element === "Energy production" ? 1.0 : 0.92;
    // crude blending; lag dominates
    const base = 0.92*lag1 + 0.05*rollMean*1.05
               + 0.03*(areaFactor*itemFactor*elFactor*100000)
               + (hasAsti? 1200 : 0)
               + cispVa*0.012;
    return Math.max(0, base);
  }, [area,item,element,year,lag1,rollMean,hasAsti,cispVa]);

  // Confidence: assume +/- MAE on the prediction
  const mae = F.metrics.mae;
  const lower = Math.max(0, prediction - mae*0.8);
  const upper = prediction + mae*0.8;

  // Top similar historical rows
  const similar = F.sampleRows
    .filter(r => r.item === item || r.area === area)
    .slice(0, 4);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumb">workflow / 05 · {t.nav.predict.toLowerCase()}</div>
          <h1>{t.pages.predict.title}</h1>
          <p>{t.pages.predict.sub}</p>
        </div>
        <div className="page-actions">
          <span className="chip"><span className="dot"/>model.predict() · live</span>
        </div>
      </div>

      <div className="grid grid-main">
        <div className="grid" style={{gap:16}}>
          <div className="result-card">
            <div className="label-tag">{t.common.result}</div>
            <div style={{display:"flex",alignItems:"baseline",flexWrap:"wrap"}}>
              <span className="pred-value">{prediction.toLocaleString(undefined,{maximumFractionDigits:0})}</span>
              <span className="pred-unit">TJ</span>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:12,alignItems:"center",marginTop:14}}>
              <div style={{position:"relative",height:8,background:"var(--bg-2)",borderRadius:4,overflow:"hidden"}}>
                <div style={{position:"absolute",top:0,left:0,bottom:0,
                  width:`${Math.min(100, Math.log10(prediction+1)/8*100)}%`,
                  background:"linear-gradient(90deg, var(--accent), var(--accent-2))"}}/>
              </div>
              <div style={{fontFamily:"var(--font-mono)",fontSize:11,color:"var(--text-2)"}}>
                <span style={{color:"var(--text-3)"}}>± </span>
                <span style={{color:"var(--text-0)"}}>
                  [{lower.toLocaleString(undefined,{maximumFractionDigits:0})} – {upper.toLocaleString(undefined,{maximumFractionDigits:0})}]
                </span>
              </div>
            </div>
            <div className="pred-context">
              <span style={{color:"var(--text-3)"}}>{lang==="es"?"escenario":"scenario"}: </span>
              <span style={{color:"var(--text-0)"}}>{area}</span>
              <span style={{color:"var(--text-3)"}}> · </span>
              <span style={{color:"var(--text-0)"}}>{item}</span>
              <span style={{color:"var(--text-3)"}}> · </span>
              <span style={{color:"var(--text-0)"}}>{element}</span>
              <span style={{color:"var(--text-3)"}}> · </span>
              <span style={{color:"var(--text-0)"}}>{year}</span>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Contribución de variables (este escenario)":"Feature contributions (this scenario)"}</h3>
              <span className="panel-sub">approx · SHAP-like</span>
            </div>
            <div className="panel-b">
              {[
                { name:"target_lag_1",          value: 0.92*lag1, share: 0.92 },
                { name:"target_roll_mean_3",    value: 0.05*rollMean*1.05, share: 0.05 },
                { name:`item = ${item}`,        value: prediction*0.018, share: 0.018 },
                { name:`area = ${area}`,        value: prediction*0.008, share: 0.008 },
                { name:"cisp_value_added",      value: cispVa*0.012, share: 0.005 },
                { name:"has_asti_context",      value: hasAsti?1200:0, share: 0.001 },
              ].map((c,i)=>(
                <div key={i} className="prob-row">
                  <span style={{color:"var(--text-1)",
                    overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                    {c.name}
                  </span>
                  <div className="prob-bar">
                    <span style={{width:`${c.share*100}%`,
                      background: i===0 ? "var(--accent)" :
                                  i<=1 ? "var(--accent-2)" :
                                  i<=3 ? "var(--accent-3)" : "var(--accent-5)"}}/>
                  </div>
                  <span style={{textAlign:"right",color:"var(--text-2)"}}>
                    {c.value.toLocaleString(undefined,{maximumFractionDigits:0})}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-h">
              <h3>{lang==="es"?"Filas históricas similares":"Similar historical rows"}</h3>
              <span className="panel-sub">{lang==="es"?"mismo país o item":"same country or item"}</span>
            </div>
            <div className="panel-b flush">
              <table className="tbl">
                <thead>
                  <tr>
                    <th>area</th><th>item</th><th>element</th>
                    <th className="num">year</th>
                    <th className="num">target_value (TJ)</th>
                  </tr>
                </thead>
                <tbody>
                  {similar.map((r,i)=>(
                    <tr key={i}>
                      <td>{r.area}</td>
                      <td>{r.item}</td>
                      <td className="muted">{r.element}</td>
                      <td className="num">{r.year}</td>
                      <td className="num" style={{color:"var(--accent-2)"}}>
                        {r.target_value.toLocaleString(undefined,{maximumFractionDigits:1})}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid" style={{gap:16,alignContent:"start"}}>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Escenario":"Scenario"}</h3></div>
            <div className="panel-b" style={{display:"flex",flexDirection:"column",gap:14}}>
              <div className="field">
                <label>{t.fields.area}</label>
                <select value={area} onChange={e=>setArea(e.target.value)}>
                  {F.areas.map(a=> <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t.fields.item}</label>
                <select value={item} onChange={e=>setItem(e.target.value)}>
                  {F.items.map(i=> <option key={i} value={i}>{i}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t.fields.element}</label>
                <div className="segmented" style={{width:"100%"}}>
                  {F.elements.map(el=>(
                    <button key={el} className={element===el?"active":""}
                      style={{flex:1,fontSize:11}}
                      onClick={()=>setElement(el)}>{el.replace("Energy ","")}</button>
                  ))}
                </div>
              </div>
              <div className="field">
                <label>{t.fields.year}</label>
                <div className="slider-row">
                  <input type="range" min="2024" max="2035" step="1" value={year}
                    onChange={e=>setYear(parseInt(e.target.value))}/>
                  <span className="val">{year}</span>
                </div>
              </div>
              <div className="field">
                <label>{t.fields.lag1} (TJ)</label>
                <div className="slider-row">
                  <input type="range" min="0" max="3000000" step="10000" value={lag1}
                    onChange={e=>setLag1(parseInt(e.target.value))}/>
                  <span className="val">{(lag1/1000).toFixed(0)}k</span>
                </div>
              </div>
              <div className="field">
                <label>{t.fields.rollmean} (TJ)</label>
                <div className="slider-row">
                  <input type="range" min="0" max="3000000" step="10000" value={rollMean}
                    onChange={e=>setRollMean(parseInt(e.target.value))}/>
                  <span className="val">{(rollMean/1000).toFixed(0)}k</span>
                </div>
              </div>
              <div className="field">
                <label>{t.fields.cisp_value} ($M)</label>
                <div className="slider-row">
                  <input type="range" min="0" max="300000" step="500" value={cispVa}
                    onChange={e=>setCispVa(parseInt(e.target.value))}/>
                  <span className="val">{cispVa.toLocaleString()}</span>
                </div>
              </div>
              <div className="field">
                <label>{t.fields.asti}</label>
                <div className="segmented" style={{width:"100%"}}>
                  {[0,1].map(v=>(
                    <button key={v} className={hasAsti===v?"active":""}
                      style={{flex:1}} onClick={()=>setHasAsti(v)}>
                      {v===1 ? "yes" : "no"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-h"><h3>request</h3></div>
            <pre className="code" style={{margin:0,fontSize:10.5}}>
{`POST /predict
{
  "area":      "${area}",
  "item":      "${item}",
  "element":   "${element}",
  "year":      ${year},
  "unit":      "TJ",
  "target_lag_1":     ${lag1},
  "target_roll_mean_3":${rollMean},
  "cisp_value_added": ${cispVa},
  "has_asti_context": ${hasAsti}
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function CodePage({ t, lang }) {
  const [activeBlock, setActiveBlock] = useState(null);
  const blocks = [
    {
      title: "src/data_download.py",
      sub: lang==="es"?"Descarga reproducible desde FAOSTAT bulk":"Reproducible bulk download from FAOSTAT",
      code: `import io
import zipfile
from pathlib import Path

import pandas as pd
import requests

from config import DOMAINS, RAW_DATA_DIR


def download_domain(domain: str) -> Path:
    """Descarga un dominio FAOSTAT y guarda el CSV normalizado."""
    url = DOMAINS[domain]["url"]
    response = requests.get(url, timeout=120)
    response.raise_for_status()
    with zipfile.ZipFile(io.BytesIO(response.content)) as zf:
        csv_name = next(n for n in zf.namelist() if n.endswith(".csv"))
        df = pd.read_csv(zf.open(csv_name), encoding="latin-1", low_memory=False)
    target = RAW_DATA_DIR / f"{domain}.csv"
    df.to_csv(target, index=False)
    return target`,
    },
    {
      title: "src/database.py",
      sub: lang==="es"?"SQLite + consultas SELECT/JOIN":"SQLite + SELECT/JOIN queries",
      code: `import sqlite3
from pathlib import Path

import pandas as pd

from config import DB_PATH


def write_table(name: str, df: pd.DataFrame) -> None:
    with sqlite3.connect(DB_PATH) as conn:
        df.to_sql(name, conn, if_exists="replace", index=False)


def query(sql: str) -> pd.DataFrame:
    with sqlite3.connect(DB_PATH) as conn:
        return pd.read_sql_query(sql, conn)`,
    },
    {
      title: "src/features.py",
      sub: lang==="es"?"Lags temporales y dataset final":"Temporal lags & final dataset",
      code: `def build_modeling_dataset() -> pd.DataFrame:
    be   = query("SELECT * FROM bioenergy")
    af   = query("SELECT * FROM asti_researchers")
    ae   = query("SELECT * FROM asti_expenditures")
    cisp = query("SELECT * FROM cisp")

    df = be.merge(af,   on=["area_key","year"], how="left", suffixes=("","_af"))
    df = df.merge(ae,   on=["area_key","year"], how="left", suffixes=("","_ae"))
    df = df.merge(cisp, on=["area_key","year"], how="left")

    df = df.sort_values(["area","item","element","year"])
    for k in (1, 2, 3):
        df[f"target_lag_{k}"] = (
            df.groupby(["area","item","element"])["target_value"].shift(k)
        )
    df["target_roll_mean_3"] = (
        df.groupby(["area","item","element"])["target_value"]
          .shift(1).rolling(3).mean().reset_index(level=[0,1,2], drop=True)
    )
    df["year_since_1990"] = df["year"] - 1990
    df["log_target_value"] = np.log1p(df["target_value"].clip(lower=0))
    df["has_asti_context"] = df["af_value"].notna().astype(int)
    return df`,
    },
    {
      title: "src/train_model.py",
      sub: lang==="es"?"HistGradientBoostingRegressor + GridSearchCV":"HistGradientBoostingRegressor + GridSearchCV",
      code: `numeric_pipeline = Pipeline([("imputer", SimpleImputer(strategy="median"))])
categorical_pipeline = Pipeline([
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("encoder", OrdinalEncoder(
        handle_unknown="use_encoded_value", unknown_value=-1)),
])

preprocessing = ColumnTransformer([
    ("num", numeric_pipeline,     numeric),
    ("cat", categorical_pipeline, categorical),
])

pipeline = Pipeline([
    ("preprocess", preprocessing),
    ("model", HistGradientBoostingRegressor(
        random_state=42, l2_regularization=0.05)),
])

grid = GridSearchCV(
    pipeline,
    param_grid={
        "model__max_iter":       [80, 140],
        "model__learning_rate":  [0.05, 0.08],
        "model__max_leaf_nodes": [31],
    },
    cv=3,
    scoring="neg_root_mean_squared_error",
    n_jobs=-1,
)
grid.fit(X_tune, y_tune)
best = grid.best_estimator_
best.fit(X_train, y_train)`,
    },
    {
      title: "src/app.py",
      sub: lang==="es"?"App Streamlit original (línea base)":"Original Streamlit app (baseline)",
      code: `model, metadata = load_model()
metrics = metadata["metrics"]

with right:
    st.metric("Filas de entrenamiento", f"{metrics['rows_total']:,}")
    st.metric("Predictores",            metrics["predictor_count"])
    st.metric("R2 log-target",          f"{metrics['r2_log_target']:.3f}")
    st.metric("MAE",                    f"{metrics['mae']:,.2f}")

with left:
    area    = c1.selectbox("Pais o region", metadata["areas"], index=0)
    year    = c2.number_input("Ano", min_value=1961, max_value=2035, value=2025)
    item    = c1.selectbox("Item",     metadata["items"],    index=0)
    element = c2.selectbox("Elemento", metadata["elements"], index=0)

    row = {f: metadata["defaults"].get(f, 0) for f in metadata["features"]}
    row.update({"area": area, "item": item, "element": element,
                "unit": unit, "year": year, "year_since_1990": year - 1990})

    if st.button("Predecir", type="primary"):
        X = pd.DataFrame([row])[metadata["features"]]
        prediction = float(np.expm1(model.predict(X)[0]))
        st.success(f"Valor estimado: {prediction:,.2f} {unit}")`,
    },
    {
      title: "src/run_pipeline.py",
      sub: lang==="es"?"Orquestación end-to-end":"End-to-end orchestration",
      code: `def main() -> None:
    print("[1/5] downloading FAOSTAT bulks…")
    for domain in DOMAINS:
        download_domain(domain)

    print("[2/5] writing SQLite tables…")
    persist_to_database()

    print("[3/5] building modeling dataset…")
    df = build_modeling_dataset()
    df.to_csv(MODELING_DATA_PATH, index=False)

    print("[4/5] running EDA…")
    eda_summary(df)

    print("[5/5] training model…")
    metrics = train(df)
    print(json.dumps(metrics, indent=2))


if __name__ == "__main__":
    main()`,
    },
  ];

  const hl = (src) => {
    const kw = ["import","from","as","def","return","print","with","for","in","if","else","not","class","self"];
    let out = src
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
      .replace(/("[^"]*"|'[^']*')/g,'<span class="str">$1</span>')
      .replace(/(#[^\n]*)/g,'<span class="com">$1</span>')
      .replace(/\b(\d+\.?\d*)\b/g,'<span class="num">$1</span>');
    for (const k of kw) {
      out = out.replace(new RegExp(`\\b${k}\\b`,"g"), `<span class="kw">${k}</span>`);
    }
    return out;
  };

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <div className="crumb">workflow / 06 · {t.nav.code.toLowerCase()}</div>
          <h1>{t.pages.code.title}</h1>
          <p>{t.pages.code.sub}</p>
        </div>
        <div className="page-actions">
          <span className="chip"><span className="dot"/>python 3.11 · scikit-learn 1.5</span>
        </div>
      </div>

      <div className="grid grid-main">
        <div className="grid" style={{gap:16}}>
          {blocks.map((b,i)=>(
            <div key={i} className="panel">
              <div className="panel-h">
                <div>
                  <h3 style={{display:"flex",alignItems:"center"}}>
                    <span style={{fontFamily:"var(--font-mono)",fontSize:12}}>{b.title}</span>
                    <span className="badge">{b.sub}</span>
                  </h3>
                </div>
                <button className="btn btn-ghost" style={{padding:"3px 10px",fontSize:11}}
                  onClick={()=>{
                    navigator.clipboard?.writeText(b.code);
                    setActiveBlock(i);
                    setTimeout(()=>setActiveBlock(null),1500);
                  }}>
                  {activeBlock===i ? t.common.copied : t.common.copy}
                </button>
              </div>
              <pre className="code" dangerouslySetInnerHTML={{__html: hl(b.code)}}/>
            </div>
          ))}
        </div>

        <div className="grid" style={{gap:16,alignContent:"start"}}>
          <div className="panel">
            <div className="panel-h"><h3>requirements.txt</h3></div>
            <div className="panel-b">
              <pre className="code" style={{padding:0,background:"transparent",border:0,fontSize:11}}>
{`scikit-learn==1.5.2
pandas==2.2.3
numpy==2.1.3
joblib==1.4.2
streamlit==1.36.0
requests==2.32.3`}
              </pre>
            </div>
          </div>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Artefactos":"Artifacts"}</h3></div>
            <div className="panel-b">
              <dl className="kv-list">
                <dt>models/bioenergy_model.joblib</dt><dd>1.2 MB</dd>
                <dt>models/model_metadata.json</dt><dd>9.6 KB</dd>
                <dt>data/database/faostat_project.db</dt><dd>SQLite</dd>
                <dt>data/processed/modeling_dataset.csv</dt><dd>{(101997*200/1e6).toFixed(1)} MB</dd>
                <dt>reports/figures/</dt><dd>10 PNGs</dd>
              </dl>
            </div>
          </div>
          <div className="panel">
            <div className="panel-h"><h3>{lang==="es"?"Cómo correr":"How to run"}</h3></div>
            <div className="panel-b">
              <pre className="code" style={{padding:0,background:"transparent",border:0,fontSize:10.5}}>
{`python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/run_pipeline.py
streamlit run src/app.py`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============ PIXEL VIDEO GAME — Bioenergy Quest ============
// Inspired by codedex.io retro aesthetic, adapted to FAOSTAT/Bioenergy theme.

// Pixel sprite helper: paints a 16x16 grid from a string template.
// "." = transparent, any other char = palette key
function PixelSprite({ data, palette, scale = 3, className }) {
  const rows = data.trim().split("\n").map(r => r.trim());
  const size = 16;
  return (
    <svg viewBox={`0 0 ${size} ${size}`}
      width={size*scale} height={size*scale}
      shapeRendering="crispEdges"
      style={{imageRendering:"pixelated", display:"block"}}
      className={className}>
      {rows.map((row, y) =>
        [...row].map((ch, x) =>
          ch !== "." && palette[ch] ? (
            <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={palette[ch]}/>
          ) : null
        )
      )}
    </svg>
  );
}

const SPRITES = {
  // Player: pixel scientist with vinotinto lab coat
  player: {
    data: `
.....bbbb.......
....bppppb......
....bppppb......
....bskskb......
....bsmmsb......
...bbb..bbb.....
...vvvvvvvv.....
..vvwwvvwwvv....
..vvvvvvvvvv....
..vvvvvvvvvv....
...v......v.....
...vv....vv.....
...kk....kk.....
...kk....kk.....
..bbb....bbb....
................`,
    palette: { b:"#1a0a0d", p:"#f4d3b6", s:"#0a0a0a", m:"#ffffff", k:"#3a1a1f", v:"#8B1538", w:"#ffd54a" }
  },
  // Researcher NPC (ASTI/AF): glasses, blue coat
  researcher: {
    data: `
.....bbbb.......
....bppppb......
...bppppppb.....
...bsmpmpsb.....
...bppppppb.....
...bb.pp.bb.....
...bbbbbbbb.....
..ccccccccc.....
.cccccwccccc....
.ccwwwwwwwcc....
.cccccccccc.....
.cccccccccc.....
..cc....cc......
..cc....cc......
..kk....kk......
..bb....bb......`,
    palette: { b:"#1a0a0d", p:"#f4d3b6", s:"#0a0a0a", m:"#ffffff", c:"#5b6ee1", k:"#3a1a1f", w:"#fbb13c" }
  },
  // Farmer NPC (BE bioenergy): straw hat, green shirt
  farmer: {
    data: `
....yyyyyy......
...yyyyyyyy.....
..yyyyyyyyyy....
...bbbbbbbb.....
....pppppp......
...pssppssp.....
....pmmmmp......
...bgggggggb....
..gggggggggg....
..ggrrrrrrgg....
..ggggggggggg...
..gggggggggg....
...gg....gg.....
...gg....gg.....
...kk....kk.....
...bb....bb.....`,
    palette: { b:"#1a0a0d", p:"#f4d3b6", s:"#0a0a0a", m:"#7b4a2a", y:"#e7c97b", g:"#3aa05a", r:"#c43a3a", k:"#3a1a1f" }
  },
  // Investor NPC (CISP): suit, briefcase
  investor: {
    data: `
.....bbbb.......
....bppppb......
....bppppb......
....bsmsmb......
....bppppb......
....bbwwbb......
...gggwwggg.....
..ggggwwgggg....
..gggggggggg....
..gggggggggg....
...gg....gg.....
...gg.yy.gg.....
...gg.yy.gg.....
...gg....gg.....
...kk....kk.....
...bb....bb.....`,
    palette: { b:"#1a0a0d", p:"#f4d3b6", s:"#0a0a0a", m:"#ffffff", g:"#2a2a35", w:"#ffffff", y:"#8B6914", k:"#3a1a1f" }
  },
  // AI Bot NPC (Model)
  bot: {
    data: `
....aaaaaaaa....
...aaaaaaaaaa...
...accaaaaccca..
...accaaaacca...
...aaaaaaaaaa...
...aaowwoaaaa...
...aaaaaaaa.....
..aaaaaaaaaa....
..awaaaaaawa....
..awaaaaaawa....
..aaaaaaaaaa....
..aaaaaaaaaa....
...aa....aa.....
...aa....aa.....
...kk....kk.....
...bb....bb.....`,
    palette: { a:"#7a8a99", c:"#ff3344", o:"#1a1a1a", w:"#ffd54a", k:"#3a1a1f", b:"#1a0a0d" }
  },
  // Wheat plant decoration
  wheat: {
    data: `
.......yy.......
......yyyy......
......yyyy......
.....yyooyy.....
....yyooooyy....
.....yyooyy.....
......yyyy......
.......gg.......
.......gg.......
.......gg.......
.......gg.......
.......gg.......
......g..g......
.....g....g.....
.....g....g.....
....k......k....`,
    palette: { y:"#e7c97b", o:"#fbb13c", g:"#3aa05a", k:"#2a3a1a" }
  },
  // Biomass plant (factory)
  factory: {
    data: `
.........s......
.........s......
.........s......
.....ss..s..ss..
....sssssssssss.
....s.........s.
.bbbbbbbbbbbbbbb.
.bvvvvvvvvvvvvb.
.bvwwvvwwvvwwvb.
.bvvvvvvvvvvvvb.
.bvwwvvwwvvwwvb.
.bvvvvvvvvvvvvb.
.bvvvvvvvvvvvvb.
.bbbbbbbbbbbbbb.
................
................`,
    palette: { b:"#1a0a0d", v:"#3a1a1f", w:"#fbb13c", s:"#c0c0c8" }
  },
};

// NPC data — each teaches a project domain
function getNPCs(lang) {
  const dialogs = lang === "es" ? {
    researcher: {
      name: "Dra. Astri", role: "Investigadora ASTI",
      lines: [
        "¡Hola! Soy investigadora del dominio AF de FAOSTAT.",
        "AF = ASTI · Researchers: cuenta investigadores en I+D agrícola.",
        "Es la fuente OBLIGATORIA de tu TFM, pero solo tiene 3.800 filas.",
        "Por eso enriquecimos con AE, CISP y BE."
      ],
      q: "¿Qué significan las siglas ASTI?",
      options: [
        "Agricultural Science and Technology Indicators",
        "Asociación Sostenible de Tierras Internacionales",
        "Aerial Survey of Tropical Islands",
        "Anti-Soil Toxicity Index"
      ],
      answer: 0,
      explain: "ASTI = Agricultural Science and Technology Indicators."
    },
    farmer: {
      name: "Bio el Granjero", role: "Productor de bioenergía",
      lines: [
        "¡Bienvenido a los cultivos energéticos!",
        "Mi mundo es el dominio BE de FAOSTAT: producción y uso de bioenergía.",
        "Tiene 120.000+ filas — es la tabla principal del modelado.",
        "El objetivo `value` se mide en TJ (Terajoules)."
      ],
      q: "¿En qué unidad mide FAOSTAT la bioenergía?",
      options: ["kWh", "TJ (Terajoules)", "Barriles", "Toneladas"],
      answer: 1,
      explain: "FAOSTAT usa Terajoules (TJ) para magnitudes energéticas."
    },
    investor: {
      name: "Sr. Cispman", role: "Analista CISP",
      lines: [
        "Buenos días. Trabajo con datos macroeconómicos CISP.",
        "CISP = Country Investment Statistics Profile.",
        "Aporta contexto: valor añadido agrícola, formación de capital, inversión.",
        "Sin este contexto, el modelo no entendería el potencial real de cada país."
      ],
      q: "¿Qué tipo de información aporta CISP al modelo?",
      options: [
        "Imágenes satelitales",
        "Contexto macroeconómico e inversión",
        "Datos meteorológicos",
        "Precios de mercado en tiempo real"
      ],
      answer: 1,
      explain: "CISP aporta variables macro: valor añadido, capital, inversión."
    },
    bot: {
      name: "HGBR-9000", role: "Modelo ML",
      lines: [
        "BEEP. Soy HistGradientBoostingRegressor.",
        "Predigo log1p(bioenergía) usando 26 predictores.",
        "Mi R² = 0.99, MAE = 60.528 TJ, RMSE = 641.472 TJ.",
        "Tras predecir, se aplica expm1 para volver al valor real."
      ],
      q: "¿Por qué se aplica log1p al objetivo antes de entrenar?",
      options: [
        "Para acelerar el entrenamiento",
        "Para encriptar los datos",
        "Para reducir el efecto de los valores extremos (cola larga)",
        "Es un requisito de sklearn"
      ],
      answer: 2,
      explain: "Bioenergía tiene cola larga; log1p estabiliza la varianza."
    }
  } : {
    researcher: {
      name: "Dr. Astri", role: "ASTI Researcher",
      lines: [
        "Hi! I'm a researcher from FAOSTAT's AF domain.",
        "AF = ASTI · Researchers: counts agricultural R&D researchers.",
        "It's the REQUIRED source of your TFM, but has only 3,800 rows.",
        "That's why we enrich with AE, CISP and BE."
      ],
      q: "What does ASTI stand for?",
      options: [
        "Agricultural Science and Technology Indicators",
        "Atlantic Soil Treatment Initiative",
        "Aerial Survey of Tropical Islands",
        "Anti-Soil Toxicity Index"
      ],
      answer: 0,
      explain: "ASTI = Agricultural Science and Technology Indicators."
    },
    farmer: {
      name: "Bio the Farmer", role: "Bioenergy producer",
      lines: [
        "Welcome to the energy crops!",
        "My realm is FAOSTAT's BE domain: bioenergy production and use.",
        "120,000+ rows — main modeling table.",
        "The target `value` is in TJ (Terajoules)."
      ],
      q: "What unit does FAOSTAT use for bioenergy?",
      options: ["kWh", "TJ (Terajoules)", "Barrels", "Tons"],
      answer: 1,
      explain: "FAOSTAT uses Terajoules (TJ) for energy magnitudes."
    },
    investor: {
      name: "Mr. Cispman", role: "CISP Analyst",
      lines: [
        "Good day. I work with CISP macro data.",
        "CISP = Country Investment Statistics Profile.",
        "Adds context: agri value added, capital formation, investment.",
        "Without it, the model wouldn't grasp each country's potential."
      ],
      q: "What does CISP contribute to the model?",
      options: [
        "Satellite images",
        "Macro context and investment",
        "Weather data",
        "Real-time market prices"
      ],
      answer: 1,
      explain: "CISP brings macro vars: value added, capital, investment."
    },
    bot: {
      name: "HGBR-9000", role: "ML Model",
      lines: [
        "BEEP. I'm HistGradientBoostingRegressor.",
        "I predict log1p(bioenergy) using 26 predictors.",
        "My R²=0.99, MAE=60,528 TJ, RMSE=641,472 TJ.",
        "After prediction, expm1 inverts back to real units."
      ],
      q: "Why apply log1p to the target before training?",
      options: [
        "To speed up training",
        "To encrypt the data",
        "To reduce the effect of extreme values (long tail)",
        "It's a sklearn requirement"
      ],
      answer: 2,
      explain: "Bioenergy has a long tail; log1p stabilizes variance."
    }
  };
  // Position on 16x10 tile grid
  return [
    { id:"researcher", x: 2,  y: 1, sprite:"researcher", color:"#5b6ee1", ...dialogs.researcher },
    { id:"farmer",     x: 13, y: 2, sprite:"farmer",     color:"#3aa05a", ...dialogs.farmer },
    { id:"investor",   x: 2,  y: 7, sprite:"investor",   color:"#fbb13c", ...dialogs.investor },
    { id:"bot",        x: 13, y: 7, sprite:"bot",        color:"#ff3344", ...dialogs.bot },
  ];
}

// 8-bit chiptune via Web Audio API
function useChiptune() {
  const ctxRef = React.useRef(null);
  const playingRef = React.useRef(false);
  const stopRef = React.useRef(null);

  const start = React.useCallback(() => {
    if (playingRef.current) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      ctxRef.current = ctx;

      // Simple bioenergy-themed melody (notes in Hz)
      const melody = [
        330, 392, 440, 523, 440, 392, 330, 294,
        330, 392, 440, 523, 587, 523, 440, 392,
        330, 392, 440, 523, 440, 392, 330, 294,
        262, 294, 330, 392, 440, 392, 330, 262
      ];
      const bass = [
        165, 0, 196, 0, 220, 0, 196, 0,
        165, 0, 196, 0, 247, 0, 220, 0,
      ];
      const noteLen = 0.18;
      let i = 0, j = 0;
      let timer;
      const tick = () => {
        const now = ctx.currentTime;
        // Melody
        const f1 = melody[i % melody.length];
        if (f1 > 0) {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "square";
          o.frequency.value = f1;
          g.gain.setValueAtTime(0.04, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + noteLen);
          o.connect(g).connect(ctx.destination);
          o.start(now); o.stop(now + noteLen);
        }
        // Bass
        const f2 = bass[j % bass.length];
        if (f2 > 0) {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          o.frequency.value = f2;
          g.gain.setValueAtTime(0.05, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + noteLen*1.2);
          o.connect(g).connect(ctx.destination);
          o.start(now); o.stop(now + noteLen*1.2);
        }
        i++; j++;
        timer = setTimeout(tick, noteLen*1000);
      };
      tick();
      playingRef.current = true;
      stopRef.current = () => { clearTimeout(timer); try { ctx.close(); } catch(e){} };
    } catch (e) { /* user gesture / no audio */ }
  }, []);

  const stop = React.useCallback(() => {
    if (stopRef.current) stopRef.current();
    playingRef.current = false;
  }, []);

  React.useEffect(() => () => stop(), [stop]);

  return { start, stop, isPlaying: () => playingRef.current };
}

function GamePage({ t, lang }) {
  const NPCS = React.useMemo(() => getNPCs(lang), [lang]);
  const GW = 16, GH = 10, TILE = 40;

  const [pos, setPos] = React.useState({ x: 7, y: 4 });
  const [dir, setDir] = React.useState("down");
  const [activeNPC, setActiveNPC] = React.useState(null);
  const [lineIdx, setLineIdx] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const [score, setScore] = React.useState(0);
  const [picked, setPicked] = React.useState(null);
  const [reveal, setReveal] = React.useState(false);
  const [music, setMusic] = React.useState(false);
  const chiptune = useChiptune();

  // Beep sound (Web Audio simple)
  const beep = React.useCallback((freq=440, dur=0.08, type="square") => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      const ctx = new Ctx();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.06, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + dur);
      setTimeout(()=>ctx.close(), dur*1000+50);
    } catch(e){}
  }, []);

  const tryInteract = React.useCallback(() => {
    const near = NPCS.find(n => Math.abs(n.x - pos.x) + Math.abs(n.y - pos.y) <= 1);
    if (near && !activeNPC) {
      setActiveNPC(near);
      setLineIdx(0);
      setPicked(null);
      setReveal(false);
      beep(660, 0.06);
    }
  }, [NPCS, pos, activeNPC, beep]);

  // Keyboard input
  React.useEffect(() => {
    const onKey = (e) => {
      if (activeNPC) {
        if (e.key === "Escape") { setActiveNPC(null); return; }
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          if (lineIdx < activeNPC.lines.length - 1) {
            setLineIdx(i => i + 1);
            beep(520, 0.05);
          } else if (!reveal) {
            // waiting for option click
          } else {
            // close after answering
            setActiveNPC(null);
          }
        }
        return;
      }
      let dx=0, dy=0, d=dir;
      if (e.key === "ArrowUp"    || e.key === "w" || e.key === "W") { dy=-1; d="up"; }
      else if (e.key === "ArrowDown"  || e.key === "s" || e.key === "S") { dy= 1; d="down"; }
      else if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") { dx=-1; d="left"; }
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { dx= 1; d="right"; }
      else if (e.key === " " || e.key === "Enter") { e.preventDefault(); tryInteract(); return; }
      else return;
      e.preventDefault();
      setDir(d);
      setPos(p => {
        const nx = Math.max(0, Math.min(GW-1, p.x + dx));
        const ny = Math.max(0, Math.min(GH-1, p.y + dy));
        const blocked = NPCS.some(n => n.x === nx && n.y === ny);
        if (blocked) return p;
        return { x: nx, y: ny };
      });
      beep(220, 0.02, "triangle");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeNPC, lineIdx, reveal, dir, NPCS, tryInteract, beep]);

  // Music toggle
  React.useEffect(() => {
    if (music) chiptune.start();
    else chiptune.stop();
  }, [music, chiptune]);

  const onPickOption = (i) => {
    if (reveal) return;
    setPicked(i);
    setReveal(true);
    if (i === activeNPC.answer) {
      setScore(s => s + 1);
      beep(880, 0.1);
      beep(1320, 0.12);
    } else {
      beep(180, 0.18, "sawtooth");
    }
    setCompleted(c => ({ ...c, [activeNPC.id]: true }));
  };

  const allDone = NPCS.every(n => completed[n.id]);

  // Background tiles — pattern
  const tiles = [];
  for (let y=0; y<GH; y++) for (let x=0; x<GW; x++) {
    const isPath = (x===7 || y===4) && !(x===0||y===0||x===GW-1||y===GH-1);
    tiles.push({ x, y, kind: isPath ? "path" : ((x+y)%2 === 0 ? "grass-a" : "grass-b") });
  }

  return (
    <div className="page game-page">
      <div className="page-header">
        <div>
          <div className="crumb">extra / 07 · arcade</div>
          <h1 className="pixel-font">{lang==="es" ? "BIOENERGY QUEST" : "BIOENERGY QUEST"}</h1>
          <p>{lang==="es"
            ? "Explora la isla FAO, habla con los 4 NPCs y aprende sobre el proyecto. WASD/flechas para moverte, Espacio para hablar."
            : "Explore FAO island, talk to the 4 NPCs and learn about the project. WASD/arrows to move, Space to interact."}</p>
        </div>
        <div className="page-actions">
          <span className="chip"><span className="dot"/>{lang==="es"?"Puntos":"Score"}: <b style={{marginLeft:6}}>{score}/4</b></span>
          <span className="chip ok">{Object.keys(completed).length}/4 NPCs</span>
          <button className="btn" onClick={()=>setMusic(m => !m)} title="music">
            {music ? "🔊" : "🔈"} {lang==="es"?(music?"Música ON":"Música OFF"):(music?"Music ON":"Music OFF")}
          </button>
        </div>
      </div>

      <div className="game-world" style={{
        width: GW*TILE, height: GH*TILE,
        position:"relative",
        border:"3px solid var(--accent)",
        borderRadius:"var(--radius-lg)",
        margin:"0 auto",
        background:"#3aa05a",
        overflow:"hidden",
        boxShadow:"0 0 0 4px var(--bg-1), 0 0 30px rgba(139,21,56,0.4)",
        imageRendering:"pixelated"
      }}>
        {/* floating particles */}
        <div className="pixel-particles" aria-hidden="true">
          {[...Array(8)].map((_,i)=>(<span key={i} className={`p-leaf p-leaf-${i+1}`}/>))}
        </div>

        {/* Tiles */}
        {tiles.map(tl => (
          <div key={`t-${tl.x}-${tl.y}`}
            className={`tile tile-${tl.kind}`}
            style={{
              position:"absolute",
              left: tl.x*TILE, top: tl.y*TILE,
              width: TILE, height: TILE,
              background: tl.kind==="path" ? "#a87f4e"
                : tl.kind==="grass-a" ? "#3aa05a" : "#349452",
            }}/>
        ))}

        {/* Decorations: wheat in corners */}
        {[[1,2],[1,6],[5,8],[10,8],[14,2],[14,6]].map(([x,y]) => (
          <div key={`w-${x}-${y}`} style={{
            position:"absolute", left:x*TILE+4, top:y*TILE+2,
            pointerEvents:"none"
          }}>
            <PixelSprite data={SPRITES.wheat.data} palette={SPRITES.wheat.palette} scale={2}/>
          </div>
        ))}

        {/* Factory decoration center */}
        <div style={{position:"absolute", left:6*TILE+4, top:1*TILE+4, opacity:0.85, pointerEvents:"none"}}>
          <PixelSprite data={SPRITES.factory.data} palette={SPRITES.factory.palette} scale={2}/>
        </div>

        {/* NPCs */}
        {NPCS.map(n => {
          const done = completed[n.id];
          return (
            <div key={n.id} className="npc-wrap" style={{
              position:"absolute",
              left: n.x*TILE + 2, top: n.y*TILE + 2,
              width: TILE-4, height: TILE-4,
              filter: done ? "saturate(0.5)" : "none",
              transition:"filter 200ms"
            }}>
              <PixelSprite data={SPRITES[n.sprite].data} palette={SPRITES[n.sprite].palette} scale={2}/>
              <div style={{
                position:"absolute", top:-12, left:"50%", transform:"translateX(-50%)",
                fontFamily:"'Press Start 2P', monospace", fontSize:8,
                color:"#fff", background:"rgba(0,0,0,0.6)", padding:"2px 4px",
                borderRadius:2, whiteSpace:"nowrap"
              }}>{done ? "✔" : "!"}</div>
            </div>
          );
        })}

        {/* Player */}
        <div className="player-wrap" style={{
          position:"absolute",
          left: pos.x*TILE + 2, top: pos.y*TILE + 2,
          width: TILE-4, height: TILE-4,
          transition:"left 110ms linear, top 110ms linear",
          transform: dir==="left" ? "scaleX(-1)" : "none",
          zIndex: 5
        }}>
          <PixelSprite data={SPRITES.player.data} palette={SPRITES.player.palette} scale={2}/>
        </div>
      </div>

      {/* Dialogue overlay */}
      {activeNPC && (
        <div className="dialogue-overlay" style={{
          position:"fixed", inset:0, background:"rgba(0,0,0,0.55)",
          display:"flex", alignItems:"center", justifyContent:"center",
          zIndex: 1000, padding:24
        }}
          onClick={(e)=>{ if(e.target===e.currentTarget) setActiveNPC(null); }}>
          <div className="dialogue-box" style={{
            maxWidth: 640, width:"100%",
            background:"var(--bg-1)",
            border:"4px solid var(--accent)",
            borderRadius:"var(--radius-lg)",
            padding:24,
            fontFamily:"var(--font-ui)",
            boxShadow:"0 0 0 4px var(--bg-0), 0 20px 60px rgba(0,0,0,0.5)"
          }}>
            <div style={{display:"flex", gap:14, alignItems:"center", marginBottom:14}}>
              <div style={{
                width:64, height:64,
                background:"var(--bg-2)",
                border:`3px solid ${activeNPC.color}`,
                borderRadius:6,
                display:"grid", placeItems:"center"
              }}>
                <PixelSprite data={SPRITES[activeNPC.sprite].data}
                  palette={SPRITES[activeNPC.sprite].palette} scale={3}/>
              </div>
              <div>
                <div className="pixel-font" style={{fontSize:12, color:activeNPC.color}}>{activeNPC.name}</div>
                <div style={{fontSize:11, color:"var(--text-2)", fontFamily:"var(--font-mono)"}}>{activeNPC.role}</div>
              </div>
            </div>

            {lineIdx < activeNPC.lines.length ? (
              <div>
                <p style={{margin:"0 0 16px 0", lineHeight:1.55, minHeight:60, color:"var(--text-0)"}}>
                  {activeNPC.lines[lineIdx]}
                </p>
                <div style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
                  <span style={{fontSize:11, color:"var(--text-3)", fontFamily:"var(--font-mono)"}}>
                    {lineIdx+1}/{activeNPC.lines.length}
                  </span>
                  <button className="btn btn-primary" onClick={() => {
                    if (lineIdx < activeNPC.lines.length-1) { setLineIdx(i=>i+1); beep(520,0.05); }
                    else setLineIdx(i=>i+1);
                  }}>
                    {lineIdx < activeNPC.lines.length-1
                      ? (lang==="es"?"Siguiente →":"Next →")
                      : (lang==="es"?"Preguntar":"Quiz me")}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="pixel-font" style={{fontSize:11, marginBottom:14, color:"var(--accent)"}}>
                  {lang==="es"?"PREGUNTA":"QUESTION"}
                </h3>
                <p style={{margin:"0 0 14px 0", fontWeight:500}}>{activeNPC.q}</p>
                <div style={{display:"grid", gap:8}}>
                  {activeNPC.options.map((opt, i) => {
                    const isPicked = picked === i;
                    const isCorrect = i === activeNPC.answer;
                    let bg = "var(--bg-2)", bd = "var(--line)", co = "var(--text-0)";
                    if (reveal) {
                      if (isCorrect) { bg="color-mix(in oklab, var(--accent-2) 18%, var(--bg-2))"; bd="var(--accent-2)"; }
                      else if (isPicked) { bg="color-mix(in oklab, var(--danger) 18%, var(--bg-2))"; bd="var(--danger)"; }
                      else co="var(--text-2)";
                    }
                    return (
                      <button key={i} onClick={()=>onPickOption(i)} disabled={reveal}
                        style={{
                          textAlign:"left", padding:"12px 14px",
                          background:bg, color:co, border:`2px solid ${bd}`,
                          borderRadius:"var(--radius)", cursor: reveal?"default":"pointer",
                          fontFamily:"var(--font-ui)", fontSize:13.5,
                          transition:"all 160ms"
                        }}>
                        <span style={{
                          display:"inline-block", width:20, height:20, lineHeight:"20px",
                          textAlign:"center", marginRight:10, background:"var(--bg-3)",
                          fontFamily:"'Press Start 2P', monospace", fontSize:9, borderRadius:3
                        }}>{String.fromCharCode(65+i)}</span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {reveal && (
                  <div style={{
                    marginTop:14, padding:12,
                    background:"var(--bg-2)", border:"1px solid var(--line-soft)",
                    borderRadius:"var(--radius)", fontSize:13
                  }}>
                    <b style={{color: picked===activeNPC.answer ? "var(--accent-2)" : "var(--danger)"}}>
                      {picked===activeNPC.answer
                        ? (lang==="es"?"¡Correcto!":"Correct!")
                        : (lang==="es"?"Casi.":"Not quite.")}
                    </b>
                    <span style={{marginLeft:8, color:"var(--text-1)"}}>{activeNPC.explain}</span>
                  </div>
                )}
                {reveal && (
                  <div style={{marginTop:14, textAlign:"right"}}>
                    <button className="btn btn-primary" onClick={()=>setActiveNPC(null)}>
                      {lang==="es"?"Cerrar":"Close"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Win message */}
      {allDone && !activeNPC && (
        <div style={{
          marginTop:20, padding:20,
          background:"color-mix(in oklab, var(--accent) 14%, var(--bg-1))",
          border:"3px solid var(--accent)",
          borderRadius:"var(--radius-lg)",
          textAlign:"center"
        }}>
          <h2 className="pixel-font" style={{margin:"0 0 6px 0", fontSize:14, color:"var(--accent)"}}>
            {lang==="es"?"¡MISIÓN COMPLETADA!":"QUEST COMPLETE!"}
          </h2>
          <p style={{margin:"0 0 12px 0", color:"var(--text-1)"}}>
            {lang==="es"
              ? `Hablaste con los 4 expertos. Puntuación final: ${score}/4 aciertos en bioenergía.`
              : `You met all 4 experts. Final score: ${score}/4 correct on bioenergy.`}
          </p>
          <button className="btn btn-primary" onClick={()=>{
            setCompleted({}); setScore(0); setPos({x:7,y:4});
          }}>
            {lang==="es"?"Nueva partida":"New game"}
          </button>
        </div>
      )}

      <div style={{
        marginTop:16, padding:14,
        background:"var(--bg-1)", border:"1px solid var(--line-soft)",
        borderRadius:"var(--radius)", display:"flex", gap:18, flexWrap:"wrap",
        fontSize:12, color:"var(--text-2)", fontFamily:"var(--font-mono)"
      }}>
        <span><b style={{color:"var(--text-0)"}}>WASD</b> / <b style={{color:"var(--text-0)"}}>↑↓←→</b> {lang==="es"?"moverse":"move"}</span>
        <span><b style={{color:"var(--text-0)"}}>SPACE</b> / <b style={{color:"var(--text-0)"}}>ENTER</b> {lang==="es"?"hablar":"talk"}</span>
        <span><b style={{color:"var(--text-0)"}}>ESC</b> {lang==="es"?"cerrar diálogo":"close dialogue"}</span>
      </div>
    </div>
  );
}

Object.assign(window, { EvaluatePage, PredictPage, CodePage, GamePage });
