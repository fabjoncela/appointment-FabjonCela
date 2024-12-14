//make me admin routes
const express = require("express");
const knex = require("knex")(require("../knexfile").development);
const { authenticate, authorizeAdmin } = require("../middlewares/auth");

const router = express.Router();

router.get("/users", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const users = await knex("users").select("id", "email", "role");
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to get users", details: error });
  }
});
//edit user data
router.put("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { email, role, name } = req.body;

  try {
    await knex("users").where({ id }).update({ email, role, name });
    res.json({ message: "User updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update user", details: error });
  }
});

router.delete("/users/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await knex("users").where({ id }).del();
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete user", details: error });
  }
});

// Get all services
router.get("/services", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const services = await knex("services").select("*");
    res.json(services);
  } catch (error) {
    res.status(500).json({ error: "Failed to get services", details: error });
  }
});

// Update service by id
router.put("/services/:id", authenticate, authorizeAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    await knex("services").where({ id }).update({ title, description });
    res.json({ message: "Service updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to update service", details: error });
  }
});

// Delete service by id
router.delete(
  "/services/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      await knex("services").where({ id }).del();
      res.json({ message: "Service deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete service", details: error });
    }
  }
);

//routes for appointments

router.get("/appointments", authenticate, authorizeAdmin, async (req, res) => {
  try {
    const appointments = await knex("appointments").select("*");
    //return all appointments and provider and user names and serevice names
    const appointmentsWithNames = await Promise.all(
      appointments.map(async (appointment) => {
        const user = await knex("users")
          .where({ id: appointment.user_id })
          .first();
        const provider = await knex("users")
          .where({ id: appointment.provider_id })
          .first();
        const service = await knex("services")
          .where({ id: appointment.service_id })
          .first();

        return {
          ...appointment,
          user: user.name,
          provider: provider.name,
          service: service.title,
        };
      })
    );
    res.json(appointmentsWithNames);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to get appointments", details: error });
  }
});

router.put(
  "/appointments/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
      await knex("appointments").where({ id }).update({ status });
      res.json({ message: "Appointment updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to update appointment", details: error });
    }
  }
);

router.delete(
  "/appointments/:id",
  authenticate,
  authorizeAdmin,
  async (req, res) => {
    const { id } = req.params;

    try {
      await knex("appointments").where({ id }).del();
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ error: "Failed to delete appointment", details: error });
    }
  }
);

module.exports = router;
