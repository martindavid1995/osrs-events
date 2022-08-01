import Signup from "./Signup"
import { Container } from 'react-bootstrap'
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateProfile from "./UpdateProfile"
import CreateAccount from "./CreateAccount"
import Header from "./Header"

function App() {
	return (
		<Container fluid>
			<AuthProvider><Header /></AuthProvider>
			<Container className="d-flex align-items-top justify-content-center pt-3"
					style={{ minHeight: "100vh" }}>
				<div className="w-100">
						<Router>
							<AuthProvider>
								<Routes>
									<Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
									<Route path="register" element={<Signup />} />
									<Route path="login" element={<Login />} />
									<Route path="forgot-password" element={<ForgotPassword />} />
									<Route path="/update-profile" element={<PrivateRoute><UpdateProfile /></PrivateRoute>}></Route>
									<Route path="/create-account" element={<PrivateRoute><CreateAccount /></PrivateRoute>}></Route>
								</Routes>
							</AuthProvider>
						</Router>
				</div>
			</Container>
		</Container>
		
	)
}

export default App
