# API Testing Skill

Run repeatable HTTP API checks using an MCP-style tool contract.

## Inputs

- `url` (string): API endpoint
- `method` (string): HTTP method
- `expected_status` (integer): expected response status code

## Output

- `passed` (boolean): whether the assertion passed
- `actual_status` (integer): observed status code
