import { Target, Lightbulb, GraduationCap, Eye, ExternalLink, Users, Sun } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import PageHeader from "./shared/PageHeader";

// Componente reutilizável para cards com ícone
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

// Componente reutilizável para membro da equipe
const TeamMember = ({ nome, imagePath }) => (
  <div className="flex flex-col items-center w-full max-w-[140px]">
    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3 overflow-hidden">
      {imagePath ? (
        <img 
          src={imagePath} 
          alt={nome}
          className="w-full h-full object-cover rounded-full"
        />
      ) : (
        <Users className="w-12 h-12 text-gray-400" />
      )}
    </div>
    <p className="text-sm font-medium text-gray-900 text-center leading-tight">
      {nome}
    </p>
  </div>
);

const SobreNos = ({ onBack, onGetStarted }) => {
  const equipe = [
    "Fernando Gouveia Lima",
    "Karla P A y Silva",
    "Laís Nuto Rossman",
    "Lucas Escobar",
    "Marcelo S C Pinto",
    "Maysa Cristina Claudino da Silva",
    "Rodrigo de Castro Michelassi"
  ];

  // Mapeamento de nomes para arquivos de imagem
  const getImagePath = (nome) => {
    const imageMap = {
      "Fernando Gouveia Lima": "/images/equipe/fernando.jpg",
      "Karla P A y Silva": "/images/equipe/karla.JPG",
      "Laís Nuto Rossman": "/images/equipe/lais.jpg",
      "Maysa Cristina Claudino da Silva": "/images/equipe/maysa.jpg",
      "Rodrigo de Castro Michelassi": "/images/equipe/rodrigo.jpg"
    };
    return imageMap[nome] || null;
  };

  return (
    <div className="min-h-screen bg-white">
      <PageHeader onBack={onBack} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Nossa Missão Section */}
        <div className="bg-green-50 px-6 lg:px-8 py-12 lg:py-16">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center lg:text-left">
            Nossa Missão é Democratizar o Sol para Todos
          </h1>
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl">
            O SOLcial nasceu de um propósito claro: dar a cada morador e pequeno comerciante de São Paulo o poder de gerar sua própria energia limpa, economizar dinheiro e construir um futuro mais sustentável.
          </p>
        </div>

        {/* Cards Section */}
        <div className="px-6 lg:px-8 py-8 lg:py-12 space-y-6">
          <InfoCard
            icon={Target}
            iconBg="bg-red-100"
            iconColor="text-red-600"
            title="O Problema que nos Move"
          >
            <p className="text-base text-gray-700 leading-relaxed">
              Em uma cidade como São Paulo, enfrentamos desafios diários: contas de luz cada vez mais altas, instabilidade no fornecimento de energia e a dependência de fontes poluentes. A energia solar sempre pareceu uma solução distante, complexa e cara, principalmente pela falta de informação clara e personalizada.
            </p>
          </InfoCard>

          <InfoCard
            icon={Lightbulb}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            title="Nossa Solução: SOLcial"
          >
            <p className="text-base text-gray-700 leading-relaxed">
              Nós acreditamos que a informação é a ferramenta mais poderosa para a mudança. Por isso, criamos o SOLcial: uma plataforma que usa tecnologia de ponta, como a Google Solar API, para traduzir dados complexos em respostas simples e diretas para você.
            </p>
          </InfoCard>

          <InfoCard
            icon={GraduationCap}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Um Projeto Acadêmico com Propósito Real"
          >
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Este projeto foi desenvolvido por alunos da Universidade de São Paulo (USP), como parte da disciplina MAC5783 Engenharia de Software.
            </p>
            <p className="text-base text-gray-700 leading-relaxed mb-4">
              Nosso compromisso é com a transparência e o conhecimento aberto. Por isso, o código-fonte do projeto está disponível para todos.
            </p>
            <div className="mt-4">
              <span className="text-sm font-medium text-gray-700">Repositório no GitHub: </span>
              <a 
                href="https://github.com/solcial/projeto-solcial" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-green-600 hover:text-green-700 underline inline-flex items-center space-x-1"
              >
                <span>github.com/solcial/projeto-solcial</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </InfoCard>

          {/* Nossa Equipe */}
          <Card className="shadow-md">
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-7 h-7 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Nossa Equipe
                  </h2>
                  <p className="text-base text-gray-700 leading-relaxed mb-6">
                    O SOLcial foi desenvolvido por uma equipe dedicada de estudantes de Engenharia de Software da USP, unidos pelo propósito de tornar a energia solar acessível para todos.
                  </p>
                </div>
              </div>

              {/* Grid de Membros da Equipe */}
              <div className="mt-8 space-y-6">
                {/* Primeira linha - 4 membros */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-items-center">
                  {equipe.slice(0, 4).map((membro, index) => (
                    <TeamMember 
                      key={index} 
                      nome={membro} 
                      imagePath={getImagePath(membro)} 
                    />
                  ))}
                </div>
                {/* Segunda linha - 3 membros centralizados */}
                <div className="flex flex-wrap justify-center gap-6">
                  {equipe.slice(4, 7).map((membro, index) => (
                    <TeamMember 
                      key={index + 4} 
                      nome={membro} 
                      imagePath={getImagePath(membro)} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Nossa Visão */}
          <InfoCard
            icon={Eye}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            title="Nossa Visão"
          >
            <p className="text-base text-gray-700 leading-relaxed mb-6">
              Sonhamos com uma São Paulo onde cada telhado é uma pequena usina de energia limpa. Junte-se a nós na construção de um futuro mais justo, econômico e sustentável.
            </p>

            {/* Faça Parte da Revolução Solar */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Faça Parte da Revolução Solar
              </h3>
              <p className="text-base text-gray-700 mb-6">
                Descubra hoje mesmo o potencial solar da sua casa
              </p>
              <div className="flex justify-center">
                <Button 
                  onClick={onGetStarted}
                  variant="default"
                  size="lg"
                >
                  Calcular Meu Potencial Solar
                </Button>
              </div>
            </div>
          </InfoCard>
        </div>

        {/* Transformando São Paulo Section */}
        <div className="bg-green-50 px-6 lg:px-8 py-12 lg:py-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6 text-center">
            Transformando São Paulo, um telhado por vez
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <Sun className="w-6 h-6 text-green-500" />
            <span className="text-2xl font-bold text-gray-900">SOLcial</span>
            <Sun className="w-6 h-6 text-green-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SobreNos;

