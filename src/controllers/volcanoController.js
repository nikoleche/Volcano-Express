const { Router } = require("express");
const { isUser } = require("../middlewares/guards");
const { body, validationResult } = require("express-validator");
const {
  create,
  getById,
  update,
  deleteById,
  addVote,
} = require("../services/volcanoService");
const { parseError } = require("../util");

const volcanoRouter = Router();

volcanoRouter.get("/create", isUser(), (req, res) => {
  res.render("create");
});

volcanoRouter.post(
  "/create",
  isUser(),
  body("name").trim().isLength({ min: 2 }),
  body("location").trim().isLength({ min: 3 }),
  body("elevation").trim().isInt({ min: 0 }),
  body("lastEruption").trim().isInt({ min: 0, max: 2024 }),
  body("image").trim().isURL({ require_tld: false, require_protocol: true }),
  body("typeVolcano").trim(),
  body("description").trim().isLength({ min: 10 }),
  async (req, res) => {
    const userId = req.user._id;
    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }
      const entry = await create(req.body, userId);
      res.redirect("/catalog");
    } catch (error) {
      res.render("create", {
        input: req.body,
        errors: parseError(error).errors,
      });
    }
  }
);

volcanoRouter.get("/edit/:id", isUser(), async (req, res) => {
  const id = req.params.id;

  const volcano = await getById(id);

  if (!volcano) {
    res.status(404).render("404");
    return;
  }

  if (volcano.owner.toString() !== req.user._id) {
    res.redirect("/login");
  }
  res.render("edit", { input: volcano });
});

volcanoRouter.post(
  "/edit/:volcanoId",
  isUser(),
  body("name").trim().isLength({ min: 2 }),
  body("location").trim().isLength({ min: 3 }),
  body("elevation").trim().isInt({ min: 0 }),
  body("lastEruption").trim().isInt({ min: 0, max: 2024 }),
  body("image").trim().isURL({ require_tld: false, require_protocol: true }),
  body("typeVolcano").trim(),
  body("description").trim().isLength({ min: 10 }),
  async (req, res) => {
    const volcanoId = req.params.volcanoId;
    const userId = req.user._id;
    try {
      const validation = validationResult(req);

      if (validation.errors.length) {
        throw validation.errors;
      }
      const entry = await update(volcanoId, req.body, userId);
      res.redirect("/catalog/" + volcanoId);
    } catch (error) {
      res.render("edit", {
        input: req.body,
        errors: parseError(error).errors,
      });
    }
  }
);

volcanoRouter.get("/delete/:id", isUser(), async (req, res) => {
  const id = req.params.id;

  try {
    await deleteById(id, req.user._id);
  } catch (error) {
    if (error.message === "Access denied") {
      res.redirect("/login");
      return;
    }
  }
  res.redirect("/catalog");
});

volcanoRouter.get("/vote/:volcanoId", isUser(), async (req, res) => {
  const volcanoId = req.params.volcanoId;
  const userId = req.user._id;

  try {
    const entry = await addVote(volcanoId, userId);
    res.redirect("/catalog/" + volcanoId);
  } catch (error) {
    res.render("details", {
      errors: parseError(error).errors,
    });
  }
});

module.exports = { volcanoRouter };
