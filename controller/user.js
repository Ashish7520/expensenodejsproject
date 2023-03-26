const bcrypt = require('bcrypt');
const User = require('../model/User');
const jwt = require('jsonwebtoken');

function generateAccessToken(id, username, isPremiumUser) {
  return jwt.sign(
    { userId: id, username: username, isPremiumUser },
    'jksjdfjkdkgjfljg5412154sghjshjvc556dfdjjv'
  );
}

exports.signup = async (req, res) => {
  try {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await User.create({
      username: username,
      email: email,
      password: hashedPassword,
    });
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    res.status(500).json(error);
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User does not exist',
      });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Password is incorrect',
      });
    }
    res.status(200).json({
      success: true,
      message: 'User logged in successfully',
      token: generateAccessToken(user.id, user.username, user.isPremiumUser),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error, success: false });
  }
};
