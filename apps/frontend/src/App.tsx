import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResourcePricesPage from "./pages/ressource-price";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/prices/:category/:resource" element={<ResourcePricesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
