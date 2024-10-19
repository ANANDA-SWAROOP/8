import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
import traceback
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Hugging Face API token (replace with your actual token)
HF_API_TOKEN = "HF_API_TOKEN"

# Initialize the text classification pipeline
classifier = pipeline("text-classification", model="microsoft/codebert-base-mlm")

print(f"Hugging Face API Token: {'Set' if HF_API_TOKEN else 'Not Set'}")

@app.route('/analyze_code', methods=['POST'])
def analyze_code():
    try:
        data = request.json
        code = data.get('code', '')
        language = data.get('language', '')

        if not code:
            return jsonify({"error": "Please provide code to analyze."}), 400

        # Analyze the code using the Hugging Face model
        result = classifier(code)

        # Process the result
        analysis = {
            "label": result[0]['label'],
            "score": result[0]['score']
        }

        return jsonify({"analysis": analysis})
    except Exception as e:
        app.logger.error(f"Unexpected error: {str(e)}")
        app.logger.error(traceback.format_exc())
        return jsonify({"error": f"Unexpected error: {str(e)}"}), 500

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
