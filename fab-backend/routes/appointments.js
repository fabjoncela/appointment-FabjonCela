const express = require('express');
const knex = require('knex')(require('../knexfile').development);
const { authenticate } = require('../middlewares/auth');

const router = express.Router();

// Create a new appointment
router.post('/', authenticate, async (req, res) => {
    try {
        const { date, start_time, end_time, provider_id, service_id } = req.body;
        const user_id = req.user.id;

        // Check if the provider is available for the given timeslot
        const overlappingAppointments = await knex('appointments')
            .where({ provider_id, date })
            .andWhere(function () {
                this.whereBetween('start_time', [start_time, end_time])
                    .orWhereBetween('end_time', [start_time, end_time]);
            })
            .andWhere('status', 'confirmed');

        if (overlappingAppointments.length) {
            return res.status(400).json({ error: 'Provider is not available during this time.' });
        }

        // Create the appointment with 'request' status
        const [appointmentId] = await knex('appointments').insert({
            date,
            start_time,
            end_time,
            user_id,
            service_id,
            provider_id,
            status: 'request'
        });

        res.status(201).json({ message: 'Appointment requested successfully.', appointmentId });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create appointment', details: error });
    }
});

// Update the status of an appointment (confirm or cancel)
router.patch('/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'confirmed' or 'canceled'

        if (!['confirmed', 'canceled'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status.' });
        }

        const appointment = await knex('appointments').where({ id }).first();
        if (!appointment) {
            return res.status(404).json({ error: 'Appointment not found.' });
        }

        // Only the provider can confirm/cancel the appointment
        if (appointment.provider_id !== req.user.id) {
            return res.status(403).json({ error: 'Unauthorized to update this appointment.' });
        }

        await knex('appointments').where({ id }).update({ status });

        res.status(200).json({ message: `Appointment ${status} successfully.` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update appointment', details: error });
    }
});
// Get all appointments for a provider, including service info and grouped by status
router.get('/provider/:providerId', authenticate, async (req, res) => {
    try {
        const { providerId } = req.params;  // Get the providerId from the route params

        // Fetch all appointments for the specified provider
        const appointments = await knex('appointments')
            .where({ provider_id: providerId })  // Use provider_id in the where condition
            .select('*');

        // Get all service_ids from appointments
        const serviceIds = appointments.map(appointment => appointment.service_id);

        // Fetch the service details for each appointment
        const serviceInfo = await knex('services')
            .whereIn('id', serviceIds)
            .select('id', 'title', 'description');

        const customerInfo = await knex('users').whereIn('id', appointments.map(appointment => appointment.user_id)).select('id', 'name', 'email');

        const customerMap = customerInfo.reduce((map, customer) => {
            map[customer.id] = customer;
            return map;
        }, {});

        // Create a lookup map for services by service_id
        const serviceMap = serviceInfo.reduce((map, service) => {
            map[service.id] = service;
            return map;
        }, {});

        // Add service information to each appointment
        const appointmentsWithService = appointments.map(appointment => {
            const service = serviceMap[appointment.service_id];
            const customer = customerMap[appointment.user_id];
            return {
                ...appointment,
                service: service || {}, // Add service details or empty object if no service found
                customer: customer || {}
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



// Get free times for a provider on a specific date
router.get('/provider/:providerId/free-times', authenticate, async (req, res) => {
    try {
        const { providerId } = req.params;
        const { date } = req.query;

        if (!date) {
            return res.status(400).json({ error: 'Date is required.' });
        }

        // Fetch all confirmed appointments for the provider on the given date
        const appointments = await knex('appointments')
            .where({ provider_id: providerId, date, status: 'confirmed' })
            .select('start_time', 'end_time');

        // Define the provider's working hours (e.g., 9 AM to 5 PM)
        const workingHours = { start: '09:00:00', end: '17:00:00' };

        // Calculate free times
        const freeTimes = [];
        let lastEndTime = workingHours.start;

        for (const appointment of appointments.sort((a, b) => a.start_time.localeCompare(b.start_time))) {
            if (lastEndTime < appointment.start_time) {
                freeTimes.push({ start_time: lastEndTime, end_time: appointment.start_time });
            }
            lastEndTime = appointment.end_time > lastEndTime ? appointment.end_time : lastEndTime;
        }

        if (lastEndTime < workingHours.end) {
            freeTimes.push({ start_time: lastEndTime, end_time: workingHours.end });
        }

        res.json(freeTimes);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch free times', details: error });
    }
});

module.exports = router;
