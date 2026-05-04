# Carpeta de datos

Los archivos de datos grandes no se suben a GitHub para mantener el repositorio liviano.

Para regenerarlos:

```bash
python src/run_pipeline.py
```

El pipeline descarga los ZIP oficiales de FAOSTAT, crea `data/processed/modeling_dataset.csv` y guarda la base SQLite en `data/database/faostat_project.db`.

