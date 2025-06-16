import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <>
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
      }}
    />
    <Provider store={store}>
      <App />
    </Provider>
  </>
);
