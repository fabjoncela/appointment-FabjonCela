const express = require('express');
const knex = require('knex')(require('../knexfile').development);
const { authenticate, authorizeProvider } = require('../middlewares/auth');

const router = express.Router();


router.get('/my-appointments', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        // Fetch all appointments for the authenticated user
        const appointments = await knex('appointments')
            .where({ user_id: userId })
            .select('*');

        // Get all service_ids from appointments
        const serviceIds = appointments.map(appointment => appointment.service_id);

        // Fetch the service details for each appointment
        const serviceInfo = await knex('services')
            .whereIn('id', serviceIds)
            .select('id', 'title', 'description');

        // Create a lookup map for services by service_id
        const serviceMap = serviceInfo.reduce((map, service) => {
            map[service.id] = service;
            return map;
        }, {});

        // Add service information to each appointment
        const appointmentsWithService = appointments.map(appointment => {
            const service = serviceMap[appointment.service_id];
            return {
                ...appointment,
                service: service || {}, // Add service details or empty object if no service found
            };
        });

        // Group appointments by status
        const groupedAppointments = appointmentsWithService.reduce((acc, appointment) => {
            acc[appointment.status].push(appointment);
            return acc;
        }, { request: [], confirmed: [], canceled: [] });

        // Respond with the grouped appointments, now including service info
        res.json(groupedAppointments);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch appointments', details: error });
    }
});



router.get('/', authenticate, async (req, res) => {
    try {
        const services = await knex('services').select('*');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services' });
    }
});

 
// GET all services created by the authenticated provider
router.get('/my-services', authenticate, authorizeProvider, async (req, res) => {
    try {
        const providerId = req.user.id; // provider ID from JWT token
        const services = await knex('services').where({ provider_id: providerId }).select('*');
        res.json(services);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch services', error: error });
    }
});
// POST a new service - accessible only to providers
router.post('/', authenticate, authorizeProvider, async (req, res) => {
    try {
        const { title, description } = req.body;
        const providerId = req.user.id; // provider ID from JWT token

        const [serviceId] = await knex('services').insert({ title, description, provider_id: providerId });
        res.status(201).json({ message: 'Service created successfully', serviceId });
    } catch (error) {
        res.status(400).json({ error: 'Failed to create service' });
    }
});


router.get('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const service = await knex('services').where({ id }).first();
        const serviceAppointments = await knex('appointments').where({ service_id: id }).select('*');
        if (service) {
            res.json({ ...service, appointments: serviceAppointments });
        } else {
            res.status(404).json({ error: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch service' });
    }
});

// PUT to update a service - accessible only to providers
router.put('/:id', authenticate, authorizeProvider, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        // Check if service belongs to provider
        const service = await knex('services').where({ id, provider_id: req.user.id }).first();
        if (!service) return res.status(403).json({ error: 'Unauthorized to update this service' });

        await knex('services').where({ id }).update({ title, description });
        res.json({ message: 'Service updated successfully' });
    } catch (error) {
        res.status(400).json({ error: 'Failed to update service' });
    }
});

// DELETE a service - accessible only to providers
router.delete('/:id', authenticate, authorizeProvider, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if service belongs to provider
        const service = await knex('services').where({ id, provider_id: req.user.id }).first();
        if (!service) return res.status(403).json({ error: 'Unauthorized to delete this service' });

        await knex('services').where({ id }).del();
        res.json({ message: 'Service deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete service' });
    }
});



module.exports = router;
