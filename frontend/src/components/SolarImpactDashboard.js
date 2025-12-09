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
  const api = userData?.apiResponse || {};
  const initialSolarMetrics = api.solarMetrics || {};

  const maxPlacas = typeof api.maxPanels === "number" ? api.maxPanels : (initialSolarMetrics.recommendedPanels || 1);

  const [numPlacas, setNumPlacas] = useState(1);

  const [solarData, setSolarData] = useState(() => {
    const sm = initialSolarMetrics;
    const impact = {
        years: sm.carbonImpactTenYears?.years || [],
        carbonWithoutPanels: sm.carbonImpactTenYears?.carbonWithoutPanels || [],
        carbonWithPanels: sm.carbonImpactTenYears?.carbonWithPanels || [],
        carbonSavings: sm.carbonImpactTenYears?.carbonSavings || [],
        carbonSavingsNegative: sm.carbonImpactTenYears?.carbonSavingsNegative || [],
      };
    return {
      investimento: sm.estimatedInvestment,
      energiaAnual: sm.yearlyGeneratedEnergy,
      economiaAnual: sm.yearlyFinancialEconomy,
      gastoPainel: sm.yearlySpentWithPanels,
      retorno: sm.timeForInvestmentRecovery,
      co2Economia: sm.yearlyCarbonEconomy,
      economia10anos: Array.isArray(sm.savedMoneyTenYears) ? sm.savedMoneyTenYears : [],
      carbono: {
        years: impact.years,
        carbonWithoutPanels: impact.carbonWithoutPanels,
        carbonWithPanels: impact.carbonWithPanels,
        carbonSavings: impact.carbonSavings,
        carbonSavingsNegative: impact.carbonSavingsNegative,
      },
    };
  });

  const [loading, setLoading] = useState(false);

  const recalcular = async (placas) => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        address: userData?.address || api.formattedAddress || "",
        energyConsumptionKwh: JSON.stringify([
          userData?.kwhConsumption1,
          userData?.kwhConsumption2,
          userData?.kwhConsumption3,
        ]),
        spentMoney: JSON.stringify([
          userData?.monthlyBill1,
          userData?.monthlyBill2,
          userData?.monthlyBill3,
        ]),
        numPanels: String(placas),
      });

      const baseUrl = process.env.REACT_APP_API_URL || "http://localhost:3001";
      const url = `${baseUrl}/solar-metrics?${params.toString()}`;

      const resp = await fetch(url);
      if (!resp.ok) {
        let errorMessage = 'Erro ao recalcular. Por favor, tente novamente.';
        try {
          const errBody = await resp.json();
          // Mensagens amigáveis para o usuário
          if (resp.status === 400) {
            errorMessage = 'Não foi possível recalcular. Verifique os dados e tente novamente.';
          } else if (resp.status === 404) {
            errorMessage = 'Serviço não encontrado. Tente novamente mais tarde.';
          } else if (resp.status >= 500) {
            errorMessage = 'Erro no servidor. Por favor, tente novamente em alguns instantes.';
          } else {
            errorMessage = errBody.error || errorMessage;
          }
        } catch (e) {
          if (resp.status === 400) {
            errorMessage = 'Erro ao processar os dados. Tente novamente.';
          } else {
            errorMessage = `Erro ${resp.status}: ${resp.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const json = await resp.json();

      const sm = json.solarMetrics || {};
      const impact = {
        years: sm.carbonImpactTenYears?.years,
        carbonWithoutPanels: sm.carbonImpactTenYears?.carbonWithoutPanels,
        carbonWithPanels: sm.carbonImpactTenYears?.carbonWithPanels,
        carbonSavings: sm.carbonImpactTenYears?.carbonSavings,
        carbonSavingsNegative: sm.carbonImpactTenYears?.carbonSavingsNegative,
      };
      const novoSolarData = {
        investimento: sm.estimatedInvestment,
        energiaAnual: sm.yearlyGeneratedEnergy,
        economiaAnual: sm.yearlyFinancialEconomy,
        gastoPainel: sm.yearlySpentWithPanels,
        retorno: sm.timeForInvestmentRecovery,
        co2Economia: sm.yearlyCarbonEconomy,
        economia10anos: Array.isArray(sm.savedMoneyTenYears) ? sm.savedMoneyTenYears : [],
        carbono: {
          years: impact.years,
          carbonWithoutPanels: impact.carbonWithoutPanels,
          carbonWithPanels: impact.carbonWithPanels,
          carbonSavings: impact.carbonSavings,
          carbonSavingsNegative: impact.carbonSavingsNegative,
        },
      };

      setSolarData(novoSolarData);

      if (typeof json.maxPanels === "number") {
        if (numPlacas > json.maxPanels) setNumPlacas(json.maxPanels);
      }
    } catch (error) {
      console.error("Erro ao recalcular:", error);
      alert(error.message || 'Erro ao recalcular. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };


  if (!solarData && !loading) return <div className="p-8">Carregando...</div>;

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
    economiaNegativa: carbono.carbonSavingsNegative[i],
  }));

  const gerarPDF = () => {
    const pdf = new jsPDF();
    pdf.setFont("Helvetica", "normal");

    pdf.setFontSize(18);
    pdf.text("Relatório Solar", 10, 15);

    pdf.setFontSize(12);
    pdf.text(`Endereço analisado: ${api.formattedAddress}`, 10, 30);
    pdf.text(`Número de placas escolhido: ${numPlacas}`, 10, 40);

    pdf.text(`Investimento estimado: R$ ${investimento?.toFixed(2)}`, 10, 55);
    pdf.text(`Economia anual: R$ ${economiaAnual?.toFixed(2)}`, 10, 65);
    pdf.text(`Energia anual gerada: ${energiaAnual?.toFixed(2)} kWh`, 10, 75);
    pdf.text(`CO2 economizado/ano: ${co2Economia?.toFixed(2)} kg`, 10, 85);
    pdf.text(`Tempo de retorno: ${retorno?.toFixed(1)} anos`, 10, 95);

    pdf.text("Economia acumulada (10 anos):", 10, 115);

    economia10anos.forEach((v, i) => {
      pdf.text(`Ano ${i + 1}: R$ ${v?.toFixed(2)}`, 10, 125 + i * 7);
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
              R$ {investimento?.toFixed(2)}
            </p>

            <p className="text-gray-600">Economia Anual:</p>
            <p className="text-xl font-semibold text-green-700 mb-3">
              R$ {economiaAnual?.toFixed(2)}
            </p>

            <p className="text-gray-600">Retorno estimado:</p>
            <p className="text-lg font-semibold text-gray-800">
              {retorno?.toFixed(1)} anos
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
              {co2Economia?.toFixed(2)} kg
            </p>

            <p className="text-gray-600">Energia limpa gerada por ano:</p>
            <p className="text-xl font-semibold text-blue-700">
              {energiaAnual?.toFixed(1)} kWh
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
              <Tooltip formatter={(value) => value?.toFixed(2)} />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: 20, fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                name="Economia acumulada (R$)"
                stroke="#ca7111ff"
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
              <Tooltip formatter={(value) => value?.toFixed(2)} />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: 20, fontSize: 14 }}
              />
              <Line
                type="monotone"
                dataKey="economiaNegativa"
                name="Decaimento da emissão de carbono (kg)"
                stroke="#05c887ff"
                strokeWidth={3}
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
