import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { Leaf, Droplet, Car, Zap } from 'lucide-react'

export default function SolarImpactDashboard({ userData, onBack }) {
  const [solarData, setSolarData] = useState(null)
  const [numPlacas, setNumPlacas] = useState(12)

  useEffect(() => {
    const mockData = {
      investimentoEstimado: 25000,
      economiaAnual: 4200,
      retornoInvestimento: 5.9,
      sistemaRecomendado: 12,
      reducaoCO2: 1800,
      economiaAgua: 14000,
      carrosRetirados: 3,
      energiaGerada: 6200,
      graficoMensal: [
        { mes: 'Jan', geracao: 520, consumo: 480 },
        { mes: 'Fev', geracao: 490, consumo: 460 },
        { mes: 'Mar', geracao: 580, consumo: 500 },
        { mes: 'Abr', geracao: 600, consumo: 520 },
        { mes: 'Mai', geracao: 610, consumo: 530 },
        { mes: 'Jun', geracao: 590, consumo: 540 },
      ],
      economiaAcumulada: [
        { ano: 1, valor: 4200 },
        { ano: 5, valor: 21000 },
        { ano: 10, valor: 42000 },
        { ano: 15, valor: 64000 },
        { ano: 20, valor: 87000 },
        { ano: 25, valor: 112000 },
      ],
    }
    setTimeout(() => setSolarData(mockData), 400)
  }, [])

  const handleRecalcular = () => {
    if (!solarData) return

    const fator = numPlacas 

    const recalculado = {
      ...solarData,
      investimentoEstimado: Math.round(25000 * fator),
      economiaAnual: Math.round(4200 * fator),
      retornoInvestimento: (5.9 / fator).toFixed(1),
      reducaoCO2: Math.round(1800 * fator),
      economiaAgua: Math.round(14000 * fator),
      carrosRetirados: Math.round(3 * fator),
      energiaGerada: Math.round(6200 * fator),
      graficoMensal: solarData.graficoMensal.map(item => ({
        ...item,
        geracao: Math.round(item.geracao * fator),
      })),
      economiaAcumulada: solarData.economiaAcumulada.map(item => ({
        ...item,
        valor: Math.round(item.valor * fator),
      })),
    }

    setSolarData(recalculado)
  }

  if (!solarData) {
    return <div className="flex justify-center items-center h-screen">Carregando dados solares...</div>
  }

  const {
    investimentoEstimado,
    economiaAnual,
    retornoInvestimento,
    sistemaRecomendado,
    reducaoCO2,
    economiaAgua,
    carrosRetirados,
    energiaGerada,
    graficoMensal,
    economiaAcumulada
  } = solarData

  return (
    <div className="p-8 space-y-8 bg-gradient-to-br from-green-50 to-yellow-50 min-h-screen">
      <div>
        {userData}
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Seu Potencial Solar</h1>
        <div className="space-x-2">
          <Button variant="outline" onClick={onBack}>Voltar</Button>
          <Button variant="outline">Baixar Relatório</Button>
        </div>
      </div>

      {/* Controle de número de placas */}
      <Card>
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Configurar seu Sistema Solar</h3>
            <p className="text-sm text-gray-500">
              Sistema recomendado: <span className="font-semibold text-green-600">{sistemaRecomendado} placas</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-700">Placas desejadas:</label>
            <input
              type="number"
              min="1"
              max={sistemaRecomendado}
              value={numPlacas}
              onChange={(e) => setNumPlacas(Number(e.target.value))}
              className="w-24 border border-gray-300 rounded-md p-2 text-center"
            />
            <Button onClick={handleRecalcular}>Recalcular</Button>
          </div>
        </div>
      </Card>

      {/* Métricas principais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><div className="text-center p-4"><p className="text-sm text-gray-500">Investimento Estimado</p><p className="text-xl font-bold text-green-700">R$ {investimentoEstimado.toLocaleString()}</p></div></Card>
        <Card><div className="text-center p-4"><p className="text-sm text-gray-500">Economia Anual</p><p className="text-xl font-bold text-blue-700">R$ {economiaAnual.toLocaleString()}</p></div></Card>
        <Card><div className="text-center p-4"><p className="text-sm text-gray-500">Retorno do Investimento</p><p className="text-xl font-bold text-orange-600">{retornoInvestimento} anos</p></div></Card>
        <Card><div className="text-center p-4"><p className="text-sm text-gray-500">Placas Escolhidas</p><p className="text-xl font-bold text-purple-700">{numPlacas}</p></div></Card>
      </div>

      {/* Impacto ambiental */}
      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-700">Sua Contribuição para um Planeta Mais Verde</h2>
        <p className="text-sm text-gray-500">Veja como sua decisão solar transforma o mundo</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card><div className="text-center p-4"><Leaf className="mx-auto text-green-600" size={28} /><p className="font-semibold">{reducaoCO2} kg</p><p className="text-xs text-gray-500">Redução de CO₂ Anual</p></div></Card>
        <Card><div className="text-center p-4"><Droplet className="mx-auto text-blue-600" size={28} /><p className="font-semibold">{economiaAgua} L</p><p className="text-xs text-gray-500">Economia de Água Anual</p></div></Card>
        <Card><div className="text-center p-4"><Car className="mx-auto text-gray-700" size={28} /><p className="font-semibold">{carrosRetirados}</p><p className="text-xs text-gray-500">Carros Retirados das Ruas</p></div></Card>
        <Card><div className="text-center p-4"><Zap className="mx-auto text-yellow-600" size={28} /><p className="font-semibold">{energiaGerada} kWh</p><p className="text-xs text-gray-500">Energia Limpa Gerada</p></div></Card>
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-2">Geração vs Consumo Mensal</h3>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={graficoMensal}>
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="geracao" fill="#22c55e" name="Geração" />
                <Bar dataKey="consumo" fill="#facc15" name="Consumo" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <h3 className="text-sm font-semibold mb-2">Economia Acumulada (25 anos)</h3>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={economiaAcumulada}>
                <XAxis dataKey="ano" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
