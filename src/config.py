from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
RAW_DIR = PROJECT_ROOT / "data" / "raw"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
DB_DIR = PROJECT_ROOT / "data" / "database"
MODEL_DIR = PROJECT_ROOT / "models"
FIGURES_DIR = PROJECT_ROOT / "reports" / "figures"

DATASETS = {
    "AF": {
        "name": "ASTI - Researchers",
        "url": "https://bulks-faostat.fao.org/production/ASTI_Researchers_E_All_Data_(Normalized).zip",
        "role": "requested_source",
    },
    "AE": {
        "name": "ASTI - Expenditures",
        "url": "https://bulks-faostat.fao.org/production/ASTI_Expenditures_E_All_Data_(Normalized).zip",
        "role": "context",
    },
    "BE": {
        "name": "Bioenergy",
        "url": "https://bulks-faostat.fao.org/production/Environment_Bioenergy_E_All_Data_(Normalized).zip",
        "role": "model_base",
    },
    "CISP": {
        "name": "Country Investment Statistics Profile",
        "url": "https://bulks-faostat.fao.org/production/Investment_CountryInvestmentStatisticsProfile_E_All_Data_(Normalized).zip",
        "role": "context",
    },
}

DATABASE_PATH = DB_DIR / "faostat_project.db"
MODELING_DATA_PATH = PROCESSED_DIR / "modeling_dataset.csv"
MODEL_PATH = MODEL_DIR / "bioenergy_model.joblib"
METADATA_PATH = MODEL_DIR / "model_metadata.json"

