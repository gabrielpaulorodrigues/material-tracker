import { createContext, useContext, useState, ReactNode } from "react";

interface Material {
  id: number;
  name: string;
  weight: number;
  pricePerKg: number;
}

interface MaterialsContextType {
  materials: Material[];
  addMaterial: (materialName: string) => void;
  updateMaterial: (id: number, weight: number, pricePerKg: number) => void;
}

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const MaterialsProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<Material[]>([]);

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

  return (
    <MaterialsContext.Provider value={{ materials, addMaterial, updateMaterial }}>
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