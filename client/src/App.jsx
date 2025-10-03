import { Route, Routes } from "react-router-dom";
import ChatBox from "./pages/ChatBox";
import Connections from "./pages/Connections";
import CreatePost from "./pages/CreatePost";
import Discover from "./pages/Discover";
import Feed from "./pages/Feed";
import Layout from "./pages/Layout";
import Login from "./pages/Login";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

import { useUser } from "@clerk/clerk-react";

const App = () => {
  const { user } = useUser();
  return (
    <>
      <Routes>
        <Route path="/" element={user ? <Layout /> : <Login />}>
          <Route index element={<Feed />} />
          <Route path="messages" element={<Messages />} />
          <Route path="messages/:userId" element={<ChatBox />} />
          <Route path="connections" element={<Connections />} />
          <Route path="discover" element={<Discover />} />
          <Route path="profile" element={<Profile />} />
          <Route path="profile/:profileId" element={<Profile />} />
          <Route path="create-post" element={<CreatePost />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
