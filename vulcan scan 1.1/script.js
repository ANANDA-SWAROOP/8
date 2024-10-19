document.addEventListener('DOMContentLoaded', () => {
    const codeInput = document.getElementById('codeInput');
    const languageSelect = document.getElementById('languageSelect');
    const checkButton = document.getElementById('checkButton');
    const results = document.getElementById('results');

    checkButton.addEventListener('click', async () => {
        const code = codeInput.value.trim();
        const language = languageSelect.value;

        if (!code) {
            alert('Please enter some code to analyze.');
            return;
        }

        results.innerHTML = 'Analyzing...';

        try {
            const response = await axios.post('http://127.0.0.1:5000/analyze_code', { code, language });
            results.innerHTML = formatResults(response.data.analysis);
        } catch (error) {
            console.error('Error:', error);
            results.innerHTML = `Error: ${error.response?.data?.error || error.message}`;
        }
    });

    function formatResults(analysis) {
        let html = '<h3>Vulnerability Analysis Results:</h3>';
        html += `<p>Overall Risk: <strong>${analysis.overall_risk}</strong></p>`;
        
        html += '<h4>Machine Learning Analysis:</h4>';
        html += `<p>Label: ${analysis.ml_analysis.label}</p>`;
        html += `<p>Confidence Score: ${(analysis.ml_analysis.score * 100).toFixed(2)}%</p>`;
        
        html += '<h4>Rule-Based Analysis:</h4>';
        if (analysis.rule_based_analysis.length > 0) {
            html += '<ul>';
            analysis.rule_based_analysis.forEach(vuln => {
                html += `<li>
                    <strong>${vuln.type}</strong> (Risk Level: ${vuln.risk_level})<br>
                    ${vuln.description}
                </li>`;
            });
            html += '</ul>';
        } else {
            html += '<p>No known vulnerabilities detected.</p>';
        }
        return html;
    }
});
