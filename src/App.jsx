import { Router, RouterProvider } from "react-router-dom";
import router from "../routes";
import { Provider } from "react-redux";
import { store } from "./store";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";
import toastMsgNotif from "../utils/toastMsgNotif";

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
