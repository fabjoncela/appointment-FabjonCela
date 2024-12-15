import React, { useEffect, useState } from 'react';
import api from '../../utils/axios';
import UserEditModal from './UserEditModal'; // Import the Modal

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);  // Store selected user
    const [isModalOpen, setIsModalOpen] = useState(false);  // Control edit modal visibility
    const [userToDelete, setUserToDelete] = useState(null);  // Store the user to delete
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Control delete modal visibility

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
                setIsDeleteModalOpen(false); // Close the delete modal after deleting
            })
            .catch(err => console.log(err));
    };

    const handleEdit = (user) => {
        setSelectedUser(user);
        setIsModalOpen(true); // Open the edit modal
    };

    const handleSave = (updatedUser) => {
        api.put(`/admin/users/${selectedUser.id}`, updatedUser)
            .then(res => {
                console.log(res.data.message);
                setUsers(users.map(user => (user.id === selectedUser.id ? { ...user, ...updatedUser } : user)));
                setIsModalOpen(false); // Close the edit modal after saving
            })
            .catch(err => console.log(err));
    };

    const handleCloseEditModal = () => {
        setIsModalOpen(false); // Close the edit modal
    };

    const handleDeleteConfirmation = (user) => {
        setUserToDelete(user);
        setIsDeleteModalOpen(true); // Open the delete modal
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false); // Close the delete modal
    };

    return (
        <div className="container mx-auto p-6 bg-gray-50 rounded-lg shadow-lg">
            <h2 className="text-3xl text-center font-semibold text-indigo-600 mb-8">
                Manage Users
            </h2>

            {/* Users Table */}
            <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                <table className="min-w-full border border-gray-200 rounded-lg">
                    <thead className="bg-indigo-100">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-medium text-indigo-700">
                                ID
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-indigo-700">
                                Email
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-indigo-700">
                                Role
                            </th>
                            <th className="px-6 py-4 text-left text-sm font-medium text-indigo-700">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <tr
                                    key={user.id}
                                    className="hover:bg-indigo-50 transition-colors duration-200"
                                >
                                    <td className="border-t px-6 py-4 text-sm text-gray-600">
                                        {user.id}
                                    </td>
                                    <td className="border-t px-6 py-4 text-sm text-gray-600">
                                        {user.email}
                                    </td>
                                    <td className="border-t px-6 py-4 text-sm text-gray-600">
                                        {user.role}
                                    </td>
                                    <td className="border-t px-6 py-4 flex space-x-3">
                                        <button
                                            className="bg-sky-500 text-white px-4 py-2 rounded-lg hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-sky-400"
                                            onClick={() => handleEdit(user)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                            onClick={() => handleDeleteConfirmation(user)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="border-t px-6 py-4 text-center text-gray-500 text-sm"
                                >
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal for Editing User */}
            <UserEditModal
                user={selectedUser}
                isOpen={isModalOpen}
                onClose={handleCloseEditModal}
                onSave={handleSave}
            />

            {/* Modal for Deleting User */}
            {isDeleteModalOpen && userToDelete && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm">
                        <h2 className="text-xl font-semibold mb-4">Are you sure you want to delete?</h2>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => handleDelete(userToDelete.id)}
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleCloseDeleteModal}
                                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminUsers;
