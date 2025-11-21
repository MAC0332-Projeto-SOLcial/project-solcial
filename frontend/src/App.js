import { useState } from 'react';
import Homepage from './components/Home';
import SolarForm from './components/SolarForm';
import SobreNos from './components/SobreNos';
import ComoFunciona from './components/ComoFunciona';
import { LoadingSpinner } from './ui/loadingspinner';

function App() {
  const [currentState, setCurrentState] = useState("homepage");
  const [userData, setUserData] = useState(null);

  const handleGetStarted = () => {
    setCurrentState("input");
  };

  const handleDataSubmit = (data) => {
    setUserData(data);
    setCurrentState("loading");
  };

  const handleComoFunciona = () => {
    setCurrentState("como-funciona");
  };

  const handleSobreNos = () => {
    setCurrentState("sobre-nos");
  };

  const handleBack = () => {
    if (currentState === "input") {
      setCurrentState("homepage");
    } else if (currentState === "results") {
      setCurrentState("input");
    } else if (currentState === "como-funciona" || currentState === "sobre-nos") {
      setCurrentState("homepage");
    }
  };

  return (
    <div className="min-h-screen">
      {currentState === "homepage" && (
        <Homepage 
          onGetStarted={handleGetStarted}
          onComoFunciona={handleComoFunciona}
          onSobreNos={handleSobreNos}
        />
      )}

      {currentState === "input" && (
        <SolarForm
          onSubmit={handleDataSubmit}
          onBack={handleBack}
        />
      )}

      {currentState === "loading" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
          <div className="text-center">
            <LoadingSpinner className="h-12 w-12 mx-auto mb-4" /> 
            <p className="text-lg text-gray-600">Calculando seu potencial solar...</p>
          </div>
        </div>
      )}

      {currentState === "results" && userData && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
         
        </div>
      )}

      {currentState === "como-funciona" && (
        <ComoFunciona onBack={handleBack} onGetStarted={handleGetStarted} />
      )}

      {currentState === "sobre-nos" && (
        <SobreNos onBack={handleBack} onGetStarted={handleGetStarted} />
      )}
    </div>
  );
}

export default App;
