const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const router = express.Router();

// ---------------- REGISTER ----------------
// GET: hiển thị form đăng ký
router.get("/register", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Register</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; }
        .container { max-width: 400px; margin: 80px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        h2 { text-align: center; margin-bottom: 20px; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
        button { width: 100%; padding: 10px; background: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #0056b3; }
        a { display: block; margin-top: 15px; text-align: center; color: #007bff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Register</h2>
        <form method="POST" action="/register">
          <input name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Register</button>
        </form>
        <a href="/login">Already have an account? Login</a>
      </div>
    </body>
    </html>
  `);
});

// POST: xử lý đăng ký
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = new User({ username, password });
    await user.save();
    res.redirect("/login"); // đăng ký xong chuyển sang login
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ---------------- LOGIN ----------------
// GET: hiển thị form login
router.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Login</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; }
        .container { max-width: 400px; margin: 80px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
        h2 { text-align: center; margin-bottom: 20px; }
        input { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; }
        button { width: 100%; padding: 10px; background: #28a745; color: #fff; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #1e7e34; }
        a { display: block; margin-top: 15px; text-align: center; color: #007bff; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Login</h2>
        <form method="POST" action="/login">
          <input name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
        <a href="/register">Don't have an account? Register</a>
      </div>
    </body>
    </html>
  `);
});

// POST: xử lý login
router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/profile"); // login xong chuyển sang profile
  }
);

// ---------------- LOGOUT ----------------
router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/login");
  });
});

// ---------------- PROFILE ----------------
router.get("/profile", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect("/login");
  }
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Profile</title>
      <style>
        body { font-family: Arial, sans-serif; background: #f2f2f2; }
        .container { max-width: 500px; margin: 80px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 6px rgba(0,0,0,0.2); text-align: center; }
        h2 { color: #28a745; }
        p { margin: 10px 0; }
        a { display: inline-block; margin-top: 20px; padding: 10px 15px; background: #dc3545; color: #fff; border-radius: 4px; text-decoration: none; }
        a:hover { background: #c82333; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>Đăng nhập thành công!</h2>
        <p>Xin chào, <b>${req.user.username}</b></p>
        <a href="/logout">Logout</a>
      </div>
    </body>
    </html>
  `);
});

module.exports = router;
