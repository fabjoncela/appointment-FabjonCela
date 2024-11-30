import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../store/authSlice";

const Navbar = () => {
	const { user, token } = useSelector((state) => state.auth);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleLogout = () => {
		dispatch(logout());
		navigate("/");
	};

	return (
		<nav className='bg-gray-800 text-white px-4 py-3'>
			<div className='container mx-auto flex justify-between items-center'>
				<div
					onClick={() => navigate("/")}
					className='text-xl font-bold cursor-pointer'
				>
					Bookings App
				</div>

				{token && user && (
					<div className='flex items-center space-x-4'>
						<span className='text-gray-300'>
							{user.name} ({user.role})
						</span>
						<button
							onClick={handleLogout}
							className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors'
						>
							Logout
						</button>
					</div>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
