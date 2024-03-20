const { Router } = require("express");

const DishesController = require("../controllers/DishesController");

const dishesRoutes = Router();

dishesRoutes.post("/", DishesController.create);
dishesRoutes.delete("/", DishesController.delete);

module.exports = dishesRoutes;