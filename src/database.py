from __future__ import annotations

import sqlite3
from pathlib import Path

import pandas as pd

from config import DATABASE_PATH, DB_DIR, MODELING_DATA_PATH
from data_download import load_raw_frames
from features import build_modeling_dataset


def store_database(frames: dict[str, pd.DataFrame] | None = None, modeling_data: pd.DataFrame | None = None) -> Path:
    DB_DIR.mkdir(parents=True, exist_ok=True)
    if frames is None:
        frames = load_raw_frames()
    if modeling_data is None:
        modeling_data = build_modeling_dataset(frames)

    with sqlite3.connect(DATABASE_PATH) as conn:
        for code, frame in frames.items():
            frame.to_sql(f"raw_{code.lower()}", conn, if_exists="replace", index=False)
        modeling_data.to_sql("modeling_bioenergy", conn, if_exists="replace", index=False)
        conn.execute(
            "CREATE TABLE IF NOT EXISTS project_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT, created_at TEXT)"
        )
        conn.execute(
            "INSERT INTO project_notes (note, created_at) VALUES (?, datetime('now'))",
            ("Pipeline inicial creado para el proyecto final 4Geeks con FAOSTAT.",),
        )
    return DATABASE_PATH


def run_example_queries() -> dict[str, pd.DataFrame]:
    queries = {
        "select_top_bioenergy": """
            SELECT area, item, element, year, unit, target_value
            FROM modeling_bioenergy
            WHERE target_value IS NOT NULL
            ORDER BY target_value DESC
            LIMIT 10
        """,
        "join_be_af": """
            SELECT b.area, b.year, b.item, b.element, b.target_value,
                   AVG(a.value) AS asti_research_context
            FROM modeling_bioenergy b
            LEFT JOIN raw_af a
              ON CAST(b.area_key AS TEXT) = CAST(COALESCE(a.area_code_m49, a.area_code) AS TEXT)
             AND CAST(b.year AS INTEGER) = CAST(a.year AS INTEGER)
            GROUP BY b.area, b.year, b.item, b.element, b.target_value
            LIMIT 20
        """,
        "aggregate_by_year": """
            SELECT year, COUNT(*) AS rows, AVG(target_value) AS avg_value
            FROM modeling_bioenergy
            GROUP BY year
            ORDER BY year
        """,
    }
    with sqlite3.connect(DATABASE_PATH) as conn:
        return {name: pd.read_sql_query(query, conn) for name, query in queries.items()}


if __name__ == "__main__":
    store_database()
    for name, result in run_example_queries().items():
        print(f"\n--- {name} ---")
        print(result.head())
