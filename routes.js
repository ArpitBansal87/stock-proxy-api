const WebSocketClient = require("websocket").client;

const RESPONSE_HEADERS = {
  CORS_ENABLED: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

const httpEndPoints = {
  GET: {
    "/": function (req, res, db) {
      res.writeHead(200, RESPONSE_HEADERS.CORS_ENABLED);
      res.end(JSON.stringify({ data: true }));
    },
  },
};

const wsEndPoints = {
  "/stocks": function (req, res) {
    getStocksList(req, res);    
  },
};

const getStocksList = (client) => {
    console.log("inside the WS connection");
    const clientObj = new WebSocketClient();

    clientObj.on("connectFailed", function (error) {
      console.log("Connect Error: " + error.toString());
    });

    clientObj.on("connect", function (connection) {
      console.log("WebSocket Client Connected");
      connection.on("error", function (error) {
        console.log("Connection Error: " + error.toString());
      });
      connection.on("close", function () {
        console.log("echo-protocol Connection Closed");
      });
      connection.on("message", function (message) {
        if (message.type === "utf8") {
          console.log("Received: '" + message.utf8Data + "'");
        }
        client.send(message.utf8Data);
      });

    });

    clientObj.connect("ws://stocks.mnet.website", "echo-protocol");
}

module.exports = {
  httpRoutes: httpEndPoints,
  wsRoutes: wsEndPoints,
};
