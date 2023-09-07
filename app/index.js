const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");

dotenv.config();
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const brandRoutes = require("./routes/brandRoutes");
const stockRoutes = require("./routes/stockRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
// const attachmentRoutes = require('./routes/attachmentRoutes');
const { notFound, defaultError } = require("./middlewares/errorMiddleware");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(express.static('public'))
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, path.join(__dirname, '../public/'));
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const extension = path.extname(originalName);

    console.log(file);
    if (extension) {
      cb(null, Date.now() + extension);
    } else {
      cb(null, Date.now() + "-" + originalName);
    }
  },
});

const upload = multer({ storage: storage });
app.post("/api/attachment", async (req, res) => {
  try {
    await upload.single("fileSource")(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.error("Multer Error:", err);
        res.status(400).json({ error: "Multer Error" });
      } else if (err) {
        console.error("Other Error:", err);
        res.status(500).json({ error: "Server Error" });
      } else {
        res.json({ success: true });
      }
    });
  } catch (err) {
    console.error("Catch Error :", err);
    res.status(500).json({ error: "Server Error" });
  }
});

app.use('/api/attachment', express.static('uploads'));
app.use("/api/task", taskRoutes);
app.use("/api/user", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/brand", brandRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/review", reviewRoutes);
// app.use('/api/attachment', attachmentRoutes);
app.use("/api/category", categoryRoutes);

app.use(notFound);

app.use(defaultError);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
