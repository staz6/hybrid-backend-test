// Third party library import
var express = require("express");
const http = require("http");
const db = require("./db/config");
const bodyParser = require("body-parser");

require("dotenv").config();

// Router import
const authRoutes = require("./routes/auth");
const sellerRoutes = require("./routes/seller");
const buyerRoutes = require("./routes/buyer");

const globalErrorHandler = require("./controllers/error-controller");

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Routes initialize
app.use("/api/auth", authRoutes);
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);

// Test route
app.use("/ping", function (req, res, next) {
  res.status(200).send("pong");
});
app.use(globalErrorHandler);
//Initialize server
var server = http.createServer(app);

db.connect().then(() => {
  server.listen(8080, function () {
    console.log(
      "Example app listening on port 8080!! Go to http://localhost/8080"
    );
  });
});

module.exports = app;
