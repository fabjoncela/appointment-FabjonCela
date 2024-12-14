// server.js
const express = require("express");
const dotenv = require("dotenv");
const userRoutes = require("./routes/user");
const serviceRoutes = require("./routes/service");
const appointments = require("./routes/appointments");
const providers = require("./routes/providers");
const admin = require("./routes/admin");

const cors = require("cors");

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/services", serviceRoutes); // Service CRUD routes
app.use("/api/appointments", appointments); // Appointment CRUD routes
app.use("/api/providers", providers); // Provider routes
app.use("/api/admin", admin); // Admin routes

// Simple route to check if the server is working
app.get("/", (req, res) => {
  res.send("Appointment Booking System API");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
