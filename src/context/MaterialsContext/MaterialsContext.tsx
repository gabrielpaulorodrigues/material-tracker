import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface Material {
  id: number;
  name: string;
  weight: number;
  pricePerKg: number;
}

interface Purchase {
  id: number;
  materialId: number;
  date: string;
  weight: number;
  pricePerKg: number;
  total: number;
}

interface MaterialsContextType {
  materials: Material[];
  purchases: Purchase[];
  addMaterial: (materialName: string) => void;
  updateMaterial: (id: number, weight: number, pricePerKg: number) => void;
  addPurchase: (purchase: Purchase) => void;
  removePurchase: (id: number) => void;
}

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const MaterialsProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<Material[]>([]);
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

  const addMaterial = (materialName: string) => {
    const newMaterial: Material = { id: materials.length + 1, name: materialName, weight: 0, pricePerKg: 0 };
    setMaterials([...materials, newMaterial]);
  };

  const updateMaterial = (id: number, weight: number, pricePerKg: number) => {
    setMaterials(materials.map(material => {
      if (material.id === id) {
        const newWeight = material.weight + weight;
        const newPricePerKg = ((material.weight * material.pricePerKg) + (weight * pricePerKg)) / newWeight;
        return { ...material, weight: newWeight, pricePerKg: newPricePerKg };
      }
      return material;
    }));
  };

  const addPurchase = (purchase: Purchase) => {
    setPurchases([...purchases, purchase]);
  };

  const removePurchase = (id: number) => {
    const purchaseToRemove = purchases.find(purchase => purchase.id === id);
    if (purchaseToRemove) {
      setPurchases(purchases.filter(purchase => purchase.id !== id));
      setMaterials(materials.map(material => {
        if (material.id === purchaseToRemove.materialId) {
          const newWeight = material.weight - purchaseToRemove.weight;
          const newPricePerKg = newWeight > 0 ? ((material.weight * material.pricePerKg) - (purchaseToRemove.weight * purchaseToRemove.pricePerKg)) / newWeight : 0;
          return { ...material, weight: newWeight, pricePerKg: newPricePerKg };
        }
        return material;
      }));
    }
  };

  return (
    <MaterialsContext.Provider value={{ materials, purchases, addMaterial, updateMaterial, addPurchase, removePurchase }}>
      {children}
    </MaterialsContext.Provider>
  );
};

export const useMaterials = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error("Erro no Contexto");
  }
  return context;
};