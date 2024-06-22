// TODO import routers

const { catalogRouter } = require("../controllers/catalogController");
const { homeRouter } = require("../controllers/homeController");
const { userRouter } = require("../controllers/userController");
const { volcanoRouter } = require("../controllers/volcanoController");

function configRoutes(app) {
  app.use(homeRouter);
  app.use(catalogRouter);
  app.use(userRouter);
  app.use(volcanoRouter);

  app.get("*", (req, res) => {
    res.render("404");
  });
}

module.exports = { configRoutes };
