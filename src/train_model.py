from __future__ import annotations

import json

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import HistGradientBoostingRegressor
from sklearn.impute import SimpleImputer
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import GridSearchCV, train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OrdinalEncoder

from config import METADATA_PATH, MODELING_DATA_PATH, MODEL_DIR, MODEL_PATH
from features import build_modeling_dataset, feature_columns


def train(data: pd.DataFrame | None = None) -> dict:
    if data is None:
        data = pd.read_csv(MODELING_DATA_PATH) if MODELING_DATA_PATH.exists() else build_modeling_dataset()

    features, categorical, numeric = feature_columns(data)
    model_data = data.dropna(subset=["log_target_value"]).copy()
    X = model_data[features]
    y = model_data["log_target_value"]

    if model_data["year"].nunique() >= 8:
        cutoff = int(model_data["year"].quantile(0.80))
        train_mask = model_data["year"] <= cutoff
        X_train, X_test = X[train_mask], X[~train_mask]
        y_train, y_test = y[train_mask], y[~train_mask]
        if X_test.empty:
            X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)
    else:
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.20, random_state=42)

    numeric_pipeline = Pipeline([("imputer", SimpleImputer(strategy="median"))])
    categorical_pipeline = Pipeline(
        [
            ("imputer", SimpleImputer(strategy="most_frequent")),
            ("encoder", OrdinalEncoder(handle_unknown="use_encoded_value", unknown_value=-1)),
        ]
    )
    preprocessing = ColumnTransformer(
        transformers=[
            ("num", numeric_pipeline, numeric),
            ("cat", categorical_pipeline, categorical),
        ]
    )

    pipeline = Pipeline(
        [
            ("preprocess", preprocessing),
            ("model", HistGradientBoostingRegressor(random_state=42, l2_regularization=0.05)),
        ]
    )

    sample_limit = min(len(X_train), 80000)
    X_tune = X_train.sample(sample_limit, random_state=42) if len(X_train) > sample_limit else X_train
    y_tune = y_train.loc[X_tune.index]
    grid = GridSearchCV(
        pipeline,
        param_grid={
            "model__max_iter": [80, 140],
            "model__learning_rate": [0.05, 0.08],
            "model__max_leaf_nodes": [31],
        },
        cv=3,
        scoring="neg_root_mean_squared_error",
        n_jobs=-1,
    )
    grid.fit(X_tune, y_tune)
    best = grid.best_estimator_
    best.fit(X_train, y_train)

    predictions_log = best.predict(X_test)
    predictions = np.expm1(predictions_log)
    actual = np.expm1(y_test)
    metrics = {
        "rows_total": int(len(model_data)),
        "rows_train": int(len(X_train)),
        "rows_test": int(len(X_test)),
        "predictor_count": int(len(features)),
        "categorical_predictor_count": int(len(categorical)),
        "numeric_predictor_count": int(len(numeric)),
        "rmse": float(np.sqrt(mean_squared_error(actual, predictions))),
        "mae": float(mean_absolute_error(actual, predictions)),
        "r2_log_target": float(r2_score(y_test, predictions_log)),
        "best_params": grid.best_params_,
    }

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(best, MODEL_PATH)
    metadata = {
        "metrics": metrics,
        "features": features,
        "categorical_features": categorical,
        "numeric_features": numeric,
        "areas": sorted(model_data["area"].dropna().astype(str).unique())[:250],
        "items": sorted(model_data["item"].dropna().astype(str).unique()),
        "elements": sorted(model_data["element"].dropna().astype(str).unique()),
        "units": sorted(model_data["unit"].dropna().astype(str).unique()),
        "defaults": model_data[features].median(numeric_only=True).to_dict(),
    }
    with METADATA_PATH.open("w") as file:
        json.dump(metadata, file, indent=2)
    return metrics


if __name__ == "__main__":
    print(json.dumps(train(), indent=2))
