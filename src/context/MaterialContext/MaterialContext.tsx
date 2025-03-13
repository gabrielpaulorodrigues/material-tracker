import { createContext, useContext, useState, ReactNode, useEffect } from "react";

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
  removeMaterial: (id: number) => void;
}

const MaterialsContext = createContext<MaterialsContextType | undefined>(undefined);

export const MaterialsProvider = ({ children }: { children: ReactNode }) => {
  const [materials, setMaterials] = useState<Material[]>([]);

  useEffect(() => {
    const storedMaterials = localStorage.getItem("materials");
    if (storedMaterials) {
      setMaterials(JSON.parse(storedMaterials));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("materials", JSON.stringify(materials));
  }, [materials]);

  const addMaterial = (materialName: string) => {
    if (materials.find(material => material.name === materialName)) return alert("Material já cadastrado");
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

  const removeMaterial = (id: number) => {
    setMaterials(materials.filter(material => material.id !== id));
  };

  return (
    <MaterialsContext.Provider value={{ materials, addMaterial, updateMaterial, removeMaterial }}>
      {children}
    </MaterialsContext.Provider>
  );
};

export const useMaterials = () => {
  const context = useContext(MaterialsContext);
  if (!context) {
    throw new Error("useMaterials must be used within a MaterialsProvider");
  }
  return context;
};