import argparse
import json

from data_download import download_all, load_raw_frames
from database import store_database
from eda import run_eda
from features import build_modeling_dataset
from train_model import train


def main() -> None:
    parser = argparse.ArgumentParser(description="Pipeline FAOSTAT para el proyecto final 4Geeks.")
    parser.add_argument("--skip-download-if-present", action="store_true")
    parser.add_argument("--no-train", action="store_true")
    args = parser.parse_args()

    print("1/5 Descargando fuentes FAOSTAT...")
    download_all(skip_if_present=args.skip_download_if_present)
    frames = load_raw_frames()

    print("2/5 Construyendo dataset de modelado...")
    modeling = build_modeling_dataset(frames)
    print(f"Dataset: {modeling.shape[0]:,} filas x {modeling.shape[1]:,} columnas")

    print("3/5 Guardando SQLite y consultas SQL...")
    db_path = store_database(frames, modeling)
    print(f"Base de datos: {db_path}")

    print("4/5 Ejecutando EDA...")
    summary = run_eda(modeling)
    print(json.dumps(summary, indent=2))

    if not args.no_train:
        print("5/5 Entrenando y optimizando modelo...")
        metrics = train(modeling)
        print(json.dumps(metrics, indent=2))
    else:
        print("5/5 Entrenamiento omitido por --no-train")


if __name__ == "__main__":
    main()

