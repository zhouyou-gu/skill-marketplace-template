# JSON Validation Skill

Validate JSON documents against JSON Schema with structured, machine-readable error output.

## Inputs

- `json_path` (string): path to the JSON document to validate
- `schema_path` (string): path to the JSON Schema document
- `max_errors` (integer, optional): maximum number of validation errors to return

## Output

- `valid` (boolean): whether validation passed
- `error_count` (integer): number of returned errors
- `errors` (array): validation errors with `path`, `message`, and `keyword`
