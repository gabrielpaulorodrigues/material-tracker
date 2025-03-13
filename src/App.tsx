import { MaterialsProvider } from "./context/MaterialContext/MaterialContext";
import { Form } from "./components/Form/Form";
import { PurchaseHistory } from "./components/PurchaseHistory/PurchaseHistory";
import { Dashboard } from "./components/Dashboard/Dashboard";
import { PurchaseProvider } from "./context/PurchaseContext/PurchaseContext";

function App() {
  return (
    <MaterialsProvider>
      <PurchaseProvider>
        <div className="max-w-4xl mx-auto p-6">
          <Form />
          <Dashboard />
          <PurchaseHistory />
        </div>
      </PurchaseProvider>
    </MaterialsProvider>
  );
}

export default App;