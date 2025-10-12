const express = require('express');
const establishConnection = require('../DBConnection.js');
const jwt = require('jsonwebtoken')
const authRouter = express.Router();
  
console.log(process.env.JWT_SECRET)
;
authRouter.post('/login', async(req,res)=>{
  console.log("LOGIN ENDPOINT HIT");
  const { username, password } = req.body;
  if (!username || !password ) return res.status(400).json({message: "Please enter details"});

  try {
    const connection =  await establishConnection();

    const [rows] = await connection.query('SELECT * FROM users WHERE username = ?', [username]);
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

module.exports = authRouter