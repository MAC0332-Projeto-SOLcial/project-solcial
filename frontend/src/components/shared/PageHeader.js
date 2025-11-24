import { Sun, ArrowLeft } from "lucide-react";

// Componente reutilizável para header de páginas
const PageHeader = ({ onBack }) => (
  <>
    {/* Desktop Navigation */}
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
      <div className="flex items-center space-x-2">
        <Sun className="w-8 h-8 text-yellow-500" />
        <span className="text-2xl font-bold text-gray-900">SOLcial</span>
      </div>
      <div className="w-24"></div>
    </nav>

    {/* Mobile Header */}
    <div className="md:hidden flex items-center justify-between p-6">
      <button 
        onClick={onBack}
        className="flex items-center space-x-2 text-gray-600"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Voltar</span>
      </button>
      <div className="flex items-center space-x-2">
        <Sun className="w-8 h-8 text-yellow-500" />
        <span className="text-2xl font-bold text-gray-900">SOLcial</span>
      </div>
      <div className="w-16"></div>
    </div>
  </>
);

export default PageHeader;

