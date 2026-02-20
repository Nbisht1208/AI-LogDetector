import re

def clean_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"[^a-z0-9\s./:-]", "", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text

def normalize_log(log: dict) -> str:
    return clean_text(
        f"{log.get('ip','')} {log.get('endpoint','')} {log.get('severity','')} {log.get('message','')}"
    )