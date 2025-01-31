const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const axios = require("axios");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("A client connected");

  socket.on("send_message", async (data) => {
    let parsedData = null;
    try {
      // Check if the incoming message is valid JSON
      parsedData = JSON.parse(data);
    } catch (error) {
      socket.emit("receive_response", {
        error: "Invalid JSON schema",
      });
      return;
    }

    try {
      // const response = await axios.post(
      //   "https://external-api.com/endpoint",
      //   data,
      //   {
      //     headers: { "Content-Type": "application/json" },
      //   }
      // );
      // socket.emit("receive_response", response.data);

      const res = {
        yourMessage: parsedData,
        response: "We've received your message",
      };
      socket.emit("receive_response", res);
    } catch (error) {
      socket.emit("receive_response", {
        error: "Failed to fetch from external API",
      });
    }
  });

  socket.on("disconnect", () => {
    console.log("A client disconnected");
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
