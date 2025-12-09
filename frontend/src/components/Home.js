import { Button } from "../ui/button";
import { Sun, Leaf, Zap } from "lucide-react";

const Homepage = ({ onGetStarted, onComoFunciona, onSobreNos }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between p-6 lg:px-8">
        <div className="flex items-center space-x-2">
          <Sun className="w-8 h-8 text-yellow-500" />
          <span className="text-2xl font-bold text-green-700">SOLcial</span>
        </div>
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

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-center pt-8 pb-4">
        <div className="flex items-center space-x-2">
          <Sun className="w-8 h-8 text-yellow-500" />
          <span className="text-2xl font-bold text-green-700">SOLcial</span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-8 py-12 lg:py-20">
        {/* Left Content */}
        <div className="flex-1 max-w-2xl text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
            Descubra o potencial solar da sua 
            <span className="text-green-600"> casa</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 lg:mb-12">
            Transforme a energia do sol em economia real. Calcule sua economia, 
            investimento e impacto ambiental em poucos cliques.
          </p>
          
        
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 lg:mb-12">
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Análise Rápida</h3>
              <p className="text-sm text-gray-600 text-center lg:text-left">
                Resultados em segundos com base no seu endereço
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-3">
                <Sun className="w-6 h-6 text-yellow-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Dados Precisos</h3>
              <p className="text-sm text-gray-600 text-center lg:text-left">
                Cálculos baseados na irradiação solar de São Paulo
              </p>
            </div>
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <Leaf className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Impacto Real</h3>
              <p className="text-sm text-gray-600 text-center lg:text-left">
                Veja sua contribuição para um planeta mais verde
              </p>
            </div>
          </div>

          <Button 
            onClick={onGetStarted}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 w-full md:w-auto"
          >
            Analisar Agora
          </Button>
        </div>

        {/* Right Image */}
        <div className="flex-1 max-w-2xl">
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

      {/* Bottom CTA for Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white shadow-lg border-t">
        <Button 
          onClick={onGetStarted}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-4 rounded-lg font-medium"
        >
          Analisar Agora
        </Button>
      </div>
    </div>
  );
};

export default Homepage;

