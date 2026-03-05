"""Minimal local example for csv-cleaning skill behavior."""

from __future__ import annotations

import pandas as pd


def csv_clean(
    csv_path: str,
    output_path: str,
    drop_duplicates: bool = True,
    trim_whitespace: bool = True,
    fill_missing: dict[str, object] | None = None,
) -> dict[str, object]:
    frame = pd.read_csv(csv_path)
    rows_before = len(frame)

    if trim_whitespace:
        string_columns = frame.select_dtypes(include=["object"]).columns
        for column in string_columns:
            frame[column] = frame[column].apply(
                lambda value: value.strip() if isinstance(value, str) else value
            )

    if fill_missing:
        frame = frame.fillna(fill_missing)

    if drop_duplicates:
        frame = frame.drop_duplicates()

    frame.to_csv(output_path, index=False)

    return {
        "cleaned_path": output_path,
        "rows_before": rows_before,
        "rows_after": len(frame),
        "columns_cleaned": len(frame.columns),
    }


if __name__ == "__main__":
    result = csv_clean(
        csv_path="./input.csv",
        output_path="./output.cleaned.csv",
        drop_duplicates=True,
        trim_whitespace=True,
        fill_missing={"country": "unknown"},
    )
    print(result)
