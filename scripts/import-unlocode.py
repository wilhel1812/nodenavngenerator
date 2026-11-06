"""Extract country codes and place names from a UNECE production release."""

import argparse
import csv
import io
import json
from pathlib import Path
import re
import zipfile


def write_json(path, value):
    path.write_text(
        json.dumps(value, ensure_ascii=False, separators=(",", ":")) + "\n",
        encoding="utf-8",
    )


def import_release(edition, source):
    root = Path(__file__).resolve().parents[1]
    places = {}
    with zipfile.ZipFile(source) as archive:
        for part in range(1, 4):
            path = f"release/csv/UNLOCODE CodeListPart{part}.csv"
            with io.TextIOWrapper(archive.open(path), encoding="utf-8-sig", newline="") as file:
                for change, country, code, name, *_ in csv.reader(file):
                    if not re.fullmatch("[A-Z]{2}", country):
                        raise ValueError(f"Unexpected country {country!r} in {path}")
                    names = places.setdefault(country, {})
                    if change != "X" and re.fullmatch("[A-Z2-9]{3}", code) and name:
                        # Some codes have alternate names. Keep the first published name.
                        names.setdefault(code, name)

    if "NO" not in places or len(places) < 200:
        raise ValueError("Incomplete UNECE country list")
    countries = sorted(places)
    del places["NO"]
    output = root / "public" / "unlocode" / edition
    output.mkdir(parents=True, exist_ok=True)
    for country in sorted(places):
        write_json(output / f"{country}.json", dict(sorted(places[country].items())))
    write_json(root / "src" / "unlocode.json", {"edition": edition, "countries": countries})
    print(f"Imported {sum(map(len, places.values())):,} names from {len(places)} countries and territories")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("edition", help="UNECE release tag, e.g. 2025-1")
    parser.add_argument("archive", type=Path, help="UNECE production download (ZIP)")
    args = parser.parse_args()
    if not re.fullmatch(r"\d{4}-[12]", args.edition):
        parser.error("edition must be a UNECE release tag such as 2025-1")
    import_release(args.edition, args.archive)
