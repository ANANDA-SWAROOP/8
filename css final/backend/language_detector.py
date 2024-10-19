def detect_language(code):
    # Implement language detection logic here
    # This is a simplified example
    if 'def ' in code or 'print(' in code:
        return 'Python'
    elif 'function ' in code or 'console.log(' in code:
        return 'JavaScript'
    elif 'public class ' in code or 'System.out.println(' in code:
        return 'Java'
    else:
        return 'Unknown'
