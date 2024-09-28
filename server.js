const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const Message = require('./models/Message'); 
const routerAuth = require("./router/authRouter");
const routerChat = require("./router/chatRouter");
const cookieParser = require("cookie-parser");
const WebSocket = require("ws"); // Добавляем WebSocket
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/auth", routerAuth);
app.use('/api', routerChat)

const start = async () => {
  const server = app.listen(PORT, () => {
    console.log("Server started on PORT", PORT);
  });
  await sequelize.sync({ force: false });

  // Создаем WebSocket сервер и подключаем его к HTTP-серверу
  const wss = new WebSocket.Server({ server });
  const rooms = {};

  wss.on("connection", (ws) => {
    let currentRoom = null;
    console.log("Client connected");

    ws.on("message", async (message) => {
      const messageStr = message.toString();
      console.log("Received message:", messageStr);

      const parsedMessage = JSON.parse(messageStr);
      const { room, content, userId } = parsedMessage;

      try {
        const newMessage = await Message.create({
          room,
          content,
          userId,
          timestamp: new Date(),
        });
        console.log("Message saved:", newMessage);

        // Рассылка сообщения всем пользователям в комнате
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(newMessage));
          }
        });
      } catch (err) {
        console.error("Error saving message to DB:", err);
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
    });
  });
};

start();
