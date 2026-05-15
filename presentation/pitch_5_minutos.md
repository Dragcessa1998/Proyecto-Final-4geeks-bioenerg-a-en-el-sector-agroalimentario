# Pitch de 5 minutos

## 1. Problema de negocio

Queremos ayudar a priorizar países y cadenas agroalimentarias con mayor potencial de bioenergía. Esto puede apoyar decisiones de inversión, investigación agrícola y políticas de transición energética.

## 2. Cómo recopilamos los datos

Usamos FAOSTAT, una base pública de FAO. El dominio pedido fue `AF` (ASTI Researchers), y lo combinamos con gasto en investigación, inversión agrícola y bioenergía mediante descargas bulk oficiales. El pipeline descarga, guarda CSV, crea SQLite y genera el dataset final.

## 3. Patrones importantes

- La bioenergía presenta alta variación por país, ítem y elemento medido.
- Las series temporales importan: los valores pasados son predictores fuertes.
- El contexto de investigación e inversión agrícola ayuda a interpretar diferencias entre países.

## 4. Modelo y métrica

Entrenamos un `HistGradientBoostingRegressor`, optimizado con `GridSearchCV`. Evaluamos con MAE, RMSE y R² sobre el logaritmo del objetivo para reducir el efecto de valores extremos.

## 5. Demo y mejoras

La app Streamlit permite seleccionar país, año, ítem y elemento para estimar el valor esperado de bioenergía. Como mejoras futuras: agregar datos climáticos, indicadores de precios energéticos y comparación geográfica en mapas.
