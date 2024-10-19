// const express = require('express');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const { exec } = require('child_process');

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());

// // POST route to analyze code
// app.post('/analyze_code', (req, res) => {
//     const code = req.body.code;

//     if (!code) {
//         return res.status(400).json({ error: 'Please provide code to analyze.' });
//     }

//     // Execute CodeFuse-Query script (assuming it's available in the same directory)
//     exec(`python codefuse_query.py --code "${code}"`, (error, stdout, stderr) => {
//         if (error) {
//             return res.status(500).json({ error: `Failed to run CodeFuse-Query: ${error.message}` });
//         }
//         if (stderr) {
//             return res.status(500).json({ error: stderr });
//         }
//         return res.json({ analysis: stdout });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server running on http://localhost:${PORT}`);
// });
