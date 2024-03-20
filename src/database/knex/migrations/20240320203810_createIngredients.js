exports.up = knex => knex.schema.createTable("ingredients", table => {
  table.increments("id").notNullable();
  table.text("name").notNullable();  
  table.integer("id_dish").references("id").inTable("dishes").onDelete("CASCADE");
});

exports.down = knex => knex.schema.dropTable("ingredients");  