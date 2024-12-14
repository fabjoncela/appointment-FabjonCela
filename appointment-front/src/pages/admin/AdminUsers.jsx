import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import UserEditModal from './UserEditModal'; // Import the Modal

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  // Store selected user
    const [isModalOpen, setIsModalOpen] = useState(false);  // Control modal visibility

    // Fetch users from API
    useEffect(() => {
        api.get('/admin/users')
            .then(res => setUsers(res.data))
            .catch(err => console.log(err));
    }, []);

    const handleDelete = (id) => {
        api.delete(`/admin/users/${id}`)
            .then(res => {
                console.log(res.data.message);
                setUsers(users.filter(user => user.id !== id));
            })
            .catch(err => console.log(err));
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true); // Open the modal
    };

    const handleSave = (updatedUser) => {
        api.put(`/admin/users/${selectedUser.id}`, updatedUser)
            .then(res => {
                console.log(res.data.message);
                setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)));
                setIsModalOpen(false); // Close the modal after saving
            })
            .catch(err => console.log(err));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Close the modal
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

            {/* Users Table */}
            <table className="min-w-full table-auto border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                        <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.length > 0 ? (
                        users.map(user => (
                            <tr key={user.id}>
                                <td className="border border-gray-300 px-4 py-2">{user.id}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                                <td className="border border-gray-300 px-4 py-2">{user.role}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <button
                                        className="bg-blue-500 text-white py-1 px-3 rounded mr-2"
                                        onClick={() => handleEdit(user)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className="bg-red-500 text-white py-1 px-3 rounded"
                                        onClick={() => handleDelete(user.id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="border border-gray-300 px-4 py-2 text-center">
                                No users found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* Modal for Editing User */}
            <UserEditModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSave}
            />
        </div>
    );
}

export default AdminUsers;
