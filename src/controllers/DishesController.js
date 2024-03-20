class DishesController {
  async create(request, response) {
  }

  async delete(request, response) {
    const { id } = request.params

    await knex("dishes").where({ id }).delete()

    return response.json()
  }
}

module.exports = DishesController;