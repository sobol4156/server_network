const Message = require("../models/Message.js");

class ChatController {
  async getChat(req, res) {
    try {
      const { room } = req.body;

      if (!room) {
        return res.status(400).json({ message: "Не передан ID комнаты" });
      }
      const messages = await Message.findAll({
        where: { room },
        order: [["createdAt", "ASC"]],
      });
      console.log(messages);
      return res.status(200).json(messages);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Ошибка при получении чата" });
    }
  }
  async getChats(req, res) {
    try {
      const { room } = req.body;
      if (!room) {
        return res.status(400).json({ message: "Не передан ID комнаты" });
      }
      const messages = await Message.findAll({
        where: { room },
        order: [["createdAt", "ASC"]],
      });
      console.log(messages);
      return res.status(200).json(messages);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Ошибка при получении чата" });
    }
  }
}

module.exports = new ChatController();
