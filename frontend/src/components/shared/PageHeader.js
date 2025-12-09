import { ArrowLeft } from "lucide-react";
import { Logo } from "../../ui/logo";

// Componente reutilizável para header de páginas
const PageHeader = ({ onBack }) => (
  <> 
    <nav className="hidden md:flex items-center justify-between p-6 lg:px-8">
      <div className="flex items-center space-x-2">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Voltar</span>
        </button>
      </div>
      <Logo textColor="text-gray-900" />
      <div className="w-24"></div>
    </nav>

   
    <div className="md:hidden flex items-center justify-between p-6">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>
      <Logo textColor="text-gray-900" />
      <div className="w-16"></div>
    </div>
  </>
);

export default PageHeader;

