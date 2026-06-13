// backend/server.js
require('dotenv').config();
require('./src/utils/whatsapp');
const app = require('./src/app');
const connectDB = require('./src/db/db');

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

app.listen(PORT, () => {
  console.log(`Server locked and loaded on port ${PORT}`);
});