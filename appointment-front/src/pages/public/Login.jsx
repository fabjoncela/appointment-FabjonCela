import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../../utils/axios";
import { setCredentials } from "../../store/authSlice";

function Login() {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { user, token } = useSelector((state) => state.auth);
	useEffect(() => {
		if (token && user) {
			switch (user?.role) {
				case "admin":
					navigate("/admin");
					break;
				case "customer":
					navigate("/customer");
					break;
				case "provider":
					navigate("/provider");
					break;
				default:
					console.error("Unknown user role:", user.role);
					navigate("/"); // Redirect to a safe fallback route
			}
		}
	}, [user, token, navigate]);

	const onSubmit = async (data) => {
		try {
			const response = await api.post("/users/login", data);
			dispatch(setCredentials(response.data));
		} catch (error) {
			console.error(
				"Login failed:",
				error.response?.data?.message || "An error occurred",
			);
			error.response?.data?.message && alert(error.response.data.message);
		}
	};

	return (
		<div className='auth-container flex items-center justify-center min-h-screen bg-gray-900'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg space-y-6'
			>
				<h2 className='text-2xl font-bold text-center text-gray-100'>
					Login
				</h2>

				<div className='form-group'>
					<input
						type='email'
						placeholder='Email'
						autoComplete='email'
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
						autoComplete='current-password'
						{...register("password", {
							required: "Password is required",

						})}
						className='w-full px-4 py-2 text-gray-100 bg-gray-700 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
					/>
					{errors.password && (
						<div className='mt-1 text-sm text-red-500'>
							{errors.password.message}
						</div>
					)}
				</div>

				<button
					type='submit'
					disabled={isSubmitting}
					className={`w-full py-2 text-lg font-semibold text-gray-100 bg-blue-600 rounded-lg transition duration-300 hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
						}`}
				>
					{isSubmitting ? "Loading..." : "Login"}
				</button>
				<p className='text-center text-gray-400'>
					Don’t have an account?{" "}
					<a
						href='/register'
						className='text-blue-500 hover:underline'
					>
						Register
					</a>
				</p>
			</form>
		</div>
	);
}

export default Login;
