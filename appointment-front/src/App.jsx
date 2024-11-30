import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Navbar from "./components/Navbar";
import Login from "./pages/public/Login";
import LandingPage from "./pages/LangingPage";
import Register from "./pages/public/Register";
import CustomerDashboard from "./pages/customer/CustomerDashboard";
import ProviderDashboard from "./pages/provider/ProviderDashboard";
import CustomerRoute from "./components/CustomerRoute";
import ProviderRoute from "./components/ProviderRoute";
import ProviderService from "./pages/provider/ProviderService";
import MyBookings from "./pages/customer/MyBookings";
import BookingPage from "./pages/customer/BookingPage";
import ProviderDetails from "./pages/customer/ProviderDetails";

function App() {
	return (
		<Provider store={store}>
			<BrowserRouter>
				<div className='min-h-screen '>
					<Navbar />
					<main className='mx-auto'>
						<Routes>
							<Route path='/' element={<LandingPage />} />
							<Route path='/login' element={<Login />} />
							<Route path='/register' element={<Register />} />
							<Route path="/customer/*" element={<CustomerRoute />}>
    							<Route path="" element={<CustomerDashboard />} />
							    <Route path="bookings" element={<MyBookings />} />
    							<Route path="services/:serviceId/book" element={<BookingPage />} />
    							<Route path="providers/:providerId" element={<ProviderDetails />} />
  							</Route>
							<Route
								path='/provider'
								element={
									<ProviderRoute>
										<ProviderDashboard />
									</ProviderRoute>
								}
							/>
							<Route
								path='/provider/:id'
								element={
									<ProviderRoute>
										<ProviderService />
									</ProviderRoute>
								}
							/>
							<Route path='*' element={<Navigate to='/' />} />
						</Routes>
					</main>
				</div>
			</BrowserRouter>
		</Provider>
	);
}

export default App;
