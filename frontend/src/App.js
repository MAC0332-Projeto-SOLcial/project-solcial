import { useState } from 'react';
import Homepage from './components/Home';
import SolarForm from './components/SolarForm';
import SolarImpactDashboard from "./components/SolarImpactDashboard";
import SobreNos from './components/SobreNos';
import ComoFunciona from './components/ComoFunciona';
import { LoadingSpinner } from './ui/loadingspinner';
import { ToastContainer, toast } from 'react-toast';

function App() {
  const [currentState, setCurrentState] = useState("homepage");
  const [userData, setUserData] = useState(null);

  const handleGetStarted = () => {
    
    setCurrentState("input");
  };

  const handleDataSubmit = async (formData) => {
    
    setCurrentState("loading");
    
    try {
      const requestData = {
        address: formData.address.trim(),
        energyConsumptionKwh: [
          formData.kwhConsumption1,
          formData.kwhConsumption2,
          formData.kwhConsumption3
        ],
        spentMoney: [
          formData.monthlyBill1,
          formData.monthlyBill2,
          formData.monthlyBill3
        ]
      };

      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';
      
      const params = new URLSearchParams({
        address: requestData.address,
        energyConsumptionKwh: JSON.stringify(requestData.energyConsumptionKwh),
        spentMoney: JSON.stringify(requestData.spentMoney)
      });
      
      const fullUrl = `${apiUrl}/solar-metrics?${params.toString()}`;
      
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        let errorMessage = 'Erro ao calcular potencial solar. Por favor, tente novamente.';
        try {
          const errorData = await response.json();
          
          if (response.status === 400) {
            errorMessage = 'Não foi possível processar sua solicitação. Verifique os dados informados e tente novamente.';
          } else if (response.status === 404) {
            errorMessage = 'Serviço não encontrado. Tente novamente mais tarde.';
          } else if (response.status >= 500) {
            errorMessage = 'Erro no servidor. Por favor, tente novamente em alguns instantes.';
          } else {
            errorMessage = errorData.error || errorMessage;
          }
        } catch (e) {
          if (response.status === 400) {
            errorMessage = 'Erro ao processar os dados. Verifique as informações e tente novamente.';
          } else {
            errorMessage = `Erro ${response.status}: ${response.statusText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const apiData = await response.json();
      
      const userData = {
        address: formData.address.trim(),
        monthlyBill1: formData.monthlyBill1,
        monthlyBill2: formData.monthlyBill2,
        monthlyBill3: formData.monthlyBill3,
        kwhConsumption1: formData.kwhConsumption1,
        kwhConsumption2: formData.kwhConsumption2,
        kwhConsumption3: formData.kwhConsumption3,
        apiResponse: apiData
      };

      setUserData(userData);
      setCurrentState("results");
      toast.success('Potencial solar calculado com sucesso!');
    } catch (error) {
      toast.error(error.message || 'Erro ao calcular potencial solar. Tente novamente.');
      setCurrentState("input");
    }
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
      <ToastContainer position="top-right" delay={4000} />
      
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
         <SolarImpactDashboard userData={userData} onBack={handleBack} />
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
