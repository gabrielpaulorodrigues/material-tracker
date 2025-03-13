import { MaterialsProvider } from "./context/MaterialsContext/MaterialsContext";
import { Form } from "./components/Form/Form";
import { PurchaseHistory } from "./components/PurchaseHistory/PurchaseHistory";
import { Dashboard } from "./components/Dashboard/Dashboard";

function App() {
  return (
    <MaterialsProvider>
      <div className="max-w-4xl mx-auto p-6">
        <Form />
        <Dashboard />
        <PurchaseHistory />
      </div>
    </MaterialsProvider>
  );
}

export default App;