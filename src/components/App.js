import Signup from "./accounts/Signup";
import Dashboard from "./accounts/Dashboard";
import Login from "./accounts/Login";
import PrivateRoute from "./PrivateRoute";
import ForgotPassword from "./accounts/ForgotPassword";
import UpdateCredentials from "./accounts/UpdateCredentials";
import Header from "./Header";
import UpdateAccountInfo from "./accounts/UpdateAccountInfo";
import CreateAccount from "./accounts/CreateAccount";
import CreateCommunity from "./communities/CreateCommunity";
import CreateEvent from "./events/CreateEvent";
import CreateBingo from "./events/bingo/CreateBingo";
import ChallengeBingo from "./events/bingo/ChallengeBingo";
import CommunityPage from "./communities/CommunityPage";
import AdminPage from "./communities/admin/AdminPage";

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import { AuthProvider } from "../contexts/AuthContext";
import { UserProvider } from "../contexts/UserContext";
import { CommunityProvider } from "../contexts/CommunityContext";
import { EventProvider } from "../contexts/EventContext";
import { InvitationProvider } from "../contexts/InvitationContext";
import { BingoProvider } from "../contexts/BingoContext";
import CreatePvpTournament from "./events/pvp-tournament/CreatePvpTournament";
import BingoGame from "./events/bingo/BingoGame";
import SpriteSearch from "./search/SpriteSearch";





function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <CommunityProvider>
          <EventProvider>
            <InvitationProvider>
              <BingoProvider>
                <Router>
                  <Container fluid>
                    <Header />
                    <Container style={{ paddingTop: "3vh" }}>
                      <div className="w-100">
                        <Routes>
                          <Route
                            path="/"
                            element={
                              <PrivateRoute>
                                <Dashboard />
                              </PrivateRoute>
                            }
                          ></Route>
                          <Route path="register" element={<Signup />} />
                          <Route path="login" element={<Login />} />
                          <Route
                            path="/create-community"
                            element={<CreateCommunity />}
                          />
                          <Route
                            path="forgot-password"
                            element={<ForgotPassword />}
                          />
                          <Route
                            path="/update-credentials"
                            element={
                              <PrivateRoute>
                                <UpdateCredentials />
                              </PrivateRoute>
                            }
                          ></Route>
                          <Route
                            path="/update-account-info"
                            element={
                              <PrivateRoute>
                                <UpdateAccountInfo />
                              </PrivateRoute>
                            }
                          ></Route>
                          <Route
                            path="/create-account"
                            element={
                              <PrivateRoute>
                                <CreateAccount />
                              </PrivateRoute>
                            }
                          ></Route>
                          <Route
                            path="/community/:communityID"
                            element={<CommunityPage />}
                          ></Route>
                          <Route
                            path="/community/:communityID/admin"
                            element={<AdminPage />}
                          ></Route>
                          <Route
                            path="/community/:communityID/create-event"
                            element={<CreateEvent />}
                          ></Route>
                          <Route
                            path="/community/:communityID/challenge-bingo"
                            element={<ChallengeBingo />}
                          ></Route>
                          <Route
                            path="/community/:communityID/create-pvp-tournament"
                            element={<CreatePvpTournament />}
                          ></Route>
                          <Route
                            path="/events/create/:eventID"
                            element={<CreateBingo />}
                          />
                          <Route
                            path="/events/:bingoID"
                            element={<BingoGame />}
                          />
                          <Route path="/search" element={<SpriteSearch />} />
                        </Routes>
                      </div>
                    </Container>
                  </Container>
                </Router>
              </BingoProvider>
            </InvitationProvider>
          </EventProvider>
        </CommunityProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
