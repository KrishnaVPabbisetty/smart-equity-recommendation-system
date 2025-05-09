import './App.css'
import AppRoutes from "./routes/AppRoutes";
import { MarketDataProvider } from "./contexts/MarketDataContext";

function App() {
  return (
    <MarketDataProvider>
      <AppRoutes />
    </MarketDataProvider>
  );
}


export default App;
