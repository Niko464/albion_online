import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResourcePricesPage from "./pages/ressource-price";
import CustomResourcePricesPage from "./pages/CustomRessourcePrices/custom-ressource-prices";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/prices/:category/:resource"
          element={<ResourcePricesPage />}
        />
        <Route
          path="/custom-prices/:category/:resource"
          element={<CustomResourcePricesPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
