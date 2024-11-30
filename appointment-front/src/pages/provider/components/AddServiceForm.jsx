import { useState } from "react";
import api from "../../../utils/axios";

function AddServiceForm({ fetchServices }) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsSubmitting(true);
		setError("");

		try {
			await api.post("/services", {
				title,
				description,
			});

			fetchServices();

			// Reset form
			setTitle("");
			setDescription("");
		} catch (error) {
			setError(error.response?.data?.error || "Failed to create service");
			console.log(error, "errori me demek");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className='bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all'>
			<h2 className='text-2xl font-bold mb-6 text-blue-400'>
				Add New Service
			</h2>

			{error && (
				<div className='mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400'>
					{error}
				</div>
			)}

			<form onSubmit={handleSubmit} className='space-y-6'>
				<div>
					<label className='block mb-2 text-sm font-medium text-gray-300'>
						Title
					</label>
					<input
						type='text'
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder='Enter service title'
						className='w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400'
						required
						disabled={isSubmitting}
					/>
				</div>
				<div>
					<label className='block mb-2 text-sm font-medium text-gray-300'>
						Description
					</label>
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder='Enter service description'
						rows='4'
						className='w-full px-4 py-3 bg-gray-700/50 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-400'
						required
						disabled={isSubmitting}
					/>
				</div>
				<button
					type='submit'
					disabled={isSubmitting}
					className={`
            w-full py-3 bg-blue-600 text-gray-100 rounded-lg font-semibold 
            ${
				!isSubmitting &&
				"hover:bg-blue-500 transform hover:scale-[1.02]"
			} 
            transition-all duration-200 
            ${!isSubmitting && "active:scale-[0.98]"}
            ${isSubmitting && "opacity-75 cursor-not-allowed"}
          `}
				>
					{isSubmitting ? (
						<span className='flex items-center justify-center gap-2'>
							<svg
								className='animate-spin h-5 w-5'
								viewBox='0 0 24 24'
							>
								<circle
									className='opacity-25'
									cx='12'
									cy='12'
									r='10'
									stroke='currentColor'
									strokeWidth='4'
									fill='none'
								/>
								<path
									className='opacity-75'
									fill='currentColor'
									d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
								/>
							</svg>
							Creating...
						</span>
					) : (
						"Add Service"
					)}
				</button>
			</form>
		</div>
	);
}

export default AddServiceForm;
