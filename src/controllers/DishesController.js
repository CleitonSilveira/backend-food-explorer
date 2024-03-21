const knex = require("knex");
const DiskStorage = require("../providers/DiskStorage");
const AppError = require("../utils/AppError");

class DishesController {
  async create(request, response) {
    const { name, description, price, category, ingredients } = request.body;
    const { filename } = request.file;

    const diskStorage = new DiskStorage();
    const image = await diskStorage.saveFile(filename);

    const [id_dish] = await knex("dishes").insert({name, description, price, category, image});

    const ingredientsInsert = JSON.parse(ingredients).map(ingredient => {
      return {
        id_dish,
        name,
      }
    })
    await knex("ingredients").insert(ingredientsInsert);

    return response.json();
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("dishes").where({ id }).delete()

    return response.json()
  }

  async update(request, response) {
    const { name, description, price, category, ingredients } = request.body;
    const { id } = request.params;
    const { filename } = request.file;

    const dish = await knex("dishes").where({ id }).first();

    if (!dish) {
      throw new AppError("Prato não encontrado")
    }

    const diskStorage = new DiskStorage();

    if (request.file) {
      if (dish.image) {
        await diskStorage.deleteFile(dish.image);
      }
      const image = await diskStorage.saveFile(filename);
      dish.image = image;
    }

    await knex("ingredients").where({ id_dish: id }).delete();

    const ingredientsInsert = JSON.parse(ingredients).map(ingredient => {
      return {
        id_dish,
        name,
      }
    })

    await knex("ingredients").insert(ingredientsInsert);

    dish.name = name ?? dish.name;
    dish.description = description ?? dish.description;
    dish.price = price ?? dish.price;
    dish.category = category ?? dish.category;

    await knex("dishes").where({ id }).update({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category
    })

    return response.json();
  }

  async show(request, response) {
    const { id } = request.params;

    const dish = await knex("dishes").where({ id }).first();
    const ingredients = await knex("ingredients").where({ id_dish }).orderBy("name");
    
    return response.json({
      ...dish,
      ingredients
    })
  }

  async index(request, response) {
    const { name, ingredients } = request.query;

    let dishes;

    if (ingredients) {
      const filterIngredients = ingredients.split(",").map(ingredient => ingredient.trim());

      dishes = await knex("dishes")
      .select([
        "dishes.id",
        "dishes.name",
        "dishes.description",
        "dishes.price",
        "dishes.category",
        "dishes.image",
      ])
      .whereLike("dishes.name", `%${name}%`)
      .whereIn("ingredients.name", filterIngredients)
      .innerJoin("dishes", "dishes.id", "ingredients.id_dish")
      .orderBy("dishes.name")

    } else {
      dishes = await knex("dishes")
      .whereLike("name", `%${name}%`)
      .orderBy("name")
    }

    const allIngredients = await knex("ingredients");
    const dishesWhithIngredients = dishes.map(dish => {
      const dishIngredients = allIngredients.filter(ingredient => ingredient.id_dish === dish.id)
      return{
        ...dishe,
        ingredients: dishIngredients
      }
    })

    return response.json(dishesWhithIngredients);
  }
}

module.exports = DishesController;