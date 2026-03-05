#!/usr/bin/env python3
"""Verify that skill install targets are resolvable from package registries."""

from __future__ import annotations

import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path
from typing import Any

import yaml

ROOT = Path(__file__).resolve().parents[1]
SKILLS_DIR = ROOT / "skills"


def load_yaml(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return yaml.safe_load(fh)


def first_error_lines(stderr: str, stdout: str, limit: int = 3) -> str:
    lines = [line.strip() for line in (stderr or stdout).splitlines() if line.strip()]
    if not lines:
        return "unknown error"
    return "; ".join(lines[:limit])


def check_pip_package(package: str) -> tuple[bool, str]:
    with tempfile.TemporaryDirectory(prefix="skill-pkg-check-") as tmp_dir:
        cmd = [
            sys.executable,
            "-m",
            "pip",
            "download",
            "--disable-pip-version-check",
            "--no-deps",
            "--dest",
            tmp_dir,
            package,
        ]
        proc = subprocess.run(cmd, capture_output=True, text=True)

    if proc.returncode == 0:
        return True, ""

    return False, first_error_lines(proc.stderr, proc.stdout)


def check_npm_package(package: str) -> tuple[bool, str]:
    if shutil.which("npm") is None:
        return False, "npm command is not available"

    env = os.environ.copy()
    env["NPM_CONFIG_USERCONFIG"] = os.devnull

    cmd = ["npm", "view", package, "version", "--json"]
    proc = subprocess.run(cmd, capture_output=True, text=True, env=env)

    if proc.returncode == 0:
        return True, ""

    return False, first_error_lines(proc.stderr, proc.stdout)


def main() -> int:
    if not SKILLS_DIR.exists():
        print(f"ERROR: skills directory not found: {SKILLS_DIR}")
        return 1

    skill_dirs = sorted(path for path in SKILLS_DIR.iterdir() if path.is_dir())
    if not skill_dirs:
        print("No skills found under skills/. Nothing to verify.")
        return 0

    failures: list[str] = []
    checks = 0

    for skill_dir in skill_dirs:
        skill_yaml_path = skill_dir / "skill.yaml"
        if not skill_yaml_path.exists():
            continue

        skill_data = load_yaml(skill_yaml_path)
        if not isinstance(skill_data, dict):
            failures.append(f"{skill_yaml_path.relative_to(ROOT)}: invalid YAML mapping")
            continue

        skill_id = skill_data.get("id", skill_dir.name)
        install = skill_data.get("install", {})

        if not isinstance(install, dict):
            failures.append(f"{skill_yaml_path.relative_to(ROOT)}: install must be an object")
            continue

        pip_pkg = install.get("pip")
        if isinstance(pip_pkg, str) and pip_pkg.strip():
            checks += 1
            ok, message = check_pip_package(pip_pkg.strip())
            if ok:
                print(f"PASS [{skill_id}] pip package resolvable: {pip_pkg.strip()}")
            else:
                failures.append(f"FAIL [{skill_id}] pip '{pip_pkg.strip()}': {message}")

        npm_pkg = install.get("npm")
        if isinstance(npm_pkg, str) and npm_pkg.strip():
            checks += 1
            ok, message = check_npm_package(npm_pkg.strip())
            if ok:
                print(f"PASS [{skill_id}] npm package resolvable: {npm_pkg.strip()}")
            else:
                failures.append(f"FAIL [{skill_id}] npm '{npm_pkg.strip()}': {message}")

    if failures:
        print(f"\nInstallation target verification failed ({len(failures)} issue(s)):")
        for item in failures:
            print(f"  - {item}")
        return 1

    print(f"\nInstallation target verification passed ({checks} checks).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
