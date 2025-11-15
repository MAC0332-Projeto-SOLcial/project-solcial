import { useState } from 'react';
import Homepage from './components/Home';
import SolarForm from './components/SolarForm';
import SolarImpactDashboard from "./components/SolarImpactDashboard";

function App() {
  const [currentState, setCurrentState] = useState("homepage");
  const [userData, setUserData] = useState(null);

  const handleGetStarted = () => {
    setCurrentState("input");
  };

  const handleDataSubmit = (data) => {
    setUserData(data);
    setCurrentState("results");

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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Calculando seu potencial solar...</p>
          </div>
        </div>
      )}

      {currentState === "results" && userData && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
         <SolarImpactDashboard userData={userData} onBack={handleBack} />
        </div>
      )}

      {currentState === "como-funciona" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
          
        </div>
      )}

      {currentState === "sobre-nos" && (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-yellow-50">
          
        </div>
      )}
    </div>
  );
}

export default App;
