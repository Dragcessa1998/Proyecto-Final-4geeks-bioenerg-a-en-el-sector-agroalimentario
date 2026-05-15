window.I18N = {
  en: {
    appName: "faolab",
    appTagline: "FAOSTAT Bioenergy Predictor",
    nav: { data:"Data", eda:"EDA", train:"Train", evaluate:"Evaluate", predict:"Predict", code:"Code", game:"Arcade" },
    run: "Run",
    running: "Running…",
    runPipeline: "Run pipeline",
    refit: "Re-fit model",
    refitting: "Re-fitting…",
    pages: {
      data: {
        title: "Data sources",
        sub: "FAOSTAT bulk downloads combined into a single modeling dataset. The required source is the AF domain (ASTI · Researchers); other domains add R&D, investment, and the bioenergy target.",
      },
      eda: {
        title: "Exploratory data analysis",
        sub: "Long-tail bioenergy values, strong temporal autocorrelation per (country, item) and macro-economic context features."
      },
      train: {
        title: "Train model",
        modelName: "HistGradientBoostingRegressor",
        modelShort: "HGBR",
        sub: "Time-aware split (≤ 80th percentile year for training), categorical ordinal encoding, GridSearchCV with 3-fold neg-RMSE."
      },
      evaluate: {
        title: "Evaluate",
        sub: "Metrics on the held-out test split (1.7M values total; 17,246 rows). The model targets log1p(bioenergy) and we invert with expm1."
      },
      predict: {
        title: "Live prediction",
        sub: "Pick country, item, element and year. Adjust ASTI/CISP context. The model returns the expected bioenergy value in TJ."
      },
      code: {
        title: "Source code",
        sub: "Excerpts from this project's src/. Click any block to copy."
      },
    },
    fields: {
      area:"Country / region", year:"Year", item:"Item", element:"Element", unit:"Unit",
      af_value:"AF · researchers", ae_value:"AE · R&D spend",
      cisp_value:"CISP · value added (2015 US$)",
      cisp_gfcf: "CISP · gross fixed capital formation",
      lag1:"target_lag_1", lag2:"target_lag_2", lag3:"target_lag_3",
      rollmean:"target_roll_mean_3", asti:"has_asti_context",
    },
    metrics: {
      rows:"rows", cols:"cols", train:"train rows", test:"test rows",
      predictors:"predictors", rmse:"RMSE", mae:"MAE", r2:"R² (log target)",
      missing:"missing rate", target_mean:"target mean", target_median:"median",
      cv:"5-fold CV", best:"best params",
    },
    common: {
      schema:"Schema", preview:"Preview", source:"source", domain:"domain",
      role:"role", target:"target", training_log:"Training log",
      result:"Predicted bioenergy value",
      copied:"copied", copy:"copy",
    }
  },
  es: {
    appName: "faolab",
    appTagline: "Predictor de Bioenergía FAOSTAT",
    nav: { data:"Datos", eda:"EDA", train:"Entrenar", evaluate:"Evaluar", predict:"Predecir", code:"Código", game:"Arcade" },
    run: "Ejecutar",
    running: "Ejecutando…",
    runPipeline: "Ejecutar pipeline",
    refit: "Reentrenar modelo",
    refitting: "Reentrenando…",
    pages: {
      data: {
        title: "Fuentes de datos",
        sub: "Descargas bulk de FAOSTAT combinadas en un único dataset de modelado. La fuente solicitada es el dominio AF (ASTI · Researchers); los demás dominios aportan I+D, inversión y el objetivo de bioenergía."
      },
      eda: {
        title: "Análisis exploratorio",
        sub: "Valores de bioenergía de cola larga, alta autocorrelación temporal por (país, item) y variables de contexto macroeconómico."
      },
      train: {
        title: "Entrenamiento",
        modelName: "HistGradientBoostingRegressor",
        modelShort: "HGBR",
        sub: "Partición temporal (año ≤ percentil 80 para train), codificación ordinal de categóricas, GridSearchCV con 3-fold neg-RMSE."
      },
      evaluate: {
        title: "Evaluación",
        sub: "Métricas sobre el conjunto de test retenido (17.246 filas). El modelo predice log1p(bioenergía) y se invierte con expm1."
      },
      predict: {
        title: "Predicción en vivo",
        sub: "Selecciona país, item, elemento y año. Ajusta contexto ASTI/CISP. El modelo devuelve el valor esperado de bioenergía en TJ."
      },
      code: {
        title: "Código fuente",
        sub: "Extractos del src/ de este proyecto. Haz clic en cualquier bloque para copiar."
      },
    },
    fields: {
      area:"País / región", year:"Año", item:"Item", element:"Elemento", unit:"Unidad",
      af_value:"AF · investigadores", ae_value:"AE · gasto I+D",
      cisp_value:"CISP · valor añadido (US$ 2015)",
      cisp_gfcf:"CISP · formación bruta de capital",
      lag1:"target_lag_1", lag2:"target_lag_2", lag3:"target_lag_3",
      rollmean:"target_roll_mean_3", asti:"has_asti_context",
    },
    metrics: {
      rows:"filas", cols:"cols", train:"filas train", test:"filas test",
      predictors:"predictores", rmse:"RMSE", mae:"MAE", r2:"R² (objetivo log)",
      missing:"tasa de nulos", target_mean:"media objetivo", target_median:"mediana",
      cv:"CV 5-fold", best:"mejores hiperparams",
    },
    common: {
      schema:"Esquema", preview:"Vista previa", source:"fuente", domain:"dominio",
      role:"rol", target:"objetivo", training_log:"Registro de entrenamiento",
      result:"Bioenergía estimada",
      copied:"copiado", copy:"copiar",
    }
  },
};
