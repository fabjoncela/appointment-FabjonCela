const express = require('express');
const knex = require('knex')(require('../knexfile').development);
const { authenticate, authorizeProvider } = require('../middlewares/auth');

const router = express.Router();

router.get('/', authenticate, async (req, res) => {
    try {
        const providers = await knex('users').where({ role: 'provider' }).select('id', 'name', 'email');
        res.json(providers);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch providers' });
    }
});

router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const provider = await knex('users').where({ id, role: 'provider' }).first();
        if (provider) {
            res.json(provider);
        } else {
            res.status(404).json({ error: 'Provider not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch provider' });
    }
});

router.get('/:id/services', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const services = await knex('services').where({ provider_id: id }).select('*');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch provider services' });
    }
});


module.exports = router;
