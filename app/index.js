const express    = require('express');
const bodyParser = require('body-parser');
const mongoose   = require('mongoose');
const dotenv     = require("dotenv");

dotenv.config();
const taskRoutes = require('./routes/taskRoutes');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const brandRoutes = require('./routes/brandRoutes');
const stockRoutes = require('./routes/stockRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const attachmentRoutes = require('./routes/attachmentRoutes');
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
app.use('/api/brand', brandRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/review', reviewRoutes);
app.use('/api/attachment', attachmentRoutes);
app.use('/api/category', categoryRoutes);

app.use(notFound);

app.use(defaultError);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
