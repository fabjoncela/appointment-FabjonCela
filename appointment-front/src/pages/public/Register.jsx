import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import { setCredentials } from "../../store/authSlice";

function Register() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm({
		defaultValues: {
			role: "customer",
		},
	});

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, token } = useSelector((state) => state.auth);

	useEffect(() => {
		if (token && user) {
			const path = user.role === "customer" ? "/customer" : "/provider";
			navigate(path);
		}
	}, [user, token, navigate]);

	const onSubmit = async (data) => {
		try {
			const response = await api.post("/users/register", data);
			dispatch(setCredentials(response.data));
		} catch (error) {
			console.error(
				"Registration failed:",
				error.response?.data?.message || "An error occurred",
			);
		}
	};

	return (
		<div className='auth-container flex items-center justify-center min-h-screen bg-gray-900'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg space-y-6'
			>
				<h2 className='text-2xl font-bold text-center text-gray-100'>
					Register
				</h2>

				<div className='form-group'>
					<input
						type='text'
						placeholder='Name'
						{...register("name", {
							required: "Name is required",
							minLength: {
								value: 2,
								message: "Name must be at least 2 characters",
							},
						})}
						className='w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					{errors.name && (
						<div className='mt-1 text-sm text-red-500'>
							{errors.name.message}
						</div>
					)}
				</div>

				<div className='form-group'>
					<input
						type='email'
						placeholder='Email'
						{...register("email", {
							required: "Email is required",
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
								message: "Invalid email address",
							},
						})}
						className='w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					{errors.email && (
						<div className='mt-1 text-sm text-red-500'>
							{errors.email.message}
						</div>
					)}
				</div>

				<div className='form-group'>
					<input
						type='password'
						placeholder='Password'
						{...register("password", {
							required: "Password is required",
							minLength: {
								value: 6,
								message:
									"Password must be at least 6 characters",
							},
						})}
						className='w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					{errors.password && (
						<div className='mt-1 text-sm text-red-500'>
							{errors.password.message}
						</div>
					)}
				</div>

				<div className='form-group'>
					<select
						{...register("role")}
						className='w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
					>
						<option value='customer'>Register as Customer</option>
						<option value='provider'>Register as Provider</option>
					</select>
				</div>

				<button
					type='submit'
					disabled={isSubmitting}
					className='w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
				>
					{isSubmitting ? "Registering..." : "Register"}
				</button>
			</form>
		</div>
	);
}

export default Register;
