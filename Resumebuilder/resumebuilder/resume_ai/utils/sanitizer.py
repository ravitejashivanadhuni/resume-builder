import re

def clean_text(text):
    text = re.sub(r'<[^>]+>', '', text)  # Remove HTML tags
    text = text.replace('\\n', '\n').replace('\\t', '\t')
    return text.strip()
