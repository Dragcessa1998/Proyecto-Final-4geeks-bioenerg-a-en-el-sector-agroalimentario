# Trabajo colaborativo en GitHub

## Flujo recomendado

1. Cada integrante clona el repositorio.
2. Cada cambio se trabaja en una rama propia.
3. Se sube la rama a GitHub.
4. Se abre un Pull Request.
5. Otro integrante revisa y aprueba antes de unir a `main`.

## Comandos basicos

```bash
git clone URL_DEL_REPOSITORIO
cd Proyecto-Final-4geeks
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python src/run_pipeline.py
streamlit run src/app.py
```

## Crear una rama para cambios

```bash
git checkout -b nombre-de-la-rama
git add .
git commit -m "Descripcion del cambio"
git push -u origin nombre-de-la-rama
```

## Anadir companeros

En GitHub:

1. Abrir el repositorio.
2. Ir a `Settings`.
3. Entrar en `Collaborators and teams`.
4. Seleccionar `Add people`.
5. Escribir el usuario de GitHub del companero.
6. Dar permiso `Write` para que pueda modificar el proyecto.

