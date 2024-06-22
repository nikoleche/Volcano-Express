const { Router } = require("express");
const { login, register } = require("../services/userService");
const { generateToken } = require("../services/jwt");
const { isGuest, isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const { parseError } = require("../util");

// This code creates a token and saves it in a cookie
//   const result = await login("test", "test");
//   const token = generateToken(result);

//   res.cookie("token", token);

const userRouter = Router();

userRouter.get("/login", isGuest(), (req, res) => {
  res.render("login");
});

userRouter.post(
  "/login",
  isGuest(),
  body("email").trim(),
  body("password").trim(),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const result = await login(email, password);
      const token = generateToken(result);
      res.cookie("token", token);

      res.redirect("/");
    } catch (error) {
      res.render("login", {
        input: { email },
        errors: parseError(error).errors,
      });
    }
  }
);

userRouter.get("/register", isGuest(), (req, res) => {
  res.render("register");
});

userRouter.post(
  "/register",
  isGuest(),
  body("email").trim().isLength({ min: 10 }).isEmail(),
  body("username").trim().isLength({ min: 2 }),
  body("password").trim().isLength({ min: 4 }),
  body("repeatpw")
    .trim()
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage("Passwords don't match"),
  async (req, res) => {
    const { email, username, password } = req.body;

    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }
      const result = await register(email, username, password);
      const token = generateToken(result);
      res.cookie("token", token);
      res.redirect("/");
    } catch (error) {
      res.render("register", {
        input: { email, username },
        errors: parseError(error).errors,
      });
    }
  }
);

userRouter.get("/logout", isUser(), (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = { userRouter };
