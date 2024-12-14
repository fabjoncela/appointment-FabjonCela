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
    const [showPopup, setShowPopup] = useState(false); // State for popup visibility

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

        for (let hour = 9; hour < 17; hour++) {
            const startTime = `${hour < 10 ? '0' + hour : hour}:00`;
            const endTime = `${hour + 1 < 10 ? '0' + (hour + 1) : hour + 1}:00`;
            slots.push({ start_time: startTime, end_time: endTime });
        }

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
            const [startTime, endTime] = time.split('-');

            await api.post('/appointments', {
                date,
                start_time: startTime,
                end_time: endTime,
                provider_id: service.provider_id,
                service_id: serviceId
            });

            setShowPopup(true); // Show the popup on successful booking

            setTimeout(() => setShowPopup(false), 3000); // Hide popup after 3 seconds
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
                <div
                    onClick={() => {
                        const input = document.querySelector("#date-input");
                        if (input) input.showPicker?.(); // Trigger the native date picker
                        input?.focus(); // Ensure input is focused as a fallback
                    }}
                    className="w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus-within:ring-2 focus-within:ring-indigo-500 cursor-pointer"
                >
                    <input
                        id="date-input"
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full bg-transparent outline-none pointer-events-none"
                    />
                </div>
            </div>


            <div className="mb-6">
                <label className="block text-lg text-gray-300 mb-2">Select Time:</label>
                <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
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

            {/* Popup for successful booking */}
            {/* Popup for successful booking */}
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm z-50">
                    <div className="relative bg-white text-gray-900 rounded-2xl p-8 shadow-xl w-11/12 max-w-md animate-fade-in">
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                            <div className="w-16 h-16 flex items-center justify-center bg-green-500 rounded-full shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h2 className="text-2xl font-extrabold text-center mt-6 text-gray-800">
                            Booking Successful!
                        </h2>
                        <p className="mt-4 text-center text-gray-600">
                            Your appointment has been successfully booked. We look forward to seeing you!
                        </p>
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={() => setShowPopup(false)}
                                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-full shadow-md hover:bg-green-400 transition duration-300"
                            >
                                Okay
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default BookingPage;
