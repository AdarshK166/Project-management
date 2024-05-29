const express = require("express");
const passport = require("../config/passport");
const { enableTwoFactorAuth, verifyTwoFactorAuth } = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);

// 2FA routes
router.post("/2fa/enable", passport.authenticate("jwt", { session: false }), enableTwoFactorAuth);
router.post("/2fa/verify", passport.authenticate("jwt", { session: false }), verifyTwoFactorAuth);

// Google OAuth routes
router.get("/oauth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/oauth/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  res.json({ token: req.user.generateJWT() });
});

// LinkedIn OAuth routes
router.get("/oauth/linkedin", passport.authenticate("linkedin", { scope: ["r_liteprofile", "r_emailaddress"] }));
router.get("/oauth/linkedin/callback", passport.authenticate("linkedin", { session: false }), (req, res) => {
  res.json({ token: req.user.generateJWT() });
});

module.exports = router;
