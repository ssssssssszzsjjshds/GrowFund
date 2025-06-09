import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { checkAuth } from "../redux/slices/authSlice";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    dispatch(checkAuth());
    console.log("AppInitializer - Single Init");
  }, []); // Remove dispatch from dependencies

  return children; // Return children instead of null
}