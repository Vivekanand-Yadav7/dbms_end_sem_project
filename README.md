# Digital Certificate Verification System (DBMS-Centric)

A secure and modern platform for issuing and verifying digital certificates, built with a focus on relational database principles.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Server**:
   ```bash
   node server.js
   ```

3. **Access the Portal**:
   - Home: `http://localhost:3000`
   - Verify: `http://localhost:3000/verify.html`
   - Admin: `http://localhost:3000/admin.html`

## 🛠 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: SQLite3 (Relational)
- **Frontend**: Vanilla HTML5, CSS3 (Modern UI), JavaScript (ES6+)

## 📊 DBMS Highlights
- **Schema Design**: 3NF Normalized tables.
- **Security**: UUID-based unique certificate IDs.
- **Audit Trail**: Every verification attempt is logged with a timestamp.
- **Indexing**: Optimized lookups on `cert_id`.
- **Integrity**: Foreign key constraints and NOT NULL attributes.

## 🎨 UI Features
- **Responsive Design**: Works on mobile and desktop.
- **Glassmorphism**: Subtle card-based layouts.
- **Dynamic Feedback**: Real-time validation and stats update.
