import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import api from "../../../utils/axios";
function ServicesList({ services, setServices, fetchServices }) {
	const navigate = useNavigate();

	useEffect(() => {
		fetchServices();
	}, []);
	return (
		<div className='bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all'>
			<h2 className='text-2xl font-bold mb-6 text-blue-400'>
				Your Services
			</h2>
			<div className='space-y-4 max-h-[300px] overflow-y-auto scrollbar-hidden'>
				{services.map((service) => (
					<div
						key={service.id}
						className='p-4 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-600/50 transition-all duration-200 border border-gray-600/50 hover:border-gray-500/50'
						onClick={() => navigate(`/provider/${service.id}`)}
					>
						<h3 className='text-lg font-bold text-gray-100'>
							{service.title}
						</h3>
						<p className='text-sm text-gray-400 mt-2'>
							{service.description.length > 50
								? `${service.description.slice(0, 50)}...`
								: service.description}
						</p>
					</div>
				))}
			</div>
		</div>
	);
}

export default ServicesList;
