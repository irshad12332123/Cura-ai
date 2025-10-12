const express = require('express');
const establishConnection = require('../DBConnection.js');
const jwt = require('jsonwebtoken')
const authRouter = express.Router();
const bcrypt = require('bcrypt')
console.log(process.env.JWT_SECRET)

authRouter.post('/login', async(req,res)=>{
  console.log("LOGIN ENDPOINT HIT");
  const { username, password } = req.body;
  if (!username || !password ) return res.status(400).json({message: "Please enter details"});

  try {
    const connection =  await establishConnection();

    const [rows] = await connection.query('SELECT * FROM auth WHERE username = ?', [username]);
    console.log("AFTER GETTING THE RESPONSE FROM DB",rows[0])
    if (!rows.length) return res.status(400).json({message: "Invalid credentials!"})

    const analyst = rows[0];

    const token = jwt.sign({id: analyst.id, username: analyst.username},process.env.JWT_SECRET, {expiresIn: '5min'});

     if (token) return res.status(200).json({message: "Login Succesfull", accessToken: token})
      else return res.status(400).json({message: "Login Failed"})
  } catch (error) {
    res.status(500).json({message: 'Internal server error.'});
    console.error('Error during login:', error);
  }
})

authRouter.post('/register', async(req,res)=>{

  const { username, password } = req.body;
  if (!username || !password ) return res.status(400).json({message: "Please enter details"});

  try {
    const connection =  await establishConnection();

    const [existingUser] = await connection.query('SELECT * FROM auth WHERE username = ?', [username]);
    console.log("AFTER GETTING THE RESPONSE FROM DB",existingUser[0])
    if (existingUser.length ) return res.status(400).json({message: "User Exist"})

      const hashedPassword = await bcrypt.hash(password, 10);

      await connection.query(
      'INSERT INTO auth (username, hashed_password) VALUES (?, ?)',
      [username, hashedPassword]
    );

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: "Internal server error" });
  }
})

module.exports = authRouter