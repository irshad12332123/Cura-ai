def clean_response(text: str) -> str:
    """Remove weird markdown, spacing, or hallucinated tokens."""
    return text.replace("```", "").strip()
