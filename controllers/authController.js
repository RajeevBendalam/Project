import bcrypt from 'bcryptjs';
import { db } from '../database/init.js';

export function registerUser(req, res) {
  const { username, email, password } = req.body;
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function(err) {
      if (err) {
        if (err.message.includes('UNIQUE')) {
          res.status(400).json({ 
            success: false, 
            error: 'Username or email already exists' 
          });
        } else {
          res.status(400).json({ 
            success: false, 
            error: 'Registration failed' 
          });
        }
        return;
      }
      res.json({ success: true });
    }
  );
}

export function loginUser(req, res) {
  const { email, password } = req.body;
  
  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    (err, user) => {
      if (err) {
        res.status(500).json({ success: false, error: 'Server error' });
        return;
      }
      
      if (user && bcrypt.compareSync(password, user.password)) {
        req.session.userId = user.id;
        res.json({ success: true });
      } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
    }
  );
}