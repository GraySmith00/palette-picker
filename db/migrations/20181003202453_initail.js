exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('projects', function(table) {
      table.increments('id').primary();
      table.string('name');

      table.timestamps(true, true);
    }),

    knex.schema.createTable('palettes', function(table) {
      table.increments('id').primary();
      table.integer('project_id').unsigned();
      table.foreign('paper_id');
      table.string('color0');
      table.string('color1');
      table.string('color2');
      table.string('color3');
      table.string('color4');

      table.timestamps(true, true);
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('projects'),
    knex.schema.dropTable('palettes')
  ]);
};
