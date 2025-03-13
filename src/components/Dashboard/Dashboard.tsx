import { DollarSign, Scale, TrendingUp } from "lucide-react";
import { useMaterials } from "../../context/MaterialContext/MaterialContext";

export function Dashboard() {
  const { materials } = useMaterials();

  return (
    <div >
      {materials.map((material) => {
        // Ignora materiais com peso zero
        if (material.weight === 0) return null;

        // Calcula o valor total e o preço médio
        const totalValue = material.weight * material.pricePerKg;
        const averagePrice = material.pricePerKg;

        return (
          <div key={material.id} className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{material.name} </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Card para exibir o estoque total em kg */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Estoque Total em Kg</h3>
                  <Scale className="h-5 w-5 text-blue-600" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">{material.weight.toFixed(2)} kg</p>
              </div>
              
              {/* Card para exibir o total investido */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Total Investido</h3>
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">${totalValue.toFixed(2)}</p>
              </div>
              
              {/* Card para exibir o preço médio */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Preço Médio</h3>
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                </div>
                <p className="mt-2 text-3xl font-semibold text-gray-900">${averagePrice.toFixed(2)}/kg</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}