const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const { sequelize } = require("./models");
const dotenv = require("dotenv");
const passport = require("./config/passport");
const errorHandler = require("./middlewares/errorHandler");
const logger = require("./config/logger");

dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(passport.initialize());

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await sequelize.authenticate();
  console.log("Database connected!");
});
