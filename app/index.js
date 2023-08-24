const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const dotenv     = require("dotenv");

dotenv.config();
const taskRoutes = require('./routes/taskRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

console.log(process.env.PORT, "Bangla");

app.use('/api/tasks', taskRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
