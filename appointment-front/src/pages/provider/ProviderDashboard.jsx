import { useState } from "react";
import WelcomeSection from "./components/WelcomeSection";
import AddServiceForm from "./components/AddServiceForm";
import ServicesList from "./components/ServicesList";
import KanbanBoard from "./components/KanbanBoard";
import api from "../../utils/axios";

function ProviderDashboard() {
	const [services, setServices] = useState([]);

	const fetchServices = async () => {
		const response = await api.get("/services/my-services");
		setServices(response.data);
	};

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6'>
			<h1 className='text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500'>
				Provider Dashboard
			</h1>

			<div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12'>
				<AddServiceForm fetchServices={fetchServices} />
				<WelcomeSection />
				<ServicesList
					services={services}
					fetchServices={fetchServices}
				/>
			</div>

			<div className='bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700/50 mb-8'>
				<h2 className='text-2xl font-bold mb-8 text-blue-400'>
					Manage Bookings
				</h2>
				<KanbanBoard />
			</div>
		</div>
	);
}

export default ProviderDashboard;
