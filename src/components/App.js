import Signup from "./Signup"
import { Container } from 'react-bootstrap'
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import Dashboard from "./Dashboard"
import Login from "./Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "./ForgotPassword"
import UpdateCredentials from "./UpdateCredentials"
import Header from "./Header"
import UpdateAccountInfo from "./UpdateAccountInfo"
import CreateAccount from "./CreateAccount"
import CreateCommunity from "./communities/CreateCommunity"

function App() {
return (
	<AuthProvider>
		<Router>
			<Container fluid>
				<Header />
					<Container style={{ paddingTop: "3vh"}}>
						<div className="w-100">
							<Routes>
								<Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>}></Route>
								<Route path="register" element={<Signup />} />
								<Route path="login" element={<Login />} />
								<Route path="/create-community" element={<CreateCommunity />} />
								<Route path="forgot-password" element={<ForgotPassword />} />
								<Route path="/update-credentials" element={<PrivateRoute><UpdateCredentials /></PrivateRoute>}></Route>
								<Route path="/update-account-info" element={<PrivateRoute><UpdateAccountInfo /></PrivateRoute>}></Route>
								<Route path="/create-account" element={<PrivateRoute><CreateAccount /></PrivateRoute>}></Route>
							</Routes>
						</div>
					</Container>
			</Container>
		</Router>
	</AuthProvider>
)
}

export default App

//OLD CSS on line 20
//className="d-flex align-items-top justify-content-center" style={{ minHeight: "100vh", paddingTop: "5vh" }}