import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from transformers import pipeline
import re
import sys

app = Flask(__name__)
CORS(app)

# Hugging Face API token (replace with your actual token)
HF_API_TOKEN = "HF_API_TOKEN"

# Initialize multiple classification pipelines
try:
    classifiers = [pipeline("text-classification", model="distilbert-base-uncased")]
except Exception as e:
    print(f"Error initializing classifiers: {str(e)}")
    print(traceback.format_exc())
    sys.exit(1)

# Vulnerability patterns with descriptions and risk levels
VULNERABILITY_PATTERNS = {
    'sql_injection': {
        'pattern': r'SELECT.*FROM.*WHERE',
        'description': 'SQL Injection vulnerability detected. This could allow an attacker to manipulate your database queries.',
        'risk_level': 'High'
    },
    'xss': {
        'pattern': r'<script>.*</script>',
        'description': 'Cross-Site Scripting (XSS) vulnerability detected. This could allow an attacker to inject malicious scripts into your web pages.',
        'risk_level': 'High'
    },
    'command_injection': {
        'pattern': r'exec\(|system\(|shell_exec\(',
        'description': 'Command Injection vulnerability detected. This could allow an attacker to execute arbitrary commands on your system.',
        'risk_level': 'Critical'
    },
    'path_traversal': {
        'pattern': r'\.\./',
        'description': 'Path Traversal vulnerability detected. This could allow an attacker to access files outside the intended directory.',
        'risk_level': 'Medium'
    },
}

print(f"Hugging Face API Token: {'Set' if HF_API_TOKEN else 'Not Set'}")

def rule_based_analysis(code):
    vulnerabilities = []
    for vuln_type, vuln_info in VULNERABILITY_PATTERNS.items():
        if re.search(vuln_info['pattern'], code, re.IGNORECASE):
            vulnerabilities.append({
                'type': vuln_type,
                'description': vuln_info['description'],
                'risk_level': vuln_info['risk_level']
            })
    return vulnerabilities

def ensemble_prediction(code):
    results = []
    for classifier in classifiers:
        result = classifier(code)
        results.append(result[0])
    
    # Aggregate results
    labels = [r['label'] for r in results]
    scores = [r['score'] for r in results]
    
    # Use the most common label
    final_label = max(set(labels), key=labels.count)
    # Use the average score
    final_score = sum(scores) / len(scores)
    
    return {'label': final_label, 'score': final_score}

@app.route('/analyze_code', methods=['POST'])
def analyze_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', '')

        if not code:
            return jsonify({"error": "Please provide code to analyze."}), 400

        # Ensemble prediction
        ml_result = ensemble_prediction(code)

        # Rule-based analysis
        rule_based_result = rule_based_analysis(code)

        # Determine overall risk
        risk_levels = [vuln['risk_level'] for vuln in rule_based_result]
        if 'Critical' in risk_levels:
            overall_risk = 'Critical'
        elif 'High' in risk_levels or ml_result['score'] > 0.7:
            overall_risk = 'High'
        elif 'Medium' in risk_levels or ml_result['score'] > 0.4:
            overall_risk = 'Medium'
        else:
            overall_risk = 'Low'

        # Combine results
        analysis = {
            "ml_analysis": ml_result,
            "rule_based_analysis": rule_based_result,
            "overall_risk": overall_risk
        }

        return jsonify({"analysis": analysis})
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": f"Unexpected error: {str(e)}", "traceback": traceback.format_exc()}), 500

@app.route('/test_hf_connection', methods=['GET'])
def test_hf_connection():
    try:
        headers = {
            "Authorization": f"Bearer {HF_API_TOKEN}"
        }
        response = requests.get("https://huggingface.co/api/whoami", headers=headers)
        response.raise_for_status()
        return jsonify({"status": "success", "data": response.json()})
    except requests.exceptions.RequestException as e:
        app.logger.error(f"Hugging Face API error: {str(e)}")
        if hasattr(e, 'response') and e.response is not None:
            app.logger.error(f"Response content: {e.response.content}")
        return jsonify({"error": f"Hugging Face API error: {str(e)}"}), 500
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
