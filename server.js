require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
var urlExists = require("url-exists");

// Basic Configuration
const port = process.env.PORT || 3000;

var shortUrls = [];
let counter = -1;

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// for parsing application/xwww-
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/api/shorturl/new", (req, res) => {
  if (req.body.url in shortUrls) {
    result = {
      original_url: req.body.url,
      short_url: shortUrls.indexOf(req.body.url),
    };
    res.send(result);
  } else {
    urlExists(req.body.url, function (err, exists) {
      if (exists === false) {
        result = {
          error: "Invalid URL",
        };
        res.send(result);
      } else {
        counter = counter + 1;
        shortUrls.push(req.body.url);
        result = {
          original_url: req.body.url,
          short_url: shortUrls.indexOf(req.body.url),
        };
        res.send(result);
      }
    });
  }
});

app.get("/api/shorturl/:id", (req, res) => {
  console.log(shortUrls);
  if (req.params.id <= counter) {
    res.redirect(shortUrls[req.params.id]);
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
