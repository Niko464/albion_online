import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResourcePricesPage from "./pages/ressource-price";
import CustomResourcePricesPage from "./pages/CustomRessourcePrices/custom-ressource-prices";
import { CookingRecipesPage } from "./pages/CookingRecipesPage/CookingRecipesPage";
import PriceComparisonPage from "./pages/PriceComparison/PriceComparisonPage";

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
        <Route path="/cooking/recipes" element={<CookingRecipesPage />} />
        <Route path="/price-comparison" element={<PriceComparisonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
