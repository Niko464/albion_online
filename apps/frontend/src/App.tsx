import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResourcePricesPage from "./pages/ressource-price";
import CustomResourcePricesPage from "./pages/CustomRessourcePrices/custom-ressource-prices";
import { RecipeRecipesPage } from "./pages/RecipesPage/RecipePage";
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
        <Route path="/recipes/:craftingCategory" element={<RecipeRecipesPage />} />
        <Route path="/price-comparison" element={<PriceComparisonPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
