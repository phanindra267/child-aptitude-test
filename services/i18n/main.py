"""
AptitudePro i18n management script.
Generates JSON translation bundles for the frontend.
"""
import json
import os
import argparse
from pathlib import Path

# Simple stub for babel extraction logic.
# In production, uses Babel to parse .po files and output JSON.

def compile_translations(po_dir: str, out_dir: str):
    print(f"Compiling translations from {po_dir} to {out_dir}")
    os.makedirs(out_dir, exist_ok=True)
    
    # Mock generation
    locales = ["en", "es", "fr"]
    for loc in locales:
        bundle = {
            "locale": loc,
            "messages": {
                "welcome": "Welcome" if loc == "en" else ("Bienvenido" if loc == "es" else "Bienvenue"),
                "start_test": "Start Test" if loc == "en" else ("Iniciar prueba" if loc == "es" else "Commencer le test")
            }
        }
        out_path = os.path.join(out_dir, f"{loc}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(bundle, f, ensure_ascii=False, indent=2)
        print(f"Generated {out_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Compile i18n bundles")
    parser.add_argument("--po-dir", default="locales", help="Directory containing .po files")
    parser.add_argument("--out-dir", default="../client/src/locales", help="Output directory for JSON bundles")
    args = parser.parse_args()
    
    compile_translations(args.po_dir, args.out_dir)
