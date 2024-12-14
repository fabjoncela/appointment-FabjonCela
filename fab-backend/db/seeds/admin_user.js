const bcrypt = require("bcryptjs");

exports.seed = async function (knex) {
  await knex("users").del();
  const hashedPassword = await bcrypt.hash("adminpassword123", 10);
  await knex("users").insert([
    {
      name: "Admin User",
      email: "admin@admin.com",
      password: hashedPassword,
      role: "admin",
    },
  ]);
};
