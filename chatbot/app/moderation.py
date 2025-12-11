def evaluate_safety(mod):
    """Evaluate OpenAI moderation output and decide response action."""
    if not mod:
        return None  # no moderation error

    cat = mod.category_scores  # CategoryScores object

    violence = getattr(cat, "violence", 0)
    hate = getattr(cat, "hate", 0)
    self_harm = getattr(cat, "self_harm", 0)
    sexual = getattr(cat, "sexual", 0)

    # SUICIDE / SELF-HARM
    if self_harm > 0.5:
        return {
            "block": True,
            "message": (
                "I'm really sorry you're feeling this way. You deserve help and support.\n\n"
                "Please reach out to your local suicide hotline or emergency services immediately.\n"
                "Find helplines: https://www.iasp.info/crisis-centres-helplines/"
            )
        }

    # Violence / Hate
    if violence > 0.7 or hate > 0.7:
        return {
            "block": True,
            "message": "I cannot discuss violent or harmful content."
        }

    # Sexual or explicit
    if sexual > 0.6:
        return {
            "block": True,
            "message": "I cannot answer sexually explicit questions."
        }

    return None
