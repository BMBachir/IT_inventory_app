const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const categorieRoutes = require("./routes/categorieRoutes");
const authRoutes = require("./routes/authRoutes");
const sousCategorieRoutes = require("./routes/sousCategorieRoutes");
const materialRoutes = require("./routes/materialRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cookieParser = require("cookie-parser");
const HistoryRoutes = require("./routes/HistoryRoutes");
require("./models");

const app = express();
const port = 5001;

app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://192.168.2.241:3000"],
    credentials: true,
  })
);

app.use(express.json());

app.use("/api/categories", categorieRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sous-categories", sousCategorieRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/users", userRoutes);
app.use("/api/history", HistoryRoutes);

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running on http://192.168.2.241:${port}`);
});
