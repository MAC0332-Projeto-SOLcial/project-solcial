import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { StepIndicator } from "../ui/step-indicator";
import { MapPin, Zap, ArrowLeft, DollarSign } from "lucide-react";
import { LoadingSpinner } from '../ui/loadingspinner';

const fetchAddressByZipCode = async (zipCode) => {
  const cleanZipCode = zipCode.replace(/\D/g, ''); 
  
  if (cleanZipCode.length !== 8) return null;

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanZipCode}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return null;
    }
    
    return data;
  } catch (error) {
    console.error("Erro ao buscar CEP:", error);
    return null;
  }
};


const SolarForm = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(1);
  const [street, setStreet] = useState("");
  const [number, setNumber] = useState("");
  const [numberError, setNumberError] = useState(null); 
  const [zipCode, setZipCode] = useState("");
  const [zipCodeError, setZipCodeError] = useState(null);
  const [zipCodeStatus, setZipCodeStatus] = useState(null); 
  const [monthlyBill1, setMonthlyBill1] = useState("");
  const [monthlyBill2, setMonthlyBill2] = useState("");
  const [monthlyBill3, setMonthlyBill3] = useState("");
  const [bill1Error, setBill1Error] = useState(null);
  const [bill2Error, setBill2Error] = useState(null);
  const [bill3Error, setBill3Error] = useState(null);
  const [kwhConsumption1, setKwhConsumption1] = useState("");
  const [kwhConsumption2, setKwhConsumption2] = useState("");
  const [kwhConsumption3, setKwhConsumption3] = useState("");
  const [kwh1Error, setKwh1Error] = useState(null);
  const [kwh2Error, setKwh2Error] = useState(null);
  const [kwh3Error, setKwh3Error] = useState(null);
  const address = `${street.trim()} ${number.trim()}`;

  const areAllBillsValid = () => {
    return (
        parseFloat(monthlyBill1) > 0 && !bill1Error &&
        parseFloat(monthlyBill2) > 0 && !bill2Error &&
        parseFloat(monthlyBill3) > 0 && !bill3Error
    );
  };

  const areAllKwhValid = () => {
    return (
        kwhConsumption1 && parseInt(kwhConsumption1) > 0 && !kwh1Error &&
        kwhConsumption2 && parseInt(kwhConsumption2) > 0 && !kwh2Error &&
        kwhConsumption3 && parseInt(kwhConsumption3) > 0 && !kwh3Error
    );
  };

  const validateBill = (value, setError) => {
    
    let rawValue = String(value); 
    
    if (rawValue.length > 0 && /[^0-9.]/.test(rawValue)) {
        setError("Use apenas números e ponto decimal (ex: 350.50)."); 
        return false;
    }

    const numericValue = parseFloat(rawValue);

    if (!rawValue || rawValue.length === 0 || isNaN(numericValue) || numericValue <= 0) {
        setError("O valor deve ser um número maior que zero."); 
        return false;
    } 
    
    setError(null);
    return true;
  };

  const validateKwhBill = (value, setError) => {
    
    let rawValue = String(value); 
    
    if (rawValue.length > 0 && /[^0-9]/.test(rawValue)) {
        setError("Use apenas números inteiros (ex: 350)."); 
        return false;
    }

    const numericValue = parseInt(rawValue);

    if (!rawValue || rawValue.length === 0 || isNaN(numericValue) || numericValue <= 0) {
        setError("O valor deve ser um número inteiro maior que zero."); 
        return false;
    } 
    
    setError(null);
    return true;
  };

  const handleMonthlyBill1Change = (e) => {
    const rawValue = e.target.value;
    setMonthlyBill1(rawValue);
    validateBill(rawValue, setBill1Error);
  };
  
  const handleMonthlyBill2Change = (e) => {
    const rawValue = e.target.value;
    setMonthlyBill2(rawValue);
    validateBill(rawValue, setBill2Error);
  };
  
  const handleMonthlyBill3Change = (e) => {
    const rawValue = e.target.value;
    setMonthlyBill3(rawValue);
    validateBill(rawValue, setBill3Error);
  };

  const handleKwhConsumption1Change = (e) => {
    const rawValue = e.target.value;
    setKwhConsumption1(rawValue);
    validateKwhBill(rawValue, setKwh1Error);
  };
  
  const handleKwhConsumption2Change = (e) => {
    const rawValue = e.target.value;
    setKwhConsumption2(rawValue);
    validateKwhBill(rawValue, setKwh2Error);
  };
  
  const handleKwhConsumption3Change = (e) => {
    const rawValue = e.target.value;
    setKwhConsumption3(rawValue);
    validateKwhBill(rawValue, setKwh3Error);
  };

  const handleNumberChange = (e) => {
    const rawValue = e.target.value;
    setNumber(rawValue); 

    if (/[^0-9]/.test(rawValue) && rawValue.length > 0) {
        setNumberError("Digite apenas números.");
    } else {
        setNumberError(null); 
    }
  };

  const handleZipCodeChange = (e) => {
    let rawValue = e.target.value;
    
    let cleanValue = rawValue.replace(/\D/g, '');

    if (/[^0-9-]/.test(rawValue) && rawValue.length > 0) {
        setZipCodeError("CEP inválido. Use apenas números.");
        setZipCode(rawValue); 
        return;
    }
    
    if (cleanValue.length > 8) {
        cleanValue = cleanValue.substring(0, 8);
    }

    let formattedValue = cleanValue;
    if (cleanValue.length > 5) {
        formattedValue = cleanValue.substring(0, 5) + '-' + cleanValue.substring(5, 8);
    } 
    
    setZipCode(formattedValue);
    
    if (formattedValue.length <= 9 && !/[^0-9-]/.test(formattedValue)) {
        setZipCodeError(null);
    }
  };

  const handleZipCodeBlur = async () => {
    const cleanZipCode = zipCode.replace(/\D/g, '');

    if (zipCodeError || cleanZipCode.length !== 8) {
        setZipCodeStatus(null);
        if (cleanZipCode.length > 0 && cleanZipCode.length < 8) {
            setZipCodeError("O CEP deve ter 8 dígitos.");
        }
        return;
    }

    if (cleanZipCode.length === 8) {
      setZipCodeStatus('loading');
      const data = await fetchAddressByZipCode(zipCode);
      
      if (data) {
        setStreet(data.logradouro);
        setZipCodeStatus('success');
      } else {
        setZipCodeStatus('error');
        setStreet(''); 
        setZipCodeError("CEP não encontrado. Digite manualmente."); 
      }
    }
  };

  const handleNext = () => {
    
    if (numberError || zipCodeError) {
        return;
    }

    const cleanZipCode = zipCode.replace(/\D/g, '');
    
    if (cleanZipCode.length !== 8) {
        setZipCodeError("O CEP deve ter 8 dígitos para continuar.");
        return;
    }
    
    if (!street.trim() || !number.trim()) {
        return; 
    }

    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
        if (!areAllBillsValid()) {
            validateBill(monthlyBill1, setBill1Error);
            validateBill(monthlyBill2, setBill2Error);
            validateBill(monthlyBill3, setBill3Error);
            return;
        }
        setStep(3);
    }
  };

  const handleSubmit = () => {
    if (step === 3) {
        if (!areAllKwhValid()) {
            validateKwhBill(kwhConsumption1, setKwh1Error);
            validateKwhBill(kwhConsumption2, setKwh2Error);
            validateKwhBill(kwhConsumption3, setKwh3Error);
            return;
        }
        
        if (address.trim() && areAllBillsValid() && areAllKwhValid()) {
            onSubmit({
                address: address.trim(),
                monthlyBill1: parseFloat(monthlyBill1),
                monthlyBill2: parseFloat(monthlyBill2),
                monthlyBill3: parseFloat(monthlyBill3),
                kwhConsumption1: parseInt(kwhConsumption1),
                kwhConsumption2: parseInt(kwhConsumption2),
                kwhConsumption3: parseInt(kwhConsumption3),
            });
        }
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else if (step === 2) {
      setStep(1);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return StepOneContent;
      case 2:
        return StepTwoContent;
      case 3:
        return StepThreeContent;
      default:
        return null;
    }
  };
  
  const getStepTitle = () => {
    switch (step) {
      case 1:
        return "Onde você mora?";
      case 2:
        return "Qual sua conta de luz dos últimos três meses?";
      case 3:
        return "Qual seu consumo em kWh dos últimos três meses?";
      default:
        return "";
    }
  };

  const getStepSubtitle = () => {
    switch (step) {
      case 1:
        return "Digite seu endereço";
      case 2:
        return "Digite o valor das suas últimas três contas de energia elétrica";
      case 3:
        return "Digite o consumo das suas últimas três contas de energia elétrica em kWh";
      default:
        return "";
    }
  };

  const StepOneContent = (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
        <MapPin className="w-6 h-6 text-red-600" />
        <div>
          <h3 className="font-medium text-gray-900">Localização</h3>
          <p className="text-sm text-gray-600">São Paulo, SP</p>
        </div>
      </div>
      <div className="flex space-x-4">
        <div className="w-2/5 relative">
          <Input
            id="zipCode"
            label="CEP"
            placeholder="01234-567"
            value={zipCode}
            onChange={handleZipCodeChange}
            onBlur={handleZipCodeBlur} 
            error={!!zipCodeError} 
            type="text"
            maxLength="9" 
            disabled={zipCodeStatus === 'loading'}
            className={`text-base`} 
          />
          {zipCodeStatus === 'loading' && (
              <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3">
                  <LoadingSpinner className="h-5 w-5 border-2" />
              </div>
          )}
          {zipCodeError && (
            <p className="text-sm text-red-500 mt-1">{zipCodeError}</p>
          )}
        </div>
        <div className="w-3/5">
          <Input
            id="number"
            label="Número"
            placeholder="123"
            value={number}
            onChange={handleNumberChange}
            error={!!numberError}
            className={`text-base`}
            type="text"
          />
          {numberError && (
            <p className="text-sm text-red-500 mt-1">{numberError}</p>
          )}
        </div>
      </div>
      <div className="relative">
          <Input
            id="street"
            label="Rua / Avenida"
            placeholder="Ex: Rua das Flores"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            className={`text-base`}
            disabled={zipCodeStatus === 'loading'}
          />
          {zipCodeStatus === 'loading' && (
              <div className="absolute inset-y-0 right-0 top-6 flex items-center pr-3">
                  <LoadingSpinner className="h-5 w-5 border-2" />
              </div>
          )}
      </div>
      <Button 
        onClick={handleNext}
        disabled={!street.trim() || !number.trim() || zipCode.replace(/\D/g, '').length !== 8 || zipCodeStatus === 'loading' || numberError || zipCodeError}
        variant="default"
        className="w-full md:hidden"
      >
        Próximo
      </Button>
      <Button 
        onClick={handleNext}
        disabled={!street.trim() || !number.trim() || zipCode.replace(/\D/g, '').length !== 8 || zipCodeStatus === 'loading' || numberError || zipCodeError}
        variant="default"
        className="hidden md:block w-full mt-6"
      >
        Próximo
      </Button>
    </div>
  );

  const StepTwoContent = (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
        <DollarSign className="w-6 h-6 text-green-600" />
        <div>
          <h3 className="font-medium text-gray-900">Contas de Energia</h3>
          <p className="text-sm text-gray-600">Digite o valor das últimas 3 contas (R$)</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <div className="relative">
          <Input
            id="monthlyBill1"
            label="Mês 1"
            type="text"
            placeholder="350.00"
            value={monthlyBill1}
            onChange={handleMonthlyBill1Change} 
            error={!!bill1Error}
            className="text-base"
            min="0"
            step="0.01"
          />
          {bill1Error && (
            <p className="text-sm text-red-500 mt-1">{bill1Error}</p>
          )}
        </div>
        <div className="relative">
          <Input
            id="monthlyBill2"
            label="Mês 2"
            type="text"
            placeholder="350.00"
            value={monthlyBill2}
            onChange={handleMonthlyBill2Change} 
            error={!!bill2Error}
            className="text-base"
            min="0"
            step="0.01"
          />
          {bill2Error && ( 
            <p className="text-sm text-red-500 mt-1">{bill2Error}</p>
          )}
        </div>
        <div className="relative">
          <Input
            id="monthlyBill3"
            label="Mês 3"
            type="text"
            placeholder="350.00"
            value={monthlyBill3}
            onChange={handleMonthlyBill3Change} 
            error={!!bill3Error}
            className="text-base"
            min="0"
            step="0.01"
          />
          {bill3Error && ( 
            <p className="text-sm text-red-500 mt-1">{bill3Error}</p>
          )}
        </div>
      </div>
      <Button 
        onClick={handleNext}
        disabled={!areAllBillsValid()}
        variant="default"
        className="w-full"
        >
        Próximo
      </Button>
    </div>
  );

  const StepThreeContent = (
    <div className="space-y-4">
      <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
        <Zap className="w-6 h-6 text-yellow-600" />
        <div>
          <h3 className="font-medium text-gray-900">Consumo de Energia (kWh)</h3>
          <p className="text-sm text-gray-600">Digite o consumo das últimas 3 contas em kWh</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6">
        <div className="relative">
          <Input
            id="kwhConsumption1"
            label="Mês 1 (kWh)"
            type="text"
            placeholder="100"
            value={kwhConsumption1}
            onChange={handleKwhConsumption1Change} 
            error={!!kwh1Error} 
            className="text-base"
            min="1"
            step="1"
          />
          {kwh1Error && ( 
            <p className="text-sm text-red-500 mt-1">{kwh1Error}</p>
          )}
        </div>
        <div className="relative">
          <Input
            id="kwhConsumption2"
            label="Mês 2 (kWh)"
            type="text"
            placeholder="100"
            value={kwhConsumption2}
            onChange={handleKwhConsumption2Change} 
            error={!!kwh2Error} 
            className="text-base"
            min="1"
            step="1"
          />
          {kwh2Error && ( 
            <p className="text-sm text-red-500 mt-1">{kwh2Error}</p>
          )}
        </div>
        <div className="relative">
          <Input
            id="kwhConsumption3"
            label="Mês 3 (kWh)"
            type="text"
            placeholder="100"
            value={kwhConsumption3}
            onChange={handleKwhConsumption3Change} 
            error={!!kwh3Error} 
            className="text-base"
            min="1"
            step="1"
          />
          {kwh3Error && ( 
            <p className="text-sm text-red-500 mt-1">{kwh3Error}</p>
          )}
        </div>
      </div>
      <Button 
        onClick={handleSubmit}
        disabled={!areAllKwhValid()}
        variant="default"
        className="w-full"
      >
        Calcular Potencial Solar
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* Mobile: Single Card with Steps */}
        <div className="md:hidden">
          <Card 
            className="shadow-xl border-0"
            header={
              <div className="text-center pb-4 relative">
                <button 
                  onClick={handleBack}
                  className="absolute left-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <StepIndicator currentStep={step} totalSteps={3} className="mb-4" />
                <h3 className="text-2xl text-gray-900">
                  {getStepTitle()}
                </h3>
                <p className="text-gray-600 mt-2">
                  {getStepSubtitle()}
                </p>
              </div>
            }
            contentClassName="space-y-6"
          >
              {renderStepContent()}
          </Card>
        </div>

        {/* Desktop: Single Card with Steps */}
        <div className="hidden md:block">
          <div className="flex items-start justify-between space-x-8">
            <button 
              onClick={handleBack}
              className="p-3 rounded-full hover:bg-white/50 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 max-w-lg mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Vamos calcular seu potencial solar
                </h1>
                <p className="text-gray-600">
                  Precisamos de algumas informações para fornecer uma análise precisa
                </p>
              </div>
              <div className="flex justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors border-2 ${step === 1 ? 'bg-green-600 border-green-600' : 'bg-gray-300 border-gray-300'}`}>1</div>
                  <p className="text-sm mt-1 text-gray-700">Localização</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-0.5 bg-gray-300"></div>
                </div>
                <div className="text-center">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors border-2 ${step === 2 ? 'bg-green-600 border-green-600' : 'bg-gray-300 border-gray-300'}`}>2</div>
                  <p className="text-sm mt-1 text-gray-700">Conta de Energia (R$)</p>
                </div>
                <div className="flex items-center">
                  <div className="w-10 h-0.5 bg-gray-300"></div>
                </div>
                <div className="text-center">
                  <div className={`mx-auto w-10 h-10 rounded-full flex items-center justify-center font-bold text-white transition-colors border-2 ${step === 3 ? 'bg-green-600 border-green-600' : 'bg-gray-300 border-gray-300'}`}>3</div>
                  <p className="text-sm mt-1 text-gray-700">Consumo (kWh)</p>
                </div>
              </div>
              <Card 
                className="shadow-xl border-0"
                contentClassName="space-y-6"
              >
                  {renderStepContent()}
              </Card>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolarForm;