import React, { useState } from 'react';
import AdminUsers from './AdminUsers';
import AdminServices from './AdminServices';
import AdminAppointments from './AdminAppointments';

function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('Users');

    const renderContent = () => {
        switch (activeTab) {
            case 'Users':
                return <AdminUsers />;
            case 'Services':
                return <AdminServices />;
            case 'Appointments':
                return <AdminAppointments />;
            default:
                return null;
        }
    };

    return (
        <div className="flex flex-col items-center">
            {/* Tab Navigation */}
            <div className="flex space-x-4 border-b-2 mb-4">
                <button
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'Users' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('Users')}
                >
                    Users
                </button>
                <button
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'Services' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('Services')}
                >
                    Services
                </button>
                <button
                    className={`py-2 px-4 text-lg font-medium ${activeTab === 'Appointments' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-600'}`}
                    onClick={() => setActiveTab('Appointments')}
                >
                    Appointments
                </button>
            </div>

            {/* Tab Content */}
            <div className="w-full">
                {renderContent()}
            </div>
        </div>
    );
}

export default AdminDashboard;
