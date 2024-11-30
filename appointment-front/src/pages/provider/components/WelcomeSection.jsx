import { useSelector } from "react-redux";

function WelcomeSection() {
	const { user } = useSelector((state) => state.auth);

	return (
		<div className='bg-gray-800/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700/50 hover:border-gray-600/50 transition-all'>
			<div className='text-center flex flex-col items-center justify-center h-full space-y-4'>
				<div className='w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4'>
					<span className='text-2xl font-bold'>{user.name[0]}</span>
				</div>
				<h2 className='text-2xl font-bold text-blue-400'>
					Welcome, {user.name}!
				</h2>
				<p className='text-gray-400'>{user.email}</p>
				<span className='px-4 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm font-medium'>
					{user.role}
				</span>
			</div>
		</div>
	);
}

export default WelcomeSection;
