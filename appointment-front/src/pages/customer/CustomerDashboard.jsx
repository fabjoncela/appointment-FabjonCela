import { useState, useEffect } from 'react';
import api from '../../utils/axios';
import { Link } from 'react-router-dom';

function CustomerDashboard() {
    const [services, setServices] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('/services');
                setServices(response.data);
            } catch (error) {
                console.error('Failed to fetch services:', error.message);
            }
        };

        fetchServices();
    }, []);

    const filteredServices = services.filter((service) =>
        service.title.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-semibold mb-6">Customer Dashboard</h1>

            <input
                type="text"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-4 mb-6 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map((service) => (
                    <div
                        className="service-card bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                        key={service.id}
                    >
                        <h3 className="text-2xl font-medium text-indigo-400 mb-4">{service.title}</h3>
                        <p className="text-gray-400 mb-4">{service.description}</p>

                        <div className="space-x-4">
                            <Link
                                to={`/customer/providers/${service.provider_id}`}
                                className="inline-block px-6 py-2 bg-indigo-500 rounded-lg text-white hover:bg-indigo-400 transition"
                            >
                                View Provider
                            </Link>
                            <Link
                                to={`/customer/services/${service.id}/book`}
                                className="inline-block px-6 py-2 bg-green-500 rounded-lg text-white hover:bg-green-400 transition"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <Link
                to="/customer/bookings"
                className="mt-6 inline-block px-6 py-2 bg-gray-700 rounded-lg text-white hover:bg-gray-600 transition"
            >
                My Bookings
            </Link>
        </div>
    );
}

export default CustomerDashboard;
