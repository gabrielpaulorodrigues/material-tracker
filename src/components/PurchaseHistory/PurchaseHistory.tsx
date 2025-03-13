import { useState } from "react";
import { History, Calendar, Trash2 } from "lucide-react";
import { useMaterials } from "../../context/MaterialContext/MaterialContext";
import { usePurchase } from "../../context/PurchaseContext/PurchaseContext";
import { format } from "date-fns";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";

export function PurchaseHistory() {
  const { materials } = useMaterials();
  const { purchases, removePurchase } = usePurchase();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseToRemove, setPurchaseToRemove] = useState<number | null>(null);

  const filteredPurchases = purchases
    .filter(purchase => {
      const purchaseDate = new Date(purchase.date);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;
      const materialMatch = selectedMaterial ? purchase.materialId === parseInt(selectedMaterial) : true;
      return (!start || purchaseDate >= start) && (!end || purchaseDate <= end) && materialMatch;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordena por data decrescente

  const handleRemovePurchase = (id: number) => {
    setPurchaseToRemove(id);
    setIsModalOpen(true);
  };

  const confirmRemovePurchase = () => {
    if (purchaseToRemove !== null) {
      removePurchase(purchaseToRemove);
      setPurchaseToRemove(null);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setPurchaseToRemove(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      {purchases.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2 mb-4 md:mb-0">
              <History className="text-blue-600" />
              Historico de Compras
            </h2>
            
            <div className="flex flex-col md:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Inicio
                </label>  
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="h-10 pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data Final
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="h-10 pl-10 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="h-10 w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Todos os Materiais</option>
                  {materials.map(material => (
                    <option key={material.id} value={material.id.toString()}>
                      {material.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso (kg)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor/kg</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remover</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPurchases.map((purchase) => {
                  const material = materials.find(m => m.id === purchase.materialId);
                  return (
                    <tr key={purchase.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(purchase.date), "dd/MM/yyyy, HH:mm:ss")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{material?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{purchase.weight.toFixed(2)} (Kg)</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${purchase.pricePerKg.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">${purchase.total.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleRemovePurchase(purchase.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Remove purchase"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmRemovePurchase}
        message="Tem certeza que deseja excluir esta compra?"
      />
    </div>
  );
}