const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// 📂 Serve static files properly
const htmlPath = path.resolve(__dirname, '../html');
const cssPath = path.resolve(__dirname, '../css');
const imgPath = path.resolve(__dirname, '../imgs');

app.use(express.static(htmlPath));
app.use('/css', express.static(cssPath));
app.use('/imgs', express.static(imgPath));

console.log('🧭 Serving HTML from:', htmlPath);

// 🧩 MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'userdb'
});

db.connect(err => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL');
  }
});

// 🏠 Route for /
app.get('/', (req, res) => {
  res.sendFile(path.join(htmlPath, 'login.html'));
});

// 🔐 Login route
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('📩 Received from frontend:');
  console.log('Email =', email);
  console.log('Password =', password);

  const query = 'SELECT * FROM users WHERE email = ? AND password = ?';
  db.query(query, [email, password], (err, results) => {
    if (err) {
      console.error('❌ DB query error:', err);
      return res.status(500).send('Server error');
    }
    console.log('🔍 SQL Results:', results);
    res.json({ success: results.length > 0 });
  });
});



// 🚀 Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at: http://localhost:${PORT}`);
});
