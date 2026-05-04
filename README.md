# Proyecto Final 4Geeks - FAOSTAT

## Problema de negocio

El proyecto transforma datos publicos de FAOSTAT en una solucion de Machine Learning para estimar el valor esperado de bioenergia por pais, ano, item y tipo de medicion. La pregunta de negocio es:

> Que paises, productos y condiciones historicas muestran mayor potencial de produccion o uso de bioenergia dentro del sistema agroalimentario?

La fuente solicitada fue `https://www.fao.org/faostat/en/#data/AF`. En el catalogo oficial de FAOSTAT, `AF` corresponde a **Agricultural Science and Technology: ASTI - Researchers**. Como ese dominio tiene solo 3.800 filas, se usa como fuente obligatoria/contextual y se enriquece el modelo con dominios FAOSTAT relacionados para cumplir mejor los requisitos de volumen y variables:

- `AF`: ASTI - Researchers, fuente pedida.
- `AE`: ASTI - Expenditures, gasto en investigacion agricola.
- `CISP`: Country Investment Statistics Profile, contexto macro e inversion.
- `BE`: Bioenergy, tabla principal de modelado con mas de 120.000 filas.

## Estructura

- `src/data_download.py`: descarga reproducible desde URLs bulk oficiales de FAOSTAT.
- `src/database.py`: almacena tablas en SQLite y ejecuta consultas `SELECT`, `JOIN` e `INSERT`.
- `src/features.py`: construye el dataset final, lags temporales y variables predictoras.
- `src/eda.py`: analisis descriptivo y graficos.
- `src/train_model.py`: entrenamiento, validacion temporal y optimizacion de hiperparametros.
- `src/app.py`: aplicacion web Streamlit para usar el modelo.
- `notebooks/explore.ipynb`: notebook de entrega con el flujo explicado.
- `presentation/pitch_5_minutos.md`: guion de presentacion.

## Como ejecutarlo

```bash
cd "Proyecto Final 4geeks"
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/run_pipeline.py
streamlit run src/app.py
```

## Entrega por fases

1. Definicion del problema: prediccion de valor de bioenergia con contexto de investigacion e inversion agricola.
2. Obtencion de datos: descarga automatica desde FAOSTAT bulk downloads.
3. Almacenamiento: SQLite en `data/database/faostat_project.db`.
4. Analisis descriptivo: estadisticas en `data/processed/descriptive_statistics.csv` y resumen en `eda_summary.json`.
5. EDA: graficos en `reports/figures/` y particion temporal train/test.
6. Modelo: `HistGradientBoostingRegressor` con busqueda de hiperparametros y metricas guardadas.
7. Despliegue: app Streamlit lista para Render con `render.yaml`.

## Resultado del pipeline ejecutado

- Dataset final: 101.995 filas x 29 columnas.
- Predictores usados por el modelo: 26.
- Particion: 84.749 filas train y 17.246 filas test.
- Modelo final: `HistGradientBoostingRegressor`.
- Mejores hiperparametros: `learning_rate=0.08`, `max_iter=140`, `max_leaf_nodes=31`.
- Metricas: MAE `60.528`, RMSE `641.472`, R2 sobre objetivo logaritmico `0.990`.

## Fuentes

- FAOSTAT: https://www.fao.org/faostat/en/#data
- Catalogo bulk FAOSTAT: https://bulks-faostat.fao.org/production/datasets_E.json
- Dataset AF: https://bulks-faostat.fao.org/production/ASTI_Researchers_E_All_Data_(Normalized).zip
