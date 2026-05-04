from __future__ import annotations

import json

import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns

from config import FIGURES_DIR, MODELING_DATA_PATH, PROCESSED_DIR
from features import build_modeling_dataset


def run_eda(data: pd.DataFrame | None = None) -> dict:
    if data is None:
        data = pd.read_csv(MODELING_DATA_PATH) if MODELING_DATA_PATH.exists() else build_modeling_dataset()

    FIGURES_DIR.mkdir(parents=True, exist_ok=True)
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)

    summary = {
        "rows": int(data.shape[0]),
        "columns": int(data.shape[1]),
        "numeric_predictors": int(data.drop(columns=["target_value", "log_target_value"], errors="ignore").select_dtypes("number").shape[1]),
        "categorical_predictors": int(data.select_dtypes(include=["object"]).shape[1]),
        "target_mean": float(data["target_value"].mean()),
        "target_median": float(data["target_value"].median()),
        "target_std": float(data["target_value"].std()),
        "missing_rate": float(data.isna().mean().mean()),
    }

    data.describe(include="all").transpose().to_csv(PROCESSED_DIR / "descriptive_statistics.csv")
    with (PROCESSED_DIR / "eda_summary.json").open("w") as file:
        json.dump(summary, file, indent=2)

    yearly = data.groupby("year", as_index=False)["target_value"].mean()
    plt.figure(figsize=(10, 5))
    sns.lineplot(data=yearly, x="year", y="target_value")
    plt.title("Valor promedio de bioenergia por ano")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "bioenergy_trend.png", dpi=150)
    plt.close()

    top_items = data.groupby("item")["target_value"].sum().sort_values(ascending=False).head(10)
    plt.figure(figsize=(10, 6))
    sns.barplot(x=top_items.values, y=top_items.index)
    plt.title("Principales items por valor total")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "top_items.png", dpi=150)
    plt.close()

    missing = data.isna().mean().sort_values(ascending=False).head(20)
    plt.figure(figsize=(10, 6))
    sns.barplot(x=missing.values, y=missing.index)
    plt.title("Variables con mayor proporcion de nulos")
    plt.tight_layout()
    plt.savefig(FIGURES_DIR / "missing_values.png", dpi=150)
    plt.close()

    return summary


if __name__ == "__main__":
    print(json.dumps(run_eda(), indent=2))
