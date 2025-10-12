const express = require('express')
const cors = require('cors')
const auth = require('./routes/auth.js')
const app = express()
const PORT = process.env.PORT || 3000;
require('dotenv').config({ path: '../.env' });

app.use(cors());
app.use(express.json());

app.use('/auth', auth);

app.listen(PORT, ()=>{
  console.log(`SERVER RUNNING AT PORT ${PORT}`);
})