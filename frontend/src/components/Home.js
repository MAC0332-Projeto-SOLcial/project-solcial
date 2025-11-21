import { Button } from "../ui/button";
import { Logo } from "../ui/logo";
import { FeatureCard } from "../ui/feature-card";
import { Sun, Leaf, Zap } from "lucide-react";

const Homepage = ({ onGetStarted, onComoFunciona, onSobreNos }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <nav className="hidden md:flex items-center justify-between p-6 md:px-8">
        <Logo />
        <div className="flex space-x-8">
          <button 
            onClick={onComoFunciona}
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Como Funciona
          </button>
          <button 
            onClick={onSobreNos}
            className="text-gray-600 hover:text-green-600 transition-colors"
          >
            Sobre Nós
          </button>
        </div>
      </nav>
      <div className="md:hidden flex items-center justify-center pt-8 pb-4">
        <Logo />
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-8 py-12 md:py-20">
        <div className="flex-1 max-w-2xl text-center md:text-left mb-12 md:mb-0">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Descubra o potencial solar da sua 
            <span className="text-green-600"> casa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 md:mb-12">
            Transforme a energia do sol em economia real. Calcule sua economia, 
            investimento e impacto ambiental em poucos cliques.
          </p>
          
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 md:mb-12">
            <FeatureCard
              icon={Zap}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              title="Análise Rápida"
              description="Resultados em segundos com base no seu endereço"
            />
            <FeatureCard
              icon={Sun}
              iconBg="bg-yellow-100"
              iconColor="text-yellow-600"
              title="Dados Precisos"
              description="Cálculos baseados na irradiação solar de São Paulo"
            />
            <FeatureCard
              icon={Leaf}
              iconBg="bg-green-100"
              iconColor="text-green-600"
              title="Impacto Real"
              description="Veja sua contribuição para um planeta mais verde"
            />
          </div>

          <Button 
            onClick={onGetStarted}
            variant="default"
            size="lg"
            className="md:flex hidden"
          >
            Analisar Agora
          </Button>
        </div>

        <div className="flex-1 max-w-2xl md:flex hidden">
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1655300283247-6b1924b1d152?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGhvdXNlJTIwcm9vZnRvcHxlbnwxfHx8fDE3NTkwNzY1MDR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Casa com painéis solares no telhado"
              className="w-full h-auto rounded-2xl shadow-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent"></div>
          </div>
        </div>
      </div>

     
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t">
        <Button 
          onClick={onGetStarted}
          variant="default"
          size="lg"
          className="w-full"
        >
          Analisar Agora
        </Button>
      </div>
    </div>
  );
};

export default Homepage;

