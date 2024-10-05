const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");


const { secret, refreshSecret } = require("../config/config");
const accesTokenLife = "15m";
const refreshTokenLige = "7d";

class AuthController {
  async getAllUsers(req, res){
    try{
      const currentUserId = req.body.id; 
      
      // Получаем всех пользователей, кроме текущего
      const arrayUsers = await User.findAll({
        where: {
          id: { [Op.ne]: currentUserId },
        },
      });
     
     return res.status(200).json({users:arrayUsers})
    }catch(err){
      console.log("Ошибка получения всех юзеров");
      return res.status(500).json({ message: "Ошибка получения всех юзеров", err });
    }
  }

  async register(req, res) {
    try {
      console.log(req.body)
      const { name, email, password } = req.body;

      const candidate = await User.findOne({ where: { email } });
      if (candidate) {
        return res.status(400).json({ message: "Пользователь уже существует" });
      }
      const hashedPassword = await bcrypt.hash(password, 7);

      let roles = ["User"];

      const user = await User.create({
        name,
        email,
        password: hashedPassword,
        roles,
      });
      return res.status(200).json({ message: "Пользователь успешно создан" });
    } catch (err) {
      console.log("Ошибка регистрации");
      return res.status(400).json({ message: "Ошибка регистрации", err });
    }
  }
  async login(req, res) {
    try {
      const { email, password } = req.body;

      const candidate = await User.findOne({ where: { email } });
      if (!candidate) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }

      const isGoodPass = await bcrypt.compare(password, candidate.password);

      if (!isGoodPass) {
        return res.status(400).json({ message: "Неверный логин или пароль" });
      }

      const accesToken = jwt.sign(
        { id: candidate.id, name: candidate.name },
        secret,
        {
          expiresIn: accesTokenLife,
        }
      );

      const refreshToken = jwt.sign(
        { id: candidate.id, name: candidate.name },
        refreshSecret,
        {
          expiresIn: accesTokenLife,
        }
      );

      res.cookie("accessToken", accesToken, {
        httpOnly: true,
        secure: "production",
        sameSite: "None",
        maxAge: 15* 60 * 1000,
      });
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: "production",
        sameSite: "None",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({ success: true });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: "Ошибка авторизации" });
    }
  }

  async refreshToken(req, res) {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Необходима авторизация" });
    }
    try {
      const decoded = jwt.verify(refreshToken, refreshSecret);

      const newAccesToken = jwt.sign(
        {
          id: decoded.id,
          name: decoded.name,
        },
        secret,
        {
          expiresIn: accesTokenLife,
        }
      );
      res.cookie("accessToken", newAccesToken, {
        httpOnly: true,
        secure: "production",
        sameSite: "None",
        maxAge: 15 * 60 * 1000,
      });
      return res.status(200).json({message: 'Access токен обновлён'})
    } catch (err) {
      return res.status(403).json({ message: "Неверный refresh токен" });
    }
  }

  async logout(req, res) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
    return res.status(200).json({ message: "Вы вышли из системы" });
  }

  async profile(req, res) {
    try {
      const token = req.cookies.accessToken;
      if (!token) {
        return res
          .status(401)
          .json({ message: "Нет токена, необходима авторизация" });
      }
     
      const decoded = jwt.verify(token, secret);
      if (!decoded) {
        return res.status(401).json({ message: "Неверный токен" });
      }

      const user = await User.findByPk(decoded.id);
      if (!user) {
        return res.status(404).json({ message: "Пользователь не найден" });
      }

      return res.status(200).json({
        id: user.id,
        email: user.email,
        name: user.name,
      });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ message: "Ошибка при получении данных профиля" });
    }
  }
}

module.exports = new AuthController();
