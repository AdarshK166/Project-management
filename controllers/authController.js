const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { body, validationResult } = require("express-validator");
const { Op } = require("sequelize");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

exports.enableTwoFactorAuth = async (req, res) => {
  const { id: userId } = req.user;
  const secret = speakeasy.generateSecret({ length: 20 });
  const user = await User.findByPk(userId);

  user.twoFactorSecret = secret.base32;
  await user.save();

  qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res.status(500).json({ error: "Error generating QR code" });
    }
    res.json({ secret: secret.base32, qrCode: data_url });
  });
};

exports.verifyTwoFactorAuth = async (req, res) => {
  const { token } = req.body;
  const { id: userId } = req.user;
  const user = await User.findByPk(userId);

  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
    window: 2, // 2-minute window to account for clock skew
  });
  if (verified) {
    res.json({ message: "Two-factor authentication is verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid two-factor authentication token" });
  }
};

exports.register = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.oauthCallback = (req, res) => {
  const token = jwt.sign({ id: req.user.id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ token });
};
