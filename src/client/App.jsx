import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage.jsx";
import MainPage from "./pages/MainPage.jsx";

export default function App() {

  return (
    <BrowserRouter>

      <Routes>
        <Route path="/"
          element={<LoginPage />} />

        <Route path="/main"
          element={<MainPage />} />
      </Routes>
      
    </BrowserRouter>
  );
}