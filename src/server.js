
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 5001;

// Configure CORS to allow requests from your frontend's origin
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow sending cookies/auth headers with cross-origin requests
  optionsSuccessStatus: 204 // Some browsers expect 204 for successful OPTIONS
}));

// Explicitly handle OPTIONS requests for /posts
app.options('/posts', cors());

app.use(express.json());

const db = new sqlite3.Database('./blog.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS posts (
      id TEXT PRIMARY KEY,
      title TEXT,
      subHeading TEXT, -- Added subHeading column
      content TEXT,
      author TEXT,
      date TEXT
    )`, (createErr) => {
      if (createErr) {
        console.error('Error creating posts table:', createErr.message);
      } else {
        console.log('Posts table created or already exists.');
      }
    });
    db.run(`CREATE TABLE IF NOT EXISTS users (
      uid TEXT PRIMARY KEY,
      email TEXT UNIQUE,
      password TEXT,
      role TEXT DEFAULT 'user',
      isDisabled INTEGER DEFAULT 0
    )`, (createErr) => {
      if (createErr) {
        console.error('Error creating users table:', createErr.message);
      } else {
        console.log('Users table created or already exists.');
      }
    });
  }
});

app.get('/', (req, res) => {
  res.send('Blog Backend is running!');
});

app.post('/posts', (req, res) => {
  const { id, title, subHeading, content, author, date } = req.body;
  db.run(`INSERT INTO posts (id, title, subHeading, content, author, date) VALUES (?, ?, ?, ?, ?, ?)`,
    [id, title, subHeading, content, author, date],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ id: this.lastID });
    });
});

app.get('/posts', (req, res) => {
  db.all(`SELECT * FROM posts`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM posts WHERE id = ?`, [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(row);
  });
});

app.put('/posts/:id', (req, res) => {
  const { id } = req.params;
  const { title, subHeading, content, author, date } = req.body;
  db.run(`UPDATE posts SET title = ?, subHeading = ?, content = ?, author = ?, date = ? WHERE id = ?`,
    [title, subHeading, content, author, date, id],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Post not found or no changes made' });
      }
      res.json({ message: 'Post updated successfully' });
    });
});

app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM posts WHERE id = ?`, [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  });
});

// User management endpoints
app.put('/users/:uid/role', (req, res) => {
  const { uid } = req.params;
  const { role } = req.body;
  db.run(`UPDATE users SET role = ? WHERE uid = ?`,
    [role, uid],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found or no changes made' });
      }
      res.json({ message: 'User role updated successfully' });
    });
});

app.put('/users/:uid/status', (req, res) => {
  const { uid } = req.params;
  const { isDisabled } = req.body;
  db.run(`UPDATE users SET isDisabled = ? WHERE uid = ?`,
    [isDisabled ? 1 : 0, uid],
    function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'User not found or no changes made' });
      }
      res.json({ message: 'User status updated successfully' });
    });
});

app.get('/users', (req, res) => {
  db.all(`SELECT uid, email, role, isDisabled FROM users`, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.get('/users/:uid', (req, res) => {
  const { uid } = req.params;
  db.get(`SELECT uid, email, role, isDisabled FROM users WHERE uid = ?`, [uid], (err, row) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!row) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(row);
  });
});

app.post('/users/signup', (req, res) => {
  const { email, password, role } = req.body;
  const uid = Date.now().toString(); // Simple UID generation
  db.run(`INSERT INTO users (uid, email, password, role) VALUES (?, ?, ?, ?)`,
    [uid, email, password, role || 'user'],
    function (err) {
      if (err) {
        if (err.message.includes('UNIQUE constraint failed')) {
          return res.status(409).json({ error: 'User with this email already exists' });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json({ uid, email, role: role || 'user', isDisabled: 0 });
    });
});

app.post('/users/login', (req, res) => {
  const { email, password } = req.body;
  db.get(`SELECT uid, email, role, isDisabled FROM users WHERE email = ? AND password = ?`,
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      res.json(row);
    });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
