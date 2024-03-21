const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization");

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.get("/:id", DishesController.show);
dishesRoutes.get("/", DishesController.index);
dishesRoutes.post("/", verifyUserAuthorization("admin"), upload.single("image"), DishesController.create);
dishesRoutes.put("/:id", verifyUserAuthorization("admin"), upload.single("image"), DishesController.update);
dishesRoutes.delete("/", verifyUserAuthorization("admin"), DishesController.delete);

module.exports = dishesRoutes;