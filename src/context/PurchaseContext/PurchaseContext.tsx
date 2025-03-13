import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Purchase {
  id: number;
  materialId: number;
  date: string;
  weight: number;
  pricePerKg: number;
  total: number;
}

interface PurchaseContextType {
  purchases: Purchase[];
  addPurchase: (purchase: Purchase) => void;
  removePurchase: (id: number) => void;
}

const PurchaseContext = createContext<PurchaseContextType | undefined>(undefined);

export const PurchaseProvider = ({ children }: { children: ReactNode }) => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);

  useEffect(() => {
    const storedPurchases = localStorage.getItem("purchases");
    if (storedPurchases) {
      setPurchases(JSON.parse(storedPurchases));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("purchases", JSON.stringify(purchases));
  }, [purchases]);

  const addPurchase = (purchase: Purchase) => {
    setPurchases([...purchases, purchase]);
  };

  const removePurchase = (id: number) => {
    setPurchases(purchases.filter(purchase => purchase.id !== id));
  };

  return (
    <PurchaseContext.Provider value={{ purchases, addPurchase, removePurchase }}>
      {children}
    </PurchaseContext.Provider>
  );
};

export const usePurchase = () => {
  const context = useContext(PurchaseContext);
  if (!context) {
    throw new Error("usePurchase must be used within a PurchaseProvider");
  }
  return context;
};