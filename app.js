var express = require('express');
const http = require("http");
const db = require("./db/config");

require("dotenv").config();

var app = express();




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
