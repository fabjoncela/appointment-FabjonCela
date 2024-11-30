// db/migrations/[timestamp]_create_all_tables.js

exports.up = function (knex) {
    return knex.schema
        // Create the users table
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('email').unique().notNullable();
            table.string('password').notNullable();
            table.enum('role', ['customer', 'provider']).defaultTo('customer');
            table.timestamps(true, true);
        })
        // Create the services table
        .then(() => {
            return knex.schema.createTable('services', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.text('description');
                table.integer('provider_id').unsigned().references('id').inTable('users');
                table.timestamps(true, true);
            });
        })
        // Create the appointments table
        .then(() => {
            return knex.schema.createTable('appointments', (table) => {
                table.increments('id').primary();
                table.date('date').notNullable();
                table.time('start_time').notNullable();
                table.time('end_time').notNullable();
                table.integer('user_id').unsigned().references('id').inTable('users');
                table.integer('service_id').unsigned().references('id').inTable('services'); 
                table.integer('provider_id').unsigned().references('id').inTable('users');
                table.enum('status', ['request', 'confirmed', 'canceled']).defaultTo('request');
                table.timestamps(true, true);
            });
            
        })
};

exports.down = function (knex) {
    return knex.schema
        // Drop the timeslots column from the appointments table
        .table('appointments', (table) => {
            table.dropColumn('timeslot_id');
        })
        // Drop the appointments table
        .then(() => {
            return knex.schema.dropTableIfExists('appointments');
        })
        // Drop the services table
        .then(() => {
            return knex.schema.dropTableIfExists('services');
        })
        // Drop the users table
        .then(() => {
            return knex.schema.dropTableIfExists('users');
        });
};
