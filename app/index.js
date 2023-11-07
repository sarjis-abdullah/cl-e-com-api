const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require('cors');
const morgan = require('morgan');
const expressListEndpoints = require("express-list-endpoints");
dotenv.config();

const app = express();
app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// mongoose.connect(process.env.MONGO_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
mongoose.connect("mongodb://localhost:27017", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: "test-db"
}).then((result) => {
  console.log("Database connected");
}).catch((err) => {
  console.log("Database error", err);
});


const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const stockRoutes = require("./routes/stockRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const stripeRoutes = require("./routes/stripeRoutes");
const dashboardRoutes = require("./routes/dashboardRouter");
const reviewRoutes = require("./routes/reviewRoutes");
const attachmentRoutes = require('./routes/newAttachmentRoutes');
const orderRoutes = require('./routes/orderRoutes');
const contactRoutes = require('./routes/contactRoutes');
const { notFound, defaultError } = require("./middlewares/errorMiddleware");
const { auth } = require("./middlewares/userMiddleware");


const port = process.env.PORT || 3000;

app.use(express.static('public'))

app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/subcategory", subcategoryRoutes);
app.use("/api", stripeRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/contact", contactRoutes);
//public routes will be here
app.use(auth);
//auth routes will be here

app.use("/api/task", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use("/api/order", orderRoutes);
app.use("/api/brand", brandRoutes);

app.use("/api/review", reviewRoutes);
app.use('/api/attachment', attachmentRoutes);

app.use(notFound);

// const allRoutes = expressListEndpoints(app);
// console.log(allRoutes);

app.use(defaultError);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
