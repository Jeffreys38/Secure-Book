import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import { useState, useEffect } from "react";
import Login from "./pages/LoginPage.jsx"
import Register from "./pages/RegisterPage.jsx"
import Chat from "./pages/ChatPage.jsx";
import Profile from "./pages/ProfilePage.jsx";
import AnotherProfilePage from "./pages/AnotherProfilePage.jsx";
import PrivateRoute from "./config/PrivateRoute.js";
import { useUserContext } from "./contexts/UserContext.js";
import UserService from "./services/user.service.js";
import Explore from "./pages/Explore.jsx";
import SearchResult from "./pages/SearchResult.jsx"

function App() {
  function RenderProfile() {
    const { userId } = useParams();
    const { user } = useUserContext();
    const [profileComponent, setProfileComponent] = useState(null);

    useEffect(() => {
      if (userId === user._id) {
        setProfileComponent(<Profile />);
      } else {
        UserService.getUser(userId).then((payload) => {
          if (payload.code === 200) {
            setProfileComponent(<AnotherProfilePage />);
          } else {
            window.location.href = "https://google.com.vn";
          }
        });
      }
    }, []);

    return profileComponent;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PrivateRoute />}>
          <Route element={<HomePage />} path="/" />
          <Route element={<Explore />} path="/explore/*" />
          <Route element={<Chat />} path="/chat" />

          <Route element={<SearchResult />} path="/search" />
          
          <Route path="/profile">
            <Route index element={<Profile />} />
            <Route path=":userId" element={<RenderProfile />} />
          </Route>
        
        </Route>

        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
