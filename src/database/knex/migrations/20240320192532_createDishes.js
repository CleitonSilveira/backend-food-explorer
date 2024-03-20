exports.up = knex => knex.schema.createTable("dishes", table => {
  table.increments("id").notNullable();
  table.text("name").notNullable();
  table.text("description").notNullable();
  table.double("price", 8, 2).notNullable();
  table.text("category").notNullable();
  table.text("image");
});

exports.down = knex => knex.schema.dropTable("dishes");  