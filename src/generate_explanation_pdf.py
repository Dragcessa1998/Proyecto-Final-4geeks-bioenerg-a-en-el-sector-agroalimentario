from __future__ import annotations

import json
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "reports" / "Proyecto_Final_4Geeks_Explicacion.pdf"
METADATA_PATH = ROOT / "models" / "model_metadata.json"
EDA_SUMMARY_PATH = ROOT / "data" / "processed" / "eda_summary.json"


def load_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def build_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "Title",
            parent=base["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=28,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#1f3a36"),
            spaceAfter=16,
        ),
        "subtitle": ParagraphStyle(
            "Subtitle",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=16,
            alignment=TA_CENTER,
            textColor=colors.HexColor("#4b5563"),
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "Heading1",
            parent=base["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=15,
            leading=19,
            textColor=colors.HexColor("#1f3a36"),
            spaceBefore=10,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "Heading2",
            parent=base["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=12,
            leading=16,
            textColor=colors.HexColor("#334155"),
            spaceBefore=8,
            spaceAfter=5,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=9.6,
            leading=13,
            alignment=TA_LEFT,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=6,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8.4,
            leading=11,
            textColor=colors.HexColor("#475569"),
        ),
    }


def p(text: str, styles: dict[str, ParagraphStyle], style: str = "body") -> Paragraph:
    return Paragraph(text, styles[style])


def table(data: list[list[str]], widths: list[float] | None = None) -> Table:
    flowable = Table(data, colWidths=widths, repeatRows=1, hAlign="LEFT")
    flowable.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#dbeafe")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#0f172a")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.2),
                ("LEADING", (0, 0), (-1, -1), 10),
                ("GRID", (0, 0), (-1, -1), 0.25, colors.HexColor("#cbd5e1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, colors.HexColor("#f8fafc")]),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    return flowable


def footer(canvas, doc) -> None:
    canvas.saveState()
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748b"))
    canvas.drawString(1.6 * cm, 1.0 * cm, "Proyecto Final 4Geeks - FAOSTAT")
    canvas.drawRightString(19.4 * cm, 1.0 * cm, f"Página {doc.page}")
    canvas.restoreState()


def main() -> None:
    metadata = load_json(METADATA_PATH)
    eda = load_json(EDA_SUMMARY_PATH)
    metrics = metadata["metrics"]
    styles = build_styles()
    story = []

    story.append(p("Proyecto Final 4Geeks - FAOSTAT", styles, "title"))
    story.append(
        p(
            "Guía explicativa: que pide la entrega, cómo se realizó el proyecto y que debe presentarse.",
            styles,
            "subtitle",
        )
    )

    story.append(p("1. Qué debemos hacer", styles, "h1"))
    story.append(
        p(
            "La entrega pide construir un proyecto completo de Machine Learning: definir un problema de negocio, obtener datos desde una fuente real, almacenarlos en una base de datos, analizarlos, entrenar un modelo optimizado y desplegarlo en una aplicación web.",
            styles,
        )
    )
    story.append(
        table(
            [
                ["Fase", "Qué se debe entregar"],
                ["Paso 1", "Definir un problema real y convertirlo en un problema de Machine Learning."],
                ["Paso 2", "Obtener datos desde una API, portal, web scraping o base pública; guardarlos como CSV y cargarlos con Pandas."],
                ["Paso 3", "Guardar la información en una base de datos y realizar consultas SQL como SELECT, JOIN e INSERT."],
                ["Paso 4", "Realizar análisis descriptivo: medias, medianas, desviaciones, modas, nulos, distribuciones y, si aplica, hipótesis."],
                ["Paso 5", "Hacer un EDA completo, seleccionar variables útiles y dividir los datos en train y test."],
                ["Paso 6", "Entrenar, comparar u optimizar un modelo usando hiperparámetros y métricas de evaluacion."],
                ["Paso 7", "Crear una app web con el modelo guardado y dejarla lista para despliegue."],
            ],
            [2.2 * cm, 14.8 * cm],
        )
    )

    story.append(p("2. Problema elegido", styles, "h1"))
    story.append(
        p(
            "El problema elegido fue estimar el valor esperado de bioenergía por país, año, item y tipo de medicion. Esto sirve para apoyar decisiones sobre inversión, investigación y priorización de cadenas agroalimentarias con potencial energético.",
            styles,
        )
    )
    story.append(
        p(
            "El objetivo de Machine Learning es una regresión: predecir un valor numérico llamado target_value. Para mejorar el entrenamiento se usa también log_target_value, que reduce el efecto de valores extremos.",
            styles,
        )
    )

    story.append(p("3. Datos utilizados", styles, "h1"))
    story.append(
        p(
            "La fuente solicitada fue FAOSTAT, específicamente el dominio AF. Ese dominio corresponde a ASTI - Researchers. Como AF por sí solo no alcanza las 60.000 filas, se usó como fuente contextual y se combinó con otros dominios oficiales de FAOSTAT.",
            styles,
        )
    )
    story.append(
        table(
            [
                ["Código", "Nombre", "Uso en el proyecto"],
                ["AF", "ASTI - Researchers", "Fuente pedida y variable de contexto sobre investigadores agrícolas."],
                ["AE", "ASTI - Expenditures", "Contexto de gasto en investigación agrícola."],
                ["CISP", "Country Investment Statistics Profile", "Contexto de inversión y valor agregado agropecuario."],
                ["BE", "Bioenergy", "Tabla principal para construir el modelo predictivo."],
            ],
            [2.0 * cm, 5.0 * cm, 10.0 * cm],
        )
    )
    story.append(
        p(
            "Los datos se descargan desde el catalogo bulk oficial de FAOSTAT, se guardan en data/raw, se transforman con Pandas y se exporta el dataset final a data/processed/modeling_dataset.csv.",
            styles,
        )
    )

    story.append(PageBreak())
    story.append(p("4. Cumplimiento de requisitos mínimos", styles, "h1"))
    story.append(
        table(
            [
                ["Requisito", "Resultado del proyecto", "Estado"],
                ["Mínimo 60.000 filas", f"{metrics['rows_total']:,} filas", "Cumplido"],
                ["Mínimo 20 predictores", f"{metrics['predictor_count']} predictores", "Cumplido"],
                ["Al menos 1 categórica", f"{metrics['categorical_predictor_count']} categóricas", "Cumplido"],
                ["CSV final", "data/processed/modeling_dataset.csv", "Cumplido"],
                ["Base de datos", "data/database/faostat_project.db", "Cumplido"],
                ["Notebook ejecutado", "notebooks/explore.ipynb con salidas guardadas", "Cumplido"],
            ],
            [5.3 * cm, 7.8 * cm, 3.4 * cm],
        )
    )

    story.append(p("5. Cómo se realizó técnicamente", styles, "h1"))
    story.append(p("Obtención y carga", styles, "h2"))
    story.append(
        p(
            "El script src/data_download.py descarga los ZIP oficiales de FAOSTAT. Luego lee los CSV internos con Pandas, normaliza los nombres de columnas y conserva el código de fuente de cada tabla.",
            styles,
        )
    )
    story.append(p("Base de datos", styles, "h2"))
    story.append(
        p(
            "El script src/database.py crea una base SQLite. Guarda las tablas raw_af, raw_ae, raw_be, raw_cisp y modeling_bioenergy. En el notebook se muestran consultas SELECT, JOIN, agregaciones e INSERT.",
            styles,
        )
    )
    story.append(p("Feature engineering", styles, "h2"))
    story.append(
        p(
            "El script src/features.py combina los dominios por país y año, crea variables de contexto y genera variables temporales como target_lag_1, target_lag_2, target_lag_3 y target_roll_mean_3.",
            styles,
        )
    )
    story.append(p("EDA y análisis descriptivo", styles, "h2"))
    story.append(
        p(
            f"El EDA calcula estadísticas descriptivas, nulos y distribuciones. El dataset final tiene una media del objetivo de {eda['target_mean']:,.2f}, mediana de {eda['target_median']:,.2f} y una tasa promedio de nulos de {eda['missing_rate']:.2%}. También se agregó un contraste Kruskal-Wallis para revisar diferencias del objetivo por item.",
            styles,
        )
    )
    story.append(p("Modelo", styles, "h2"))
    story.append(
        p(
            "Se entreno un HistGradientBoostingRegressor porque puede capturar relaciones no lineales y funciona bien en datos tabulares. Se uso GridSearchCV para optimizar hiperparámetros y una division temporal train/test para respetar el orden cronológico.",
            styles,
        )
    )
    story.append(
        table(
            [
                ["Métrica", "Valor"],
                ["Filas train", f"{metrics['rows_train']:,}"],
                ["Filas test", f"{metrics['rows_test']:,}"],
                ["MAE", f"{metrics['mae']:,.2f}"],
                ["RMSE", f"{metrics['rmse']:,.2f}"],
                ["R2 sobre log-target", f"{metrics['r2_log_target']:.3f}"],
                ["Mejores parametros", str(metrics["best_params"])],
            ],
            [5.5 * cm, 11.0 * cm],
        )
    )

    story.append(p("6. Aplicación web y despliegue", styles, "h1"))
    story.append(
        p(
            "La app esta construida con Streamlit en src/app.py. Permite seleccionar país, año, item y tipo de medicion, y devuelve una predicción usando el modelo guardado en models/bioenergy_model.joblib.",
            styles,
        )
    )
    story.append(
        p(
            "Para despliegue se dejó render.yaml, que instala dependencias, prepara el pipeline y ejecuta Streamlit en Render. Localmente se puede abrir con: streamlit run src/app.py",
            styles,
        )
    )

    story.append(p("7. Qué decir en la presentación de 5 minutos", styles, "h1"))
    story.append(
        table(
            [
                ["Tiempo", "Mensaje recomendado"],
                ["0:00 - 0:45", "Problema: identificar potencial de bioenergía en sistemas agroalimentarios."],
                ["0:45 - 1:30", "Datos: FAOSTAT, dominio AF solicitado y enriquecimiento con BE, AE y CISP."],
                ["1:30 - 2:30", "Patrones: diferencias por país/item, importancia temporal y valores extremos."],
                ["2:30 - 3:45", "Modelo: regresión con HistGradientBoostingRegressor, GridSearchCV, MAE/RMSE/R2."],
                ["3:45 - 5:00", "Demo: app Streamlit, predicción de escenarios y mejoras futuras."],
            ],
            [3.0 * cm, 13.8 * cm],
        )
    )
    story.append(
        p(
            "Idea central para cerrar: el proyecto no solo descarga datos, sino que convierte información pública en una herramienta predictiva útil para tomar decisiones.",
            styles,
        )
    )

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(OUTPUT),
        pagesize=A4,
        rightMargin=1.6 * cm,
        leftMargin=1.6 * cm,
        topMargin=1.5 * cm,
        bottomMargin=1.6 * cm,
        title="Proyecto Final 4Geeks - Explicacion",
        author="4Geeks",
    )
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT)


if __name__ == "__main__":
    main()
