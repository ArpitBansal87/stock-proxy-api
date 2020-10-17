const WebSocket = require("ws");
const http = require("http");
const endPoints = require("./routes");
const httpport = 8081;
let stocksConnectionList = [];

const httpServer = http.createServer((req, res) => {
  
});

const wsServer = new WebSocket.Server({ server: httpServer });

wsServer.on("connection", function (client, req) {
  console.log("New WS Connection");

  stocksConnectionList.push(client);
  const index = stocksConnectionList.length;

  const urlObj = req.url.split("?");
  const url = urlObj[0];
  if (url in endPoints.wsRoutes) {
    endPoints.wsRoutes[url](client, req);
  }

  client.on("message", function (msg) {
    console.log(`msg: ${msg}`);
  });

  client.on("close", function(msg) {
    console.log(`Closed connection: ${msg} | Length of Connections: ${stocksConnectionList.length} | Index: ${index}`);
    stocksConnectionList = stocksConnectionList.slice(index - 1 , 1);
  });


});
wsServer.on("close", function(client, req) {
  console.log("closing connection");
});
httpServer.listen(process.env.PORT || httpport);
console.log(`Server is listening on Port: ${httpport}`);
