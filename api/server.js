const express = require("express");
const cors = require("cors");
const categorieRoutes = require("./routes/categorieRoutes");
const materialRoutes = require("./routes/materialRoutes");
const userRoutes = require("./routes/userRoutes");
require("./models");
const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/categories", categorieRoutes);
//app.use("/api/users", userRoutes);
//app.use("/api/materials", materialRoutes);

app.listen(port, () => {
  console.log(`localhost:${port}`);
});
