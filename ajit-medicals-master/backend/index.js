/* Load the Express library */
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const orderRoutes = require("./routes/order");
const productRoutes = require("./routes/product");
const categoryRoutes = require("./routes/category");

/*--------------------------------Create an HTTP server to handle responses--------------------------------*/
// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

const app = express();

// Init middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// Logger
app.use("/", (req, res, next) => {
  console.log(`${req.protocol}://${req.get("host")}${req.originalUrl}`);
  next();
});

// Routes:
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", orderRoutes);
app.use("/api", productRoutes);
app.use("/api", categoryRoutes);

// Listen to req
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at Port ${PORT}`);
});
