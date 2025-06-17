import React from "react";
import Layout from "./layout/Layout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/slices/authSlice";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return (
    <div>
      <Layout />
    </div>
  );
};

export default App;
