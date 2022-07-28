var express = require('express');
const http = require("http");
const db = require("./db/config");
const bodyParser = require("body-parser");

require("dotenv").config();



const authRoutes = require("./routes/auth");
const sellerRoutes = require("./routes/seller")
const buyerRoutes = require("./routes/buyer")

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));


app.use("/auth", authRoutes);
app.use("/seller", sellerRoutes);
app.use("/buyer",buyerRoutes)

app.use("/ping", function (req, res, next) {
  res.status(200).send("pong");
});

app.set("port", 5012);

var server = http.createServer(app);

db.connect().then(() => {
  server.listen(8080, function () {
    console.log(
      "Example app listening on port 8080!! CI/CD FOR STAGING COMPLETE!!! Go to https://localhost/"
    );
  })

})


module.exports = app;
