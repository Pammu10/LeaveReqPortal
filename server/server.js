require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const mysql2 = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())


const db = mysql2.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD, 
    database: process.env.DB_NAME,
    port: 3306,
    multipleStatements: true
});




app.post("/auth/google/callback", async (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: "Authorization code is required" });

  try {
    const idToken = code.credential;
    const decoded = jwt.decode(idToken);
    const { email, name, sub } = decoded;
    if (!email) return res.status(400).json({ error: "Invalid Google response" });

    db.query("SELECT * FROM users WHERE email = ?", [email], (err, results) => {
      if (err) return res.status(500).json({ error: "Database error" });

      if (results.length === 0) {
        db.query(
          "INSERT INTO users (registration_number, student_name, email, role) VALUES (?, ?, ?, ?)",
          [sub, name, email, 1],
          (insertErr) => {
            if (insertErr) return res.status(500).json({ error: insertErr });

            const jwtToken = jwt.sign({ email, name, id: sub, role: 1 }, process.env.JWT_SECRET, { expiresIn: "7d" });
            return res.json({ token: jwtToken });
          }
        );
      } else {
        const jwtToken = jwt.sign({ email, name, id: sub, role: results[0].role }, process.env.JWT_SECRET, { expiresIn: "7d" });
        return res.json({ token: jwtToken }); 
      }
    });
  } catch (error) {
    console.error("Error exchanging code:", error);
    if (!res.headersSent) res.status(400).json({ error: "Failed to authenticate with Google" });
  }
});


const JWT_SECRET = process.env.JWT_SECRET;

app.get('/', (req, res) => {
  res.status(200).json({message: 'You are working fine'})
})

// Registration endpoint
app.post('/register', async (req, res) => {
    const { registration_number, student_name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (registration_number, student_name, email, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [registration_number, student_name, email, hashedPassword, 1], (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: 'User with this email already exists' });
        }
        console.error('Database Query Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else {
        const token = jwt.sign({ studentId: registration_number }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'User registered successfully', token });
      }
    });
  });
  
  // Login endpoint
  app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, result) => {
      if (err) {
        console.error('Database Query Error:', err);
        res.status(500).json({ message: 'Internal Server Error' });
      } else if (result.length === 0) {
        res.status(404).json({ message: 'User not found' });
      } else {
        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            const token = jwt.sign({ studentId: user.registration_number }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ message: 'Login successful', token });
        } else {
          res.status(401).json({ message: 'Invalid credentials'});
        }
      }
    });
  });



  const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });
  
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({message: 'Failed to authenticate token'});
        req.user = decoded;
        next();
    })
  }

  const checkAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(403).json({ message: 'No token provided' });
  
    const token = authHeader.split(' ')[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({message: 'Failed to authenticate token'});
        if (decoded.role !== 0) return res.status(403).json({message: 'Unauthorized token'});
        next();
    })
  }

//GET ROUTES FOR STUDENT


app.get('/get-user', verifyToken, (req, res) => {
    const studentId = req.user.id;
    const query = 'SELECT student_name FROM users WHERE registration_number = ?';
    db.query(query, [studentId], (err, result) => {
        if (err) {
            console.error('Database Query Error:', err);
            res.status(500).json({ message: 'Internal Server Error' });
        } else if (result.length === 0) {
            res.status(404).json({ message: 'Data not found' });
        } else {
            res.json(result[0]);
        }
    });
});

app.get('/leave-status/latest', verifyToken, (req, res) => {
    try {
      const studentId = req.user.id;
      const query = 'SELECT * FROM leave_requests WHERE studentID = ? ORDER BY created_at DESC LIMIT 1';
      
      db.query(query, [studentId], (err, result) => {
        if (err) {
          console.error('Database Query Error:', err);
          res.status(500).json({ message: 'Internal Server Error' });
        } else if (result.length === 0) {
          res.status(404).json({ message: 'Data not found' });
        } else {
          res.json(result[0]);
        }
      });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });



app.get('/leave-history/', verifyToken, (req, res) => {
    try {
        const studentId = req.user.id;
        const query = "SELECT * FROM leave_requests WHERE studentID = ? ORDER BY created_at DESC";
        
        db.query(query, [studentId], (err, result) => {
            if (err) {
                console.error('Database Query Error:', err);
                res.status(500).json({ message: 'Internal Server Error' });
              } else if (result.length === 0) {
                res.status(404).json({ message: 'Data not found' });
              } else {
                res.json(result);
              }
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// POST ROUTE FOR STUDENT
app.post('/submit-leave', verifyToken, (req, res) => {
    try{
    const { Ltype, Visit, fdate, tform, tdate, tto, reason } = req.body;
    const regno = req.user.id;
    const query = 'INSERT INTO leave_requests (leave_type, visiting_place, from_date, from_time, to_date, to_time, reason, studentID) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    
    db.query(query, [Ltype, Visit, fdate, tform, tdate, tto, reason, regno], (err, result) => {
        if (err) throw err;
        res.status(200).json({message:'Leave application submitted successfully'});
    });
    }
    catch(err){
        console.error(err);
    }
    
});


// HOD PAGES

app.get("/pending-leaves", verifyToken, checkAdmin, (req, res) => {
    const query = "SELECT * from leave_requests l, users r where l.studentID = r.registration_number AND l.status = 'pending' ORDER BY created_at DESC";
    db.query(query, (err, result) => {
        if (err) {
            console.error("Database Query Error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json(result);
    });
});


app.get("/all-leaves", verifyToken, checkAdmin, (req, res) => {
  const query = "SELECT * from leave_requests l, users r where l.studentID = r.registration_number ORDER BY created_at DESC;";
  db.query(query, (err, result) => {
      if (err) {
          console.error("Database Query Error:", err);
          return res.status(500).json({ message: "Internal Server Error" });
      }
      res.json(result);
  });
});


app.post("/update-leave-status", verifyToken, (req, res) => {
    const { id, status } = req.body;
    if (!["approved", "rejected"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }
    const query = "UPDATE leave_requests SET status = ? WHERE id = ?";
    db.query(query, [status, id], (err, result) => {
        if (err) {
            console.error("Database Update Error:", err);
            return res.status(500).json({ message: "Internal Server Error" });
        }
        res.json({ message: `Leave request ${status} successfully` });
    });
});







const startServer = async () => {
  db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});
  app.listen(8080, () => {
  console.log('Server running on port 8080');
});
}

startServer();