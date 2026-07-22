const authService = require('../services/authService');

const register = async (req, res, next) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      },
      token: userData.token
    });
  } catch (error) {
    res.status(error.statusCode || 400);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      data: {
        _id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
      },
      token: userData.token
    });
  } catch (error) {
    res.status(error.statusCode || 401);
    next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const user = await authService.getUserById(req.user._id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(error.statusCode || 404);
    next(error);
  }
};

module.exports = {
  register,
  login,
  getMe
};