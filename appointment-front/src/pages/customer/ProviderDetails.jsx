import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../utils/axios';

function ProviderDetails() {
    const { providerId } = useParams();
    const [services, setServices] = useState([]);
    const [provider, setProvider] = useState(null);

    useEffect(() => {
        const fetchProviderAndServices = async () => {
            try {
                const providerResponse = await api.get(`/providers/${providerId}`);
                setProvider(providerResponse.data);

                const servicesResponse = await api.get(`/providers/${providerId}/services`);
                setServices(servicesResponse.data);
            } catch (error) {
                console.error('Failed to fetch provider data:', error.message);
            }
        };

        fetchProviderAndServices();
    }, [providerId]);

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
             <Link
                to={`/customer`}
                className="mb-6 text-indigo-400 underline hover:text-indigo-500 transition"
            >
                Go Back
            </Link>
            {provider && (
                <div className="mb-8">
                    <h1 className="text-4xl font-semibold text-indigo-400 mb-4">
                        {provider.name}
                    </h1>
                    <p className="text-lg text-gray-400 mb-4">Email: {provider.email}</p>
                    <h2 className="text-2xl text-gray-300">Services Offered</h2>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service) => (
                    <div
                        key={service.id}
                        className="service-card bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300"
                    >
                        <h3 className="text-xl font-medium text-indigo-400 mb-4">{service.title}</h3>
                        <p className="text-gray-400">{service.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProviderDetails;
