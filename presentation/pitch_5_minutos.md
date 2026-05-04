# Pitch de 5 minutos

## 1. Problema de negocio

Queremos ayudar a priorizar paises y cadenas agroalimentarias con mayor potencial de bioenergia. Esto puede apoyar decisiones de inversion, investigacion agricola y politicas de transicion energetica.

## 2. Como recopilamos los datos

Usamos FAOSTAT, una base publica de FAO. El dominio pedido fue `AF` (ASTI Researchers), y lo combinamos con gasto en investigacion, inversion agricola y bioenergia mediante descargas bulk oficiales. El pipeline descarga, guarda CSV, crea SQLite y genera el dataset final.

## 3. Patrones importantes

- La bioenergia presenta alta variacion por pais, item y elemento medido.
- Las series temporales importan: los valores pasados son predictores fuertes.
- El contexto de investigacion e inversion agricola ayuda a interpretar diferencias entre paises.

## 4. Modelo y metrica

Entrenamos un `HistGradientBoostingRegressor`, optimizado con `GridSearchCV`. Evaluamos con MAE, RMSE y R2 sobre el logaritmo del objetivo para reducir el efecto de valores extremos.

## 5. Demo y mejoras

La app Streamlit permite seleccionar pais, ano, item y elemento para estimar el valor esperado de bioenergia. Como mejoras futuras: agregar datos climaticos, indicadores de precios energeticos y comparacion geografica en mapas.

