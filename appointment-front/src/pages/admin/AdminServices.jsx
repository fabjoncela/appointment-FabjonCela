import React, { useState, useEffect } from 'react';
import api from '../../utils/axios';

function AdminServices() {
    const [services, setServices] = useState([]);
    const [providers, setProviders] = useState({});  // Store provider names here
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    // Fetch all services on component mount
    useEffect(() => {
        api.get('/admin/services')
            .then(res => {
                setServices(res.data);

                // Fetch provider names for each service
                const providerIds = res.data.map(service => service.provider_id);
                const uniqueProviderIds = [...new Set(providerIds)]; // Remove duplicates
                uniqueProviderIds.forEach(id => {
                    api.get(`/providers/${id}`).then(providerRes => {
                        setProviders((prevProviders) => ({
                            ...prevProviders,
                            [id]: providerRes.data.name,
                        }));
                    }).catch(err => console.log(err));
                });
            })
            .catch(err => console.log(err));
    }, []);

    // Handle editing of service
    const handleEdit = (service) => {
        setIsEditing(true);
        setEditId(service.id);
        setTitle(service.title);
        setDescription(service.description);
    };

    // Handle updating of service
    const handleUpdate = (e) => {
        e.preventDefault();

        const updatedService = { title, description };

        api.put(`/admin/services/${editId}`, updatedService)
            .then(res => {
                setServices(services.map(service => service.id === editId ? { ...service, ...updatedService } : service));
                resetForm();
            })
            .catch(err => console.log(err));
    };

    // Handle deletion of service
    const handleDelete = (id) => {
        api.delete(`/admin/services/${id}`)
            .then(res => {
                setServices(services.filter(service => service.id !== id));
            })
            .catch(err => console.log(err));
    };

    // Reset form state after edit
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setIsEditing(false);
        setEditId(null);
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-semibold mb-4">Manage Services</h1>

            {/* Edit Form (Visible when editing a service) */}
            {isEditing && (
                <form onSubmit={handleUpdate} className="mb-4">
                    <div className="mb-2">
                        <label className="block text-sm font-semibold">Service Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-semibold">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border rounded px-4 py-2 w-full"
                            required
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                        Update Service
                    </button>
                    <button
                        type="button"
                        onClick={resetForm}
                        className="bg-gray-500 text-white px-4 py-2 rounded ml-2"
                    >
                        Cancel
                    </button>
                </form>
            )}

            {/* Services Table */}
            <table className="min-w-full table-auto">
                <thead>
                    <tr>
                        <th className="border-b px-4 py-2">ID</th>
                        <th className="border-b px-4 py-2">Provider Name</th>
                        <th className="border-b px-4 py-2">Title</th>
                        <th className="border-b px-4 py-2">Description</th>
                        <th className="border-b px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {services.map((service) => (
                        <tr key={service.id}>
                            <td className="border-b px-4 py-2">{service.id}</td>
                            <td className="border-b px-4 py-2">
                                {providers[service.provider_id] || "Loading..."}
                            </td>
                            <td className="border-b px-4 py-2">{service.title}</td>
                            <td className="border-b px-4 py-2">{service.description}</td>
                            <td className="border-b px-4 py-2">
                                <button
                                    onClick={() => handleEdit(service)}
                                    className="text-yellow-500 hover:text-yellow-700 mr-2"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(service.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminServices;
