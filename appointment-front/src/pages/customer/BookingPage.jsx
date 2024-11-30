import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../utils/axios';

function BookingPage() {
    const { serviceId } = useParams();
    const [service, setService] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [availableSlots, setAvailableSlots] = useState([]);
    const [generatedSlots, setGeneratedSlots] = useState([]);

    useEffect(() => {
        const fetchServiceAndSlots = async () => {
            try {
                const serviceResponse = await api.get(`/services/${serviceId}`);
                setService(serviceResponse.data);

                const providerId = serviceResponse.data.provider_id;

                if (date) {
                    const slotsResponse = await api.get(`/appointments/provider/${providerId}/free-times?date=${date}`);
                    setAvailableSlots(slotsResponse.data);
                    generateAvailableTimeSlots();
                }
            } catch (error) {
                console.error('Failed to fetch service or timeslots:', error.message);
            }
        };

        fetchServiceAndSlots();
    }, [serviceId, date]); 

    const generateAvailableTimeSlots = () => {
        const slots = [];

        // Generate time slots from 9:00 AM to 5:00 PM, in 30-minute increments
        for (let hour = 9; hour < 17; hour++) {
            const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
            const endTime = `${hour < 9 ? '0' + (hour + 1) : hour + 1}:00`;
            slots.push({ start_time: startTime, end_time: endTime });
        }

        // Mark slots as unavailable if they conflict with existing appointments
        const updatedSlots = slots.map((slot) => {
            const isAvailable = !availableSlots.some(
                (appointment) =>
                    (slot.start_time >= appointment.start_time && slot.start_time < appointment.end_time) ||
                    (slot.end_time > appointment.start_time && slot.end_time <= appointment.end_time)
            );
            return { ...slot, is_available: isAvailable };
        });

        setGeneratedSlots(updatedSlots);
    };

    const handleBooking = async () => {
        try {
            const [startTime, endTime] = time.split('-'); // Split the selected time range into start and end times

            // Sending the POST request to book the appointment
            await api.post('/appointments', {
                date,
                start_time: startTime,
                end_time: endTime,
                provider_id: service.provider_id,
                service_id: serviceId
            });
            alert('Booking successful!');
        } catch (error) {
            alert('Failed to book service.');
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <Link
                to={`/customer`}
                className="mb-6 text-indigo-400 underline hover:text-indigo-500 transition"
            >
                Go Back
            </Link>
            {service && (
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold text-indigo-400 mb-4">
                        Book {service.title}
                    </h1>
                    <p className="text-lg text-gray-400">{service.description}</p>
                </div>
            )}
            
            <div className="mb-6">
                <label className="block text-lg text-gray-300 mb-2">Select Date:</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)} // Update date state
                    className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            
            <div className="mb-6">
                <label className="block text-lg text-gray-300 mb-2">Select Time:</label>
                <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)} // Update time state
                    className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="">Select Time</option>
                    {generatedSlots.map((slot, index) => (
                        <option key={index} value={`${slot.start_time}-${slot.end_time}`} className={`${!slot.is_available ? 'text-gray-400' : ''}`}>
                            {slot.start_time} - {slot.end_time}
                        </option>
                    ))}
                </select>
            </div>
            
            <button
                onClick={handleBooking}
                className="w-full py-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-400 transition"
            >
                Confirm Booking
            </button>
        </div>
    );
}

export default BookingPage;
