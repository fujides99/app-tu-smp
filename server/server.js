const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Melayani file statis dari folder induk
app.use(express.static(path.join(__dirname, '..')));

// Inisialisasi Database
const db = new sqlite3.Database('./database.sqlite', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error connecting to database:", err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS students (id INTEGER PRIMARY KEY AUTOINCREMENT, nis TEXT UNIQUE NOT NULL, name TEXT NOT NULL, class TEXT NOT NULL, gender TEXT NOT NULL)`);
        db.run(`CREATE TABLE IF NOT EXISTS teachers (id INTEGER PRIMARY KEY AUTOINCREMENT, nip TEXT UNIQUE NOT NULL, name TEXT NOT NULL, position TEXT NOT NULL, subject TEXT NOT NULL)`);
        db.run(`CREATE TABLE IF NOT EXISTS correspondence (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT NOT NULL, number TEXT NOT NULL, subject TEXT NOT NULL, recipient TEXT NOT NULL, date TEXT NOT NULL, description TEXT)`);
        db.run(`CREATE TABLE IF NOT EXISTS announcements (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, content TEXT NOT NULL)`);
    }
});

// --- API ENDPOINTS ---
// STUDENTS
app.get('/api/students', (req, res) => db.all("SELECT * FROM students", [], (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)));
app.post('/api/students', (req, res) => {
    const { nis, name, class: studentClass, gender } = req.body;
    db.run(`INSERT INTO students (nis, name, class, gender) VALUES (?, ?, ?, ?)`, [nis, name, studentClass, gender], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, nis, name, class: studentClass, gender });
    });
});
app.put('/api/students/:id', (req, res) => {
    const { nis, name, class: studentClass, gender } = req.body;
    const { id } = req.params;
    db.run(`UPDATE students SET nis = ?, name = ?, class = ?, gender = ? WHERE id = ?`, [nis, name, studentClass, gender, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Student updated successfully" });
    });
});
app.delete('/api/students/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM students WHERE id = ?`, id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Student deleted successfully" });
    });
});

// TEACHERS
app.get('/api/teachers', (req, res) => db.all("SELECT * FROM teachers", [], (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)));
app.post('/api/teachers', (req, res) => {
    const { nip, name, position, subject } = req.body;
    db.run(`INSERT INTO teachers (nip, name, position, subject) VALUES (?, ?, ?, ?)`, [nip, name, position, subject], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, nip, name, position, subject });
    });
});
app.put('/api/teachers/:id', (req, res) => {
    const { nip, name, position, subject } = req.body;
    const { id } = req.params;
    db.run(`UPDATE teachers SET nip = ?, name = ?, position = ?, subject = ? WHERE id = ?`, [nip, name, position, subject, id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Teacher updated successfully" });
    });
});
app.delete('/api/teachers/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM teachers WHERE id = ?`, id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Teacher deleted successfully" });
    });
});

// CORRESPONDENCE
app.get('/api/correspondence', (req, res) => db.all("SELECT * FROM correspondence ORDER BY date DESC", [], (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)));
app.post('/api/correspondence', (req, res) => {
    const { type, number, subject, recipient, date, description } = req.body;
    db.run(`INSERT INTO correspondence (type, number, subject, recipient, date, description) VALUES (?, ?, ?, ?, ?, ?)`, [type, number, subject, recipient, date, description], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
});
app.delete('/api/correspondence/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM correspondence WHERE id = ?`, id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Correspondence deleted successfully" });
    });
});

// ANNOUNCEMENTS
app.get('/api/announcements', (req, res) => db.all("SELECT * FROM announcements ORDER BY id DESC", [], (err, rows) => err ? res.status(500).json({ error: err.message }) : res.json(rows)));
app.post('/api/announcements', (req, res) => {
    const { title, content } = req.body;
    db.run(`INSERT INTO announcements (title, content) VALUES (?, ?)`, [title, content], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID, title, content });
    });
});
app.delete('/api/announcements/:id', (req, res) => {
    const { id } = req.params;
    db.run(`DELETE FROM announcements WHERE id = ?`, id, function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ message: "Announcement deleted successfully" });
    });
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});