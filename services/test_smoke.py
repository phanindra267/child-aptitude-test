"""Minimal smoke tests for Python microservices."""

from pathlib import Path


def test_service_entrypoints_exist():
    services_dir = Path(__file__).resolve().parent
    service_dirs = [
        path for path in services_dir.iterdir()
        if path.is_dir() and (path / "main.py").exists()
    ]
    assert service_dirs, "Expected at least one service with main.py"
