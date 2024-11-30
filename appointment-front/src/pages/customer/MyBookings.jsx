import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';

function MyBookings() {
    const [appointments, setAppointments] = useState({ request: [], confirmed: [], canceled: [] });

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await api.get('/services/my-appointments');
                setAppointments(response.data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error.message);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
             <Link
                to={`/customer`}
                className="mb-6 text-indigo-400 underline hover:text-indigo-500 transition"
            >
                Go Back
            </Link>
            <h1 className="text-4xl font-semibold text-indigo-400 mb-6">My Bookings</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="status-column bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-300 mb-4">Requested</h2>
                    {appointments.request?.length === 0 ? (
                        <p className="text-gray-400">No requested appointments</p>
                    ) : (
                        appointments?.request?.map((appointment) => (
                            <div key={appointment.id} className="appointment-card mb-4 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-xl font-medium text-indigo-400 mb-2">{appointment.service.title}</h3>
                                <p className="text-gray-400">Date: {appointment.date}</p>
                                <p className="text-gray-400">Time: {appointment.start_time} - {appointment.end_time}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="status-column bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-300 mb-4">Confirmed</h2>
                    {appointments.confirmed.length === 0 ? (
                        <p className="text-gray-400">No confirmed appointments</p>
                    ) : (
                        appointments.confirmed.map((appointment) => (
                            <div key={appointment.id} className="appointment-card mb-4 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-xl font-medium text-indigo-400 mb-2">{appointment.service.title}</h3>
                                <p className="text-gray-400">Date: {appointment.date}</p>
                                <p className="text-gray-400">Time: {appointment.start_time} - {appointment.end_time}</p>
                            </div>
                        ))
                    )}
                </div>

                <div className="status-column bg-gray-800 p-4 rounded-lg shadow-lg">
                    <h2 className="text-2xl font-semibold text-gray-300 mb-4">Canceled</h2>
                    {appointments.canceled.length === 0 ? (
                        <p className="text-gray-400">No canceled appointments</p>
                    ) : (
                        appointments.canceled.map((appointment) => (
                            <div key={appointment.id} className="appointment-card mb-4 p-4 bg-gray-700 rounded-lg">
                                <h3 className="text-xl font-medium text-indigo-400 mb-2">{appointment.service.title}</h3>
                                <p className="text-gray-400">Date: {appointment.date}</p>
                                <p className="text-gray-400">Time: {appointment.start_time} - {appointment.end_time}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyBookings;
