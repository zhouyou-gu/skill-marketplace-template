# Example: Draft Then Publish

1. Draft with `publish=false`.
2. Review the generated files under `.temp/<skill-id>/`.
3. Re-run with `publish=true` once the user approves the package.
4. Publish into `skills/<skill-id>/` in the resolved marketplace repository when a matching local clone is available.
5. Run validation and registry build checks after publishing.
