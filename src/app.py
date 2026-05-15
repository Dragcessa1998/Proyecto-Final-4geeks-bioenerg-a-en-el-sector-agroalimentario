import json
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
import streamlit as st

from config import METADATA_PATH, MODEL_PATH


st.set_page_config(page_title="FAOSTAT Bioenergy Predictor", layout="wide")
st.title("FAOSTAT Bioenergy Predictor")
st.caption("Predicción del valor de bioenergía usando FAOSTAT y contexto ASTI/inversión agrícola.")


@st.cache_resource
def load_model():
    if not MODEL_PATH.exists() or not METADATA_PATH.exists():
        return None, None
    return joblib.load(MODEL_PATH), json.loads(METADATA_PATH.read_text())


model, metadata = load_model()

if model is None:
    st.warning("Aún no existe un modelo entrenado. Ejecuta: python src/run_pipeline.py")
    st.stop()

metrics = metadata["metrics"]
left, right = st.columns([2, 1])

with right:
    st.metric("Filas de entrenamiento", f"{metrics['rows_total']:,}")
    st.metric("Predictores", metrics["predictor_count"])
    st.metric("R² log-target", f"{metrics['r2_log_target']:.3f}")
    st.metric("MAE", f"{metrics['mae']:,.2f}")

with left:
    st.subheader("Escenario")
    c1, c2 = st.columns(2)
    area = c1.selectbox("País o región", metadata["areas"], index=0)
    year = c2.number_input("Año", min_value=1961, max_value=2035, value=2025, step=1)
    item = c1.selectbox("Ítem", metadata["items"], index=0)
    element = c2.selectbox("Elemento", metadata["elements"], index=0)
    unit = c1.selectbox("Unidad", metadata["units"], index=0)

    row = {feature: metadata["defaults"].get(feature, 0) for feature in metadata["features"]}
    row.update(
        {
            "area": area,
            "area_key": "0",
            "item": item,
            "element": element,
            "unit": unit,
            "year": year,
            "year_since_1990": year - 1990,
        }
    )
    for feature in ["item_code", "element_code"]:
        if feature in row:
            row[feature] = "unknown"

    context_features = [f for f in metadata["features"] if f.startswith(("af_", "ae_", "cisp_"))]
    with st.expander("Ajustar variables de contexto"):
        for feature in context_features[:12]:
            row[feature] = st.number_input(feature, value=float(row.get(feature, 0) or 0), step=1.0)

    if st.button("Predecir", type="primary"):
        X = pd.DataFrame([row])[metadata["features"]]
        prediction = float(np.expm1(model.predict(X)[0]))
        st.success(f"Valor estimado: {prediction:,.2f} {unit}")

st.divider()
st.subheader("Lectura de negocio")
st.write(
    "El modelo estima el valor esperado de producción o uso de bioenergía por país, año, ítem y tipo de medición. "
    "La app sirve para comparar escenarios y priorizar países o cadenas con mayor potencial energético dentro del sistema agroalimentario."
)
