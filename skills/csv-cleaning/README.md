# CSV Cleaning Skill

Clean and normalize CSV datasets with common data hygiene operations.

## Capabilities

- Trim leading and trailing whitespace in string columns
- Drop duplicate rows
- Fill missing values by column
- Export cleaned output for downstream analysis

## Tool

- Name: `csv_clean`
- Input: `csv_path`, optional output and cleaning options
- Output: cleaned file path and summary statistics

## Example MCP Request

```json
{
  "csv_path": "./data/customers.csv",
  "output_path": "./data/customers.cleaned.csv",
  "drop_duplicates": true,
  "trim_whitespace": true,
  "fill_missing": {
    "country": "unknown",
    "is_active": false
  }
}
```
