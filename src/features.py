from __future__ import annotations

import re
from functools import reduce

import numpy as np
import pandas as pd

from config import DATASETS, MODELING_DATA_PATH, PROCESSED_DIR
from data_download import load_raw_frames, snake_case


AREA_COLS = ["area_code_m49", "area_code", "recipient_country_code"]
YEAR_COLS = ["year", "year_code"]


def pick_column(frame: pd.DataFrame, candidates: list[str]) -> str:
    for candidate in candidates:
        if candidate in frame.columns:
            return candidate
    raise KeyError(f"No column found among: {candidates}")


def numeric_series(series: pd.Series) -> pd.Series:
    return pd.to_numeric(series, errors="coerce")


def standardize_core_columns(frame: pd.DataFrame) -> pd.DataFrame:
    frame = frame.copy()
    area_col = pick_column(frame, AREA_COLS)
    year_col = pick_column(frame, YEAR_COLS)
    frame["area_key"] = frame[area_col].astype(str).str.replace(r"\.0$", "", regex=True)
    frame["year"] = numeric_series(frame[year_col]).astype("Int64")
    frame["value"] = numeric_series(frame["value"])
    for col in ["item_code", "element_code"]:
        if col in frame.columns:
            frame[col] = frame[col].astype(str)
    return frame


def safe_feature_name(*parts: object) -> str:
    joined = "_".join(str(part) for part in parts if pd.notna(part))
    return snake_case(joined)[:90]


def context_features(frame: pd.DataFrame, code: str, max_features: int = 12) -> pd.DataFrame:
    frame = standardize_core_columns(frame)
    available = frame.dropna(subset=["area_key", "year", "value"]).copy()
    if available.empty:
        return pd.DataFrame(columns=["area_key", "year"])

    if "element" in available.columns and "item" in available.columns:
        available["feature"] = available.apply(
            lambda row: safe_feature_name(code, row.get("item"), row.get("element")), axis=1
        )
    elif "element" in available.columns:
        available["feature"] = available["element"].map(lambda x: safe_feature_name(code, x))
    else:
        available["feature"] = code.lower() + "_value"

    coverage = available.groupby("feature")["value"].size().sort_values(ascending=False)
    selected = coverage.head(max_features).index.tolist()
    available = available[available["feature"].isin(selected)]

    pivot = available.pivot_table(
        index=["area_key", "year"], columns="feature", values="value", aggfunc="mean"
    ).reset_index()
    pivot.columns.name = None
    return pivot


def build_modeling_dataset(frames: dict[str, pd.DataFrame] | None = None) -> pd.DataFrame:
    if frames is None:
        frames = load_raw_frames()

    base = standardize_core_columns(frames["BE"])
    required = ["area_key", "area", "item", "element", "unit", "year", "value"]
    optional = [col for col in ["item_code", "element_code", "flag", "flag_description"] if col in base.columns]
    base = base[required + optional].dropna(subset=["year", "value"]).copy()
    base = base[base["value"] >= 0].copy()
    base = base.rename(columns={"value": "target_value"})

    context_tables = [
        context_features(frames[code], code, max_features=10)
        for code in ["AF", "AE", "CISP"]
        if code in frames
    ]
    context = reduce(
        lambda left, right: pd.merge(left, right, on=["area_key", "year"], how="outer"),
        context_tables,
    )

    data = pd.merge(base, context, on=["area_key", "year"], how="left")
    data = data.sort_values(["area_key", "item", "element", "year"]).reset_index(drop=True)

    group_cols = ["area_key", "item", "element", "unit"]
    for lag in [1, 2, 3]:
        data[f"target_lag_{lag}"] = data.groupby(group_cols)["target_value"].shift(lag)
    data["target_roll_mean_3"] = data.groupby(group_cols)["target_value"].transform(
        lambda values: values.shift(1).rolling(3, min_periods=1).mean()
    )
    data["year_since_1990"] = data["year"] - 1990
    data["log_target_value"] = np.log1p(data["target_value"])
    data["has_asti_context"] = data.filter(regex=r"^(af|ae)_").notna().any(axis=1).astype(int)

    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    data.to_csv(MODELING_DATA_PATH, index=False)
    return data


def feature_columns(data: pd.DataFrame) -> tuple[list[str], list[str], list[str]]:
    excluded = {
        "target_value",
        "log_target_value",
        "flag",
        "flag_description",
    }
    features = [col for col in data.columns if col not in excluded]
    categorical = [col for col in ["area_key", "area", "item", "element", "unit", "item_code", "element_code"] if col in features]
    numeric = [col for col in features if col not in categorical]
    return features, categorical, numeric


if __name__ == "__main__":
    dataset = build_modeling_dataset()
    print(dataset.shape)
    print(dataset.head())
