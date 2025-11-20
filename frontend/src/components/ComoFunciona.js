import { MapPin, Zap, BarChart3, Leaf, FileText } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import PageHeader from "./shared/PageHeader";

// Componente reutilizável para cards de passo
const StepCard = ({ stepNumber, stepColor, icon: Icon, stepTitle, title, description, children }) => {
  const colorClasses = {
    green: {
      bg: "bg-green-600",
      text: "text-white"
    },
    orange: {
      bg: "bg-orange-500",
      text: "text-white"
    },
    blue: {
      bg: "bg-blue-600",
      text: "text-white"
    }
  };

  const colors = colorClasses[stepColor] || colorClasses.green;

  return (
    <Card className="shadow-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Seção esquerda colorida */}
        <div className={`${colors.bg} ${colors.text} p-8 md:p-12 flex flex-col items-center justify-center md:w-64 flex-shrink-0`}>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-4">
            <span className="text-4xl font-bold">{stepNumber}</span>
          </div>
          <Icon className="w-8 h-8 mb-3" />
          <p className="text-lg font-semibold text-center">{stepTitle}</p>
        </div>

        {/* Seção direita branca */}
        <div className="flex-1 p-6 md:p-8 bg-white">
          <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
          <p className="text-base text-gray-700 leading-relaxed mb-4">{description}</p>
          {children}
        </div>
      </div>
    </Card>
  );
};

// Componente reutilizável para cards de resultado
const ResultCard = ({ icon: Icon, iconBg, iconColor, title }) => (
  <div className={`${iconBg} rounded-lg p-4 flex flex-col items-center text-center`}>
    <Icon className={`w-8 h-8 ${iconColor} mb-2`} />
    <p className="text-sm font-semibold text-gray-900">{title}</p>
  </div>
);

const ComoFunciona = ({ onBack, onGetStarted }) => {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader onBack={onBack} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Título e Descrição */}
        <div className="text-center mb-12">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Desvende o Potencial do Sol em 3 Passos Simples
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            O SOLcial foi desenhado para ser intuitivo e rápido. Em poucos minutos, você transforma a curiosidade em conhecimento e descobre como a energia solar pode revolucionar sua casa e seu bolso.
          </p>
        </div>

        {/* Cards de Passos */}
        <div className="space-y-6 mb-8">
          {/* Passo 1 */}
          <StepCard
            stepNumber={1}
            stepColor="green"
            icon={MapPin}
            stepTitle="Onde você está?"
            title="Informe seu endereço:"
            description="Comece nos dizendo onde fica o imóvel que você gostaria de analisar."
          >
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
              <p className="text-sm font-semibold text-gray-900 mb-2">
                Sua privacidade é nossa prioridade:
              </p>
              <p className="text-sm text-gray-700">
                O endereço informado não é salvo em nossos sistemas. Utilizamos apenas para realizar a análise de potencial solar do local.
              </p>
            </div>
          </StepCard>

          {/* Passo 2 */}
          <StepCard
            stepNumber={2}
            stepColor="orange"
            icon={Zap}
            stepTitle="Qual o seu consumo de energia?"
            title="Conte-nos sobre sua conta de luz:"
            description="Para que a nossa análise seja personalizada, informe os valores das suas últimas 3 contas de energia. Essas informações são essenciais para calcularmos com precisão a economia que você pode alcançar."
          />

          {/* Passo 3 */}
          <StepCard
            stepNumber={3}
            stepColor="blue"
            icon={BarChart3}
            stepTitle="Receba sua Análise Completa e Gratuita!"
            title="Descubra seus resultados:"
            description="Em instantes, nossa plataforma processará os dados e apresentará um painel completo com tudo o que você precisa saber:"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <ResultCard
                icon={Leaf}
                iconBg="bg-green-100"
                iconColor="text-green-600"
                title="Impacto Ambiental"
              />
              <ResultCard
                icon={FileText}
                iconBg="bg-yellow-100"
                iconColor="text-yellow-600"
                title="Relatório Financeiro"
              />
              <ResultCard
                icon={Zap}
                iconBg="bg-blue-100"
                iconColor="text-blue-600"
                title="Potencial Energético"
              />
            </div>
          </StepCard>
        </div>

        {/* Card Final */}
        <Card className="border border-green-200 bg-green-50 shadow-md">
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              É simples assim!
            </h2>
            <p className="text-base text-gray-700 mb-6">
              Sem jargões técnicos, sem complicação.
            </p>
            <Button 
              onClick={onGetStarted}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
            >
              Começar Agora
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ComoFunciona;

