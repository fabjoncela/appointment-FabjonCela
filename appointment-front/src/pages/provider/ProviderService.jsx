import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../utils/axios";

function ProviderService() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [service, setService] = useState(null);
	const [isEditing, setIsEditing] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchService();
	}, [id]);

	const fetchService = async () => {
		try {
			const response = await api.get(`/services/${id}`);
			setService(response.data);
			setTitle(response.data.title);
			setDescription(response.data.description);
			setIsLoading(false);
		} catch (error) {
			setError("Failed to fetch service details");
			setIsLoading(false);
			console.error("Failed to fetch service details:", error);
			
		}
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		try {
			await api.put(`/services/${id}`, { title, description });
			setService({ ...service, title, description });
			setIsEditing(false);
			setError("");
		} catch (error) {
			setError(error.response?.data?.error || "Failed to update service");
		}
	};

	const handleDelete = async () => {
		if (window.confirm("Are you sure you want to delete this service?")) {
			try {
				await api.delete(`/services/${id}`);
				navigate("/provider");
			} catch (error) {
				setError(
					error.response?.data?.error || "Failed to delete service",
				);
			}
		}
	};

	if (isLoading) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6'>
				<div className='text-center'>Loading...</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6'>
				<div className='text-red-400 text-center'>{error}</div>
			</div>
		);
	}

	return (
		<div className='min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-100 p-6'>
			<div className='max-w-4xl mx-auto'>
				<div className='bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700/50'>
					{isEditing ? (
						<form onSubmit={handleUpdate} className='space-y-6'>
							<div>
								<label className='block mb-2 text-sm font-medium text-gray-300'>
									Title
								</label>
								<input
									type='text'
									value={title}
									onChange={(e) => setTitle(e.target.value)}
									className='w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									required
								/>
							</div>
							<div>
								<label className='block mb-2 text-sm font-medium text-gray-300'>
									Description
								</label>
								<textarea
									value={description}
									onChange={(e) =>
										setDescription(e.target.value)
									}
									rows='4'
									className='w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
									required
								/>
							</div>
							<div className='flex space-x-4'>
								<button
									type='submit'
									className='px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors'
								>
									Save Changes
								</button>
								<button
									type='button'
									onClick={() => setIsEditing(false)}
									className='px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors'
								>
									Cancel
								</button>
							</div>
						</form>
					) : (
						<>
							<div className='flex justify-between items-center mb-6'>
								<h1 className='text-3xl font-bold text-blue-400'>
									{service.title}
								</h1>
								<div className='space-x-4'>
									<button
										onClick={() => setIsEditing(true)}
										className='px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors'
									>
										Edit
									</button>
									<button
										onClick={handleDelete}
										className='px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors'
									>
										Delete
									</button>
								</div>
							</div>
							<p className='text-gray-300 mb-8'>
								{service.description}
							</p>
						</>
					)}
				</div>

				{/* Bookings Section */}
{/* Bookings Section */}
<div className='mt-8 bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700/50'>
    <h2 className='text-2xl font-bold mb-6 text-blue-400'>
        Bookings
    </h2>
    {service?.appointments && service.appointments.length > 0 ? (
        <div className='space-y-4'>
            {service.appointments.map((appointment) => (
                <div
                    key={appointment.id}
                    className='p-4 bg-gray-700/50 rounded-lg border border-gray-600'
                >
                    <div className='flex justify-between items-center'>
                        <div>
                            <p className='text-sm text-gray-300'>
                                <strong>Date:</strong> {appointment.date}
                            </p>
                            <p className='text-sm text-gray-300'>
                                <strong>Time:</strong> {appointment.start_time} - {appointment.end_time}
                            </p>
                            <p className='text-sm text-gray-300'>
                                <strong>Status:</strong>{" "}
                                <span
                                    className={`${
                                        appointment.status === "confirmed"
                                            ? "text-green-400"
                                            : appointment.status === "canceled"
                                            ? "text-red-400"
                                            : "text-yellow-400"
                                    }`}
                                >
                                    {appointment.status}
                                </span>
                            </p>
                        </div>
                        <div className='text-sm text-gray-400'>
                            <strong>User ID:</strong> {appointment.user_id}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    ) : (
        <p className='text-gray-400'>No bookings available</p>
    )}
</div>

			</div>
		</div>
	);
}

export default ProviderService;
