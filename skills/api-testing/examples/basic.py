"""Minimal example payload for API testing skill."""


def example_payload() -> dict:
    return {
        "url": "https://api.example.com/health",
        "method": "GET",
        "expected_status": 200
    }


if __name__ == "__main__":
    print(example_payload())
