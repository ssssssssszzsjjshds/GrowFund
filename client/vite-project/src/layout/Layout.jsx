import React from "react";
import Nav from "./components/nav/Nav";
import { Outlet } from "react-router";
import Footer from "./components/footer/Footer";

const Layout = () => {
  return (
    <div>
      <Nav />
      <Outlet />
      <Footer />
    </div>
  );
};

export default Layout;
