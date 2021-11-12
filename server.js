const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const path = require("path");
const ws = require("ws");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "public/index.html");
});

server.listen(3000, () => {
  console.log("listening on *:3000");
});

const clients = new Set();

const wsServer = new ws.WebSocketServer({ noServer: true });
wsServer.on("connection", (socket) => {
  clients.add(socket);
  socket.on("message", (message) => {
    console.log(message.toString());
    clients.forEach(client => client.send(message.toString()));
  });
});

server.on('upgrade', (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, socket => {
    wsServer.emit('connection', socket, request);
  });
});
