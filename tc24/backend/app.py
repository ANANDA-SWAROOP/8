from flask import Flask, request, jsonify
from flask_cors import CORS
from language_detector import detect_language
from code_corrector import correct_code
from vulnerability_checker import check_vulnerabilities

app = Flask(__name__)
CORS(app)

@app.route('/analyze', methods=['POST'])
def analyze_code():
    code = request.json['code']
    language = detect_language(code)
    corrected_code, warnings = correct_code(code, language)
    vulnerabilities = check_vulnerabilities(corrected_code, language)

    return jsonify({
        'language': language,
        'corrected_code': corrected_code,
        'warnings': warnings,
        'vulnerabilities': vulnerabilities
    })

if __name__ == '__main__':
    app.run(debug=True)
