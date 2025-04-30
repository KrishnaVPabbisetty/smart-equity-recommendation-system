# services/agents/guardrails.py

import re

PROHIBITED_KEYWORDS = [
    "delete", "drop", "truncate", "hack", "bypass", "withdraw", "shutdown"
]

SAFE_OUTPUT_PATTERNS = [
    r"^(Buy|Sell|Hold).*$",
    r"^\[Simulated\].*$",
    r"^[\w\W]{0,1000}$"  # max 1000 chars
]

def is_query_safe(query: str) -> bool:
    """Basic check to ensure the query doesn't contain unsafe instructions."""
    lowered = query.lower()
    return not any(keyword in lowered for keyword in PROHIBITED_KEYWORDS)

def validate_llm_output(output: str) -> str:
    """Validate LLM output against known-safe patterns."""
    for pattern in SAFE_OUTPUT_PATTERNS:
        if re.match(pattern, output):
            return output
    return "[Blocked] Output failed validation."
