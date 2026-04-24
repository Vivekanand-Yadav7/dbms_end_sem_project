const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// --- API Endpoints ---

/**
 * Verify Certificate
 * DBMS Concept: Indexing, Foreign Keys, Logging
 */
app.get('/api/verify/:cert_id', (req, res) => {
    const certId = req.params.cert_id;

    // Fetch certificate details using a JOIN to get issuer info
    const query = `
        SELECT c.*, u.username as issuer_name 
        FROM certificates c
        LEFT JOIN users u ON c.issuer_id = u.id
        WHERE c.cert_id = ?
    `;

    db.get(query, [certId], (err, row) => {
        const status = row ? 'VALID' : 'INVALID';
        
        // Log the verification attempt
        db.run(
            'INSERT INTO verification_logs (cert_id, status) VALUES (?, ?)',
            [certId, status],
            (logErr) => {
                if (logErr) console.error('Logging Error:', logErr.message);
            }
        );

        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            res.json({ valid: true, data: row });
        } else {
            res.json({ valid: false, message: 'Invalid / Not Found' });
        }
    });
});

/**
 * Add New Certificate
 * DBMS Concept: Primary Key (UUID), Integrity Constraints
 */
app.post('/api/certificates', (req, res) => {
    const { holder_name, course_name, issuing_authority, issuer_id } = req.body;
    const cert_id = 'CERT-' + uuidv4().slice(0, 8).toUpperCase();

    const query = `
        INSERT INTO certificates (cert_id, holder_name, course_name, issuing_authority, issuer_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [cert_id, holder_name, course_name, issuing_authority, issuer_id || 1], function(err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.status(201).json({ message: 'Certificate issued', cert_id });
    });
});

/**
 * List All Certificates
 */
app.get('/api/certificates', (req, res) => {
    const query = 'SELECT * FROM certificates ORDER BY issue_date DESC';
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * Fetch Statistics (DBMS Focused)
 * DBMS Concept: Aggregate Functions, Joins, Group By
 */
app.get('/api/stats', (req, res) => {
    const query = `
        SELECT 
            (SELECT COUNT(*) FROM certificates) as total_issued,
            (SELECT COUNT(*) FROM verification_logs WHERE status = 'VALID') as successful_verifications,
            (SELECT COUNT(*) FROM verification_logs WHERE status = 'INVALID') as failed_attempts
    `;

    db.get(query, [], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(row);
    });
});

/**
 * Fetch verification history for a specific certificate
 * DBMS Concept: Filtering, Sorting
 */
app.get('/api/history/:cert_id', (req, res) => {
    const query = 'SELECT * FROM verification_logs WHERE cert_id = ? ORDER BY verification_timestamp DESC';
    db.all(query, [req.params.cert_id], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

/**
 * List All Verification Logs
 */
app.get('/api/logs', (req, res) => {
    const query = 'SELECT * FROM verification_logs ORDER BY verification_timestamp DESC';
    db.all(query, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
