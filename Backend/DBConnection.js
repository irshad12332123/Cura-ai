const mysql = require('mysql2/promise');

const establishConnection = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DATABASE_HOST || 'localhost',
      user: process.env.DATABASE_USER || 'root',
      password: process.env.DATABASE_PASSWORD || 'irshad12345.',
      database: process.env.DATABASE_NAME || 'cura_ai',
    });

    console.log('Connected to the MySQL database.');

    return connection; 
  } catch (err) {
    console.error('Error connecting to the database:', err);
    throw err;
  }
};

module.exports =  establishConnection ;
