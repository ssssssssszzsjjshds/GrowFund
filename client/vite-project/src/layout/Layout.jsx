import React, { useEffect } from "react";
import Nav from "./components/nav/Nav";
import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";
import { useSelector } from "react-redux";
import { useSocket } from "../SocketContext";

const Layout = () => {
  const socket = useSocket();
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (socket && currentUser?._id) {
      socket.emit("join", String(currentUser._id));
      socket.emit("getOnlineUsers");
    }
  }, [socket, currentUser?._id]);

  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
