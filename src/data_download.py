import re
import zipfile
from pathlib import Path

import pandas as pd
import requests

from config import DATASETS, RAW_DIR


def ensure_dirs() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)


def snake_case(value: str) -> str:
    value = re.sub(r"[^0-9a-zA-Z]+", "_", value.strip().lower())
    return re.sub(r"_+", "_", value).strip("_")


def dataset_zip_path(code: str) -> Path:
    return RAW_DIR / Path(DATASETS[code]["url"]).name


def download_dataset(code: str, skip_if_present: bool = True) -> Path:
    ensure_dirs()
    url = DATASETS[code]["url"]
    path = dataset_zip_path(code)
    if skip_if_present and path.exists() and path.stat().st_size > 0:
        return path

    with requests.get(url, stream=True, timeout=120) as response:
        response.raise_for_status()
        with path.open("wb") as file:
            for chunk in response.iter_content(chunk_size=1024 * 1024):
                if chunk:
                    file.write(chunk)
    return path


def download_all(skip_if_present: bool = True) -> dict[str, Path]:
    return {code: download_dataset(code, skip_if_present) for code in DATASETS}


def read_faostat_zip(code: str) -> pd.DataFrame:
    path = dataset_zip_path(code)
    if not path.exists():
        download_dataset(code)

    with zipfile.ZipFile(path) as archive:
        csv_names = [name for name in archive.namelist() if name.lower().endswith(".csv")]
        main_csv = max(csv_names, key=lambda name: archive.getinfo(name).file_size)
        with archive.open(main_csv) as file:
            frame = pd.read_csv(file, encoding="latin1", low_memory=False)

    frame.columns = [snake_case(col) for col in frame.columns]
    frame["source_dataset_code"] = code
    frame["source_dataset_name"] = DATASETS[code]["name"]
    return frame


def load_raw_frames() -> dict[str, pd.DataFrame]:
    return {code: read_faostat_zip(code) for code in DATASETS}


if __name__ == "__main__":
    paths = download_all()
    for code, path in paths.items():
        print(f"{code}: {path}")

