const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const dotenv     = require("dotenv");

dotenv.config();
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const { notFound, defaultError } = require('./middlewares/errorMiddleware');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/task', taskRoutes);
app.use('/api/user', userRoutes);
app.use('/api/product', productRoutes);

app.use(notFound);

app.use(defaultError);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
