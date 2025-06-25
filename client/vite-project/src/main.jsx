import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import store from "./redux/store";
import router from "./router/router";
import { SocketProvider } from "./SocketContext";
import AppInitializer from "./components/AppInitializer";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <SocketProvider>
        <AppInitializer />
        <RouterProvider router={router} />
      </SocketProvider>
    </Provider>
  </StrictMode>
);
