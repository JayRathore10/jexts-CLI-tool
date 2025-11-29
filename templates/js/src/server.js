const app = require('./app');
const connectDB = require('./configs/db.config');

const PORT = 3000;

// Connect DB locally 
connectDB();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
