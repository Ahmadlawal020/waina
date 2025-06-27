const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login a user
const handleLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Email and password are required." });
  }

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) {
    return res
      .status(404)
      .json({ message: "Email has not been registered yet." });
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const roles = foundUser.roles;
    const firstName = foundUser.firstName;
    const lastName = foundUser.lastName;
    const id = foundUser._id; // Changed from userId to id

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id, // Changed from userId to id
          email: foundUser.email,
          roles,
          firstName,
          lastName,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { email: foundUser.email },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    foundUser.refreshToken = refreshToken;
    await foundUser.save();

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ id, roles, accessToken }); // Changed from userId to id
  } else {
    res.status(401).json({ message: "Wrong password." });
  }
};

// Logout a user
const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);

  const refreshToken = cookies.jwt;
  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
    return res.sendStatus(204);
  }

  foundUser.refreshToken = "";
  await foundUser.save();

  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.sendStatus(204);
};

// Refresh token
const handleRefreshToken = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;

  const foundUser = await User.findOne({ refreshToken }).exec();
  if (!foundUser) return res.sendStatus(403);

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.email !== decoded.email) return res.sendStatus(403);
    const roles = foundUser.roles;
    const firstName = foundUser.firstName;
    const lastName = foundUser.lastName;
    const id = foundUser._id; // Changed from userId to id

    const accessToken = jwt.sign(
      {
        UserInfo: {
          id, // Changed from userId to id
          email: foundUser.email,
          roles,
          firstName,
          lastName,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );
    res.json({ id, roles, accessToken }); // Changed from userId to id
  });
};

module.exports = {
  handleLogin,
  handleLogout,
  handleRefreshToken,
};
