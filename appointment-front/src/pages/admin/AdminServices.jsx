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
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h1 className="text-3xl text-center font-semibold text-indigo-600 mb-6">Manage Services</h1>

            {/* Edit Form (Visible when editing a service) */}
            {isEditing && (
                <form onSubmit={handleUpdate} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Service Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Update Service
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {/* Services Table */}
            <div className="mt-8 bg-white rounded-lg shadow-md">
                <table className="min-w-full table-auto text-left">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-indigo-700">ID</th>
                            <th className="px-6 py-4 text-sm font-semibold text-indigo-700">Provider Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-indigo-700">Title</th>
                            <th className="px-6 py-4 text-sm font-semibold text-indigo-700">Description</th>
                            <th className="px-6 py-4 text-sm font-semibold text-indigo-700">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((service) => (
                            <tr key={service.id} className="hover:bg-gray-50">
                                <td className="border-t px-6 py-4">{service.id}</td>
                                <td className="border-t px-6 py-4">{providers[service.provider_id] || "Loading..."}</td>
                                <td className="border-t px-6 py-4">{service.title}</td>
                                <td className="border-t px-6 py-4">{service.description}</td>
                                <td className="border-t px-6 py-4 flex space-x-3">
                                    <button
                                        onClick={() => handleEdit(service)}
                                        className="bg-sky-500 text-white px-4 py-2 rounded-3xl hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="bg-red-500 text-white px-4 py-2 rounded-3xl hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );



}

export default AdminServices;
