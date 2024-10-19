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
            const response = await fetch('http://127.0.0.1:5000/analyze_code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ code, language }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.error) {
                results.innerHTML = `Error: ${data.error}`;
            } else {
                results.innerHTML = formatResults(data.analysis);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            results.innerHTML = `Error: ${error.message}. Check the console for more details.`;
        }
    });

    function formatResults(analysis) {
        return `
            <h3>Code Analysis Results:</h3>
            <p>Label: ${analysis.label}</p>
            <p>Confidence Score: ${(analysis.score * 100).toFixed(2)}%</p>
        `;
    }
});
