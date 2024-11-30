// routes/user.js
const express = require('express');
const bcrypt = require('bcryptjs');
const knex = require('knex')(require('../knexfile').development);
const generateToken = require('../utils/jwt');
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Register route
router.post('/register', async (req, res) => {
    try { 
        const { name, email, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        await knex.transaction(async (trx) => {
            // Insert the new user
            const [userId] = await trx('users')
                .insert({ name, email, password: hashedPassword, role });

            
            // Generate token
            const token = generateToken({ id: userId, role });

            res.status(201).json({ token, user: { id: userId, name, email, role } });
        });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed', message: error.message });
    }
});

// Login route
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await knex('users').where({ email }).first();

        // Check if user exists and password is correct
        if (user && await bcrypt.compare(password, user.password)) {
            // Generate token with just id and role
            const token = generateToken({ id: user.id, role: user.role });

            // Respond with token and user details
            res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get current user (token verification)
router.get('/me', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch user details from database (excluding password)
        const user = await knex('users')
            .where({ id: userId })
            .select('id', 'name', 'email', 'role')
            .first();

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user details' });
    }
});

//admin secret route login using jwt and env variables for email/pw
router.post('/admin', async (req, res) => {
    const { email, password } = req.body;
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email === adminEmail && password === adminPassword) {
        const token = generateToken({ email: adminEmail, role: 'admin' });
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

module.exports = router;
