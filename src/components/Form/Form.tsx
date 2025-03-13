import { useState } from "react";
import { Plus, Scale, DollarSign, Save, Trash2 } from "lucide-react";
import { useMaterials } from "../../context/MaterialContext/MaterialContext";
import { usePurchase } from "../../context/PurchaseContext/PurchaseContext";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

interface Material {
  id: number;
  name: string;
  weight: number;
  pricePerKg: number;
}

export function Form() {
  const { materials, addMaterial, updateMaterial, removeMaterial } = useMaterials();
  const { purchases, addPurchase } = usePurchase();

  // Estado para controlar a exibição do formulário de novo material
  const [showMaterialForm, setShowMaterialForm] = useState(false);
  // Estado para armazenar o nome do novo material a ser adicionado
  const [newMaterialName, setNewMaterialName] = useState("");
  // Estado para armazenar o ID do material selecionado no formulário de compra
  const [selectedMaterial, setSelectedMaterial] = useState("");
  // Estado para armazenar o peso do material no formulário de compra
  const [weight, setWeight] = useState("");
  // Estado para armazenar o preço por kg do material no formulário de compra
  const [pricePerKg, setPricePerKg] = useState("");
  // Estado para controlar a exibição do modal de confirmação
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Estado para armazenar o material a ser removido
  const [materialToRemove, setMaterialToRemove] = useState<Material | null>(null);

  // Função para adicionar um novo material
  const addMaterialHandler = (materialName: string) => {
    addMaterial(materialName);
  };

  // Handler do formulário de novo material
  const handleNewMaterialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addMaterialHandler(newMaterialName);
    setNewMaterialName("");
    setShowMaterialForm(false);
  };

  // Função para lidar com o envio do formulário de compra
  const handlePurchaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const materialId = parseInt(selectedMaterial);
    const purchaseWeight = parseFloat(weight);
    const purchasePricePerKg = parseFloat(pricePerKg);
    const total = purchaseWeight * purchasePricePerKg;
    const newPurchase = {
      id: Date.now(), 
      materialId,
      date: new Date().toISOString(), 
      weight: purchaseWeight,
      pricePerKg: purchasePricePerKg,
      total,
    };
    addPurchase(newPurchase);
    updateMaterial(materialId, purchaseWeight, purchasePricePerKg);
    setSelectedMaterial("");
    setWeight("");
    setPricePerKg("");
  };

  // Função para calcular o peso total e o preço médio de compra de um material
  const calculateMaterialStats = (materialId: number) => {
    const materialPurchases = purchases.filter(purchase => purchase.materialId === materialId);
    const totalWeight = materialPurchases.reduce((sum, purchase) => sum + purchase.weight, 0);
    const totalPrice = materialPurchases.reduce((sum, purchase) => sum + (purchase.weight * purchase.pricePerKg), 0);
    const averagePricePerKg = totalWeight > 0 ? totalPrice / totalWeight : 0;
    return { totalWeight, averagePricePerKg };
  };

  // Função para abrir o modal de confirmação
  const handleRemoveMaterial = (material: Material) => {
    setMaterialToRemove(material);
    setIsModalOpen(true);
  };

  // Função para confirmar a remoção do material
  const confirmRemoveMaterial = () => {
    if (materialToRemove) {
      removeMaterial(materialToRemove.id);
      setMaterialToRemove(null);
      setIsModalOpen(false);
    }
  };

  // Função para fechar o modal de confirmação
  const closeModal = () => {
    setMaterialToRemove(null);
    setIsModalOpen(false);
  };

  const sortedMaterials = [...materials].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        {/* Cabeçalho com botão para adicionar novo material */}
        <div className="flex justify-between items-center mb-5">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Material Tracker</h1>
          <button
            onClick={() => setShowMaterialForm(!showMaterialForm)}
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Cadastrar Novo Material
          </button>
        </div>

        {/* Formulário para adicionar novo material */}
        {showMaterialForm && (
          <form onSubmit={handleNewMaterialSubmit} className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Do Material
                </label>
                <input
                  type="text"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-1.5"
                  placeholder="Digite o Novo Material"
                  required
                />
              </div>
              <button
                type="submit"
                className="self-end bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Adicionar Novo Material
              </button>
            </div>
          </form>
        )}

        {/* Lista de Materiais */}
        <div className="mt-6 mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Materiais Cadastrados</h2>
          <ul>
            {sortedMaterials.map(material => {
              const { } = calculateMaterialStats(material.id);
              return (
                <li key={material.id} className="flex justify-between items-center mb-2">
                  <span>{material.name}</span>
                  <button
                    onClick={() => handleRemoveMaterial(material)}
                    className="text-red-600 hover:text-red-900 transition-colors"
                    title="Remove material"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Formulário para registrar uma compra */}
        <form onSubmit={handlePurchaseSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <select
                value={selectedMaterial}
                onChange={(e) => setSelectedMaterial(e.target.value)}
                className="h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Selecione o Material</option>
                {materials.map((material) => (
                  <option key={material.id} value={material.id.toString()}>
                    {material.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Peso (kg)
              </label>
              <div className="relative">
                <Scale className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="h-10 pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-padding"
                  placeholder="Digite o peso em kg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço por kg
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(e.target.value)}
                  className="h-10 pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 placeholder-padding"
                  placeholder="Digite o preço por kg"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center justify-center gap-2"
            disabled={!selectedMaterial}
          >
            <Save className="h-5 w-5" />
            Adicionar Compra
          </button>
        </form>
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmRemoveMaterial}
        message="Tem certeza que deseja excluir este material?"
      />
    </div>
  );
}