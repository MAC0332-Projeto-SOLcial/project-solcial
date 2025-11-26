import { useState, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import PageHeader from "./shared/PageHeader";
import { Sun, Leaf, Zap, PiggyBank, BarChart2 } from "lucide-react";
import jsPDF from "jspdf";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const InfoCard = ({ icon: Icon, iconBg, iconColor, title, children }) => (
  <Card className="shadow-md">
    <div className="flex items-start space-x-4 p-6">
      <div className={`w-14 h-14 ${iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-7 h-7 ${iconColor}`} />
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  </Card>
);

const SolarImpactDashboard = ({ userData, onBack }) => {
  const api = userData.apiResponse;

  const maxPlacas = api.maxPanels;
  const [numPlacas, setNumPlacas] = useState(maxPlacas);
  const [solarData, setSolarData] = useState(null);

  useEffect(() => {
    recalcular(maxPlacas);
  }, []);

  const recalcular = (placas) => {
  const fator = placas / maxPlacas;

  const base = api.solarMetrics;
  const carbonoBase = base.carbonImpactTenYears;

  const carbonoComEscala = carbonoBase.carbonWithPanels.map(v => v * fator);
  const economiaCarbonoEscalada = carbonoBase.carbonSavings.map(v => v * fator);

  setSolarData({
    investimento: base.estimatedInvestment * fator,
    energiaAnual: base.yearlyGeneratedEnergy * fator,
    economiaAnual: base.yearlyFinancialEconomy * fator,
    gastoPainel: base.yearlySpentWithPanels * fator,
    retorno: base.timeForInvestmentRecovery,
    co2Economia: base.yearlyCarbonEconomy * fator,

    economia10anos: base.savedMoneyTenYears.map((v) => v * fator),

    carbono: {
      years: carbonoBase.years,
      carbonWithoutPanels: carbonoBase.carbonWithoutPanels,
      carbonWithPanels: carbonoComEscala,
      carbonSavings: economiaCarbonoEscalada,
    }
  });
};


  if (!solarData) return <div className="p-8">Carregando...</div>;

  const {
    investimento,
    energiaAnual,
    economiaAnual,
    gastoPainel,
    retorno,
    co2Economia,
    economia10anos,
    carbono,
  } = solarData;

  const graficoEconomia = economia10anos.map((v, i) => ({
    ano: i + 1,
    valor: v,
  }));

  const graficoCarbono = carbono.years.map((y, i) => ({
    ano: y,
    sem: carbono.carbonWithoutPanels[i],
    com: carbono.carbonWithPanels[i],
    economia: carbono.carbonSavings[i],
  }));

  const gerarPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("Helvetica", "normal");

    pdf.setFontSize(18);
    pdf.text("Relatório Solar", 10, 15);

    pdf.setFontSize(12);
    pdf.text(`Endereço analisado: ${api.formattedAddress}`, 10, 30);
    pdf.text(`Número de placas escolhido: ${numPlacas}`, 10, 40);

    pdf.text(`Investimento estimado: R$ ${investimento.toFixed(2)}`, 10, 55);
    pdf.text(`Economia anual: R$ ${economiaAnual.toFixed(2)}`, 10, 65);
    pdf.text(`Energia anual gerada: ${energiaAnual.toFixed(2)} kWh`, 10, 75);
    pdf.text(`CO2 economizado/ano: ${co2Economia.toFixed(2)} kg`, 10, 85);
    pdf.text(`Tempo de retorno: ${retorno.toFixed(1)} anos`, 10, 95);

    pdf.text("Economia acumulada (10 anos):", 10, 115);

    economia10anos.forEach((v, i) => {
      pdf.text(`Ano ${i + 1}: R$ ${v.toFixed(2)}`, 10, 125 + i * 7);
    });

    pdf.save("relatorio_solar.pdf");
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader onBack={onBack} />

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Seu Potencial Solar
        </h1>

        <InfoCard
          icon={Sun}
          iconBg="bg-yellow-100"
          iconColor="text-yellow-600"
          title="Sistema Solar Personalizado"
        >
          <p className="text-gray-700">
            Endereço analisado: <strong>{api.formattedAddress}</strong>
          </p>
          <p className="text-gray-700 mt-2">
            Máximo de placas suportado pelo telhado:{" "}
            <span className="font-semibold text-green-600">{maxPlacas}</span>
          </p>
        </InfoCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={PiggyBank}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            title="Economia e Investimento"
          >
            <p className="text-gray-600">Investimento Estimado:</p>
            <p className="text-2xl font-bold text-green-700 mb-3">
              R$ {investimento.toFixed(2)}
            </p>

            <p className="text-gray-600">Economia Anual:</p>
            <p className="text-xl font-semibold text-green-700 mb-3">
              R$ {economiaAnual.toFixed(2)}
            </p>

            <p className="text-gray-600">Retorno estimado:</p>
            <p className="text-lg font-semibold text-gray-800">
              {retorno.toFixed(1)} anos
            </p>
          </InfoCard>

          <InfoCard
            icon={Leaf}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Impacto Ambiental"
          >
            <p className="text-gray-600">Economia de CO₂ anual:</p>
            <p className="text-2xl font-bold text-blue-700 mb-3">
              {co2Economia.toFixed(2)} kg
            </p>

            <p className="text-gray-600">Energia limpa gerada por ano:</p>
            <p className="text-xl font-semibold text-blue-700">
              {energiaAnual.toFixed(1)} kWh
            </p>
          </InfoCard>
        </div>

        <InfoCard
          icon={BarChart2}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          title="Economia Acumulada em 10 anos"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={graficoEconomia}>
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: 20, fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                name="Economia acumulada (R$)"
                stroke="#22c55e"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </InfoCard>

        <InfoCard
          icon={Leaf}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          title="Impacto de Carbono (10 anos)"
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={graficoCarbono}>
              <XAxis dataKey="ano" />
              <YAxis />
              <Tooltip formatter={(value) => value.toFixed(2)} />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: 20, fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="sem"
                name="Sem painéis"
                stroke="#ef4444"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="com"
                name="Com painéis"
                stroke="#22c55e"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </InfoCard>

        <Card className="shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-3">
            Ajustar número de placas
          </h2>

          <p className="text-gray-600 mb-3">
            Máximo permitido: {maxPlacas}
          </p>

          <div className="flex items-center gap-3">
            <input
              type="number"
              min={1}
              max={maxPlacas}
              value={numPlacas}
              onChange={(e) => {
                const novo = Math.min(maxPlacas, Math.max(1, Number(e.target.value)));
                setNumPlacas(novo);
              }}
              className="border p-2 w-24 rounded-md"
            />
            <Button onClick={() => recalcular(numPlacas)}>
              Recalcular
            </Button>
          </div>

          <Button className="mt-6" onClick={gerarPDF}>
            Baixar relatório em PDF
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SolarImpactDashboard;
