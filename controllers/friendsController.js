const User = require("../models/User");

class FriendsController {
  async addUser(req, res) {
    try {
      const { idFriend, myId } = req.body;

      // Проверка переданных параметров
      if (!idFriend || !myId) {
        return res
          .status(400)
          .json({ message: "Не переданы idFriend или myId" });
      }

      // Поиск текущего пользователя
      const currentUser = await User.findById(myId);
      if (!currentUser) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      // Проверка, есть ли уже idFriend в списке друзей
      if (currentUser.friends.includes(idFriend)) {
        return res
          .status(200)
          .json({ message: "Пользователь уже в списке друзей" });
      }

      // Добавление idFriend в список друзей
      currentUser.friends.push(idFriend);

      // Сохранение изменений
      await currentUser.save();

      return res
        .status(200)
        .json({
          message: "Пользователь добавлен в друзья",
          friends: currentUser.friends,
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Ошибка на сервере" });
    }
  }
}
module.exports = new FriendsController();
