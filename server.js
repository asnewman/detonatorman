const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(__dirname + 'public/index.html');
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});
