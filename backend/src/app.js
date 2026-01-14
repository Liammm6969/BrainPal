const express = require("express");
const passport = require("passport");
require("dotenv").config();
require("./auth/passport");

const cors = require("cors");
const morgan = require("morgan");
const authRoutes = require("./routes/auth.routes");
const { errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(morgan("dev"))

app.use(passport.initialize());

app.use("/api/auth", authRoutes);

app.use(errorHandler);

module.exports = app;