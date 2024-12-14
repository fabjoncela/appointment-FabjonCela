import React, { useState, useEffect } from 'react';

const UserEditModal = ({ user, isOpen, onClose, onSave }) => {
    const [updatedUser, setUpdatedUser] = useState({
        email: '',
        role: '',
        name: ''
    });

    // Populate form fields when user prop changes
    useEffect(() => {
        if (user) {
            setUpdatedUser({
                email: user.email,
                role: user.role,
                name: user.name
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(updatedUser);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-md w-1/3">
                <h3 className="text-xl font-semibold mb-4">Edit User</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={updatedUser.name}
                            onChange={handleChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={updatedUser.email}
                            onChange={handleChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium">Role</label>
                        <select
                            name="role"
                            value={updatedUser.role}
                            onChange={handleChange}
                            className="mt-1 p-2 border rounded w-full"
                            required
                        >
                            <option value="admin">Admin</option>
                            <option value="provider">Provider</option>
                            <option value="customer">Customer</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            className="bg-gray-300 text-black py-2 px-4 rounded"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white py-2 px-4 rounded"
                        >
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserEditModal;
