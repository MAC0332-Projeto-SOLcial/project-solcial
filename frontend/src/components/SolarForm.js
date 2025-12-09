import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { MapPin, Zap, ArrowLeft } from "lucide-react";

const SolarForm = ({ onSubmit, onBack }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState("");
  const [monthlyBill, setMonthlyBill] = useState("");

  const handleNext = () => {
    if (step === 1 && address.trim()) {
      setStep(2);
    }
  };

  const handleSubmit = () => {
    if (address.trim() && monthlyBill && parseFloat(monthlyBill) > 0) {
      onSubmit({
        address: address.trim(),
        monthlyBill: parseFloat(monthlyBill)
      });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      onBack();
    } else {
      setStep(1);
    }
  };

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
                <div className="flex justify-center space-x-2 mb-4">
                  <div className={`w-3 h-3 rounded-full transition-colors ${step >= 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                  <div className={`w-3 h-3 rounded-full transition-colors ${step >= 2 ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                </div>
                <h3 className="text-2xl text-gray-900">
                  {step === 1 ? "Onde você está localizado?" : "Qual sua conta de luz mensal?"}
                </h3>
                <p className="text-gray-600 mt-2">
                  {step === 1 
                    ? "Digite seu endereço para calcularmos o potencial solar"
                    : "Digite o valor médio da sua conta de energia elétrica"
                  }
                </p>
              </div>
            }
            contentClassName="space-y-6"
          >
              {step === 1 ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-green-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Localização</h3>
                      <p className="text-sm text-gray-600">São Paulo, SP</p>
                    </div>
                  </div>
                  <Input
                    id="address"
                    label="Endereço completo"
                    placeholder="Ex: Rua das Flores, 123, Vila Mariana"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="text-base"
                  />
                  <Button 
                    onClick={handleNext}
                    disabled={!address.trim()}
                    variant="default"
                    className="w-full"
                  >
                    Próximo
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg">
                    <Zap className="w-6 h-6 text-yellow-600" />
                    <div>
                      <h3 className="font-medium text-gray-900">Conta de Energia</h3>
                      <p className="text-sm text-gray-600">Valor médio mensal</p>
                    </div>
                  </div>
                  <div className="relative">
                    <Input
                      id="monthlyBill"
                      label="Valor da conta mensal (R$)"
                      type="number"
                      placeholder="350,00"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      className="pl-10 text-base"
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!monthlyBill || parseFloat(monthlyBill) <= 0}
                    variant="default"
                    className="w-full"
                  >
                    Calcular Potencial Solar
                  </Button>
                </div>
              )}
          </Card>
        </div>

        {/* Desktop: Side by Side Layout */}
        <div className="hidden md:block">
          <div className="flex items-start justify-between space-x-8">
            <button 
              onClick={onBack}
              className="p-3 rounded-full hover:bg-white/50 transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Vamos calcular seu potencial solar
                </h1>
                <p className="text-gray-600">
                  Precisamos de algumas informações para fornecer uma análise precisa
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Address Card */}
                <Card 
                  className="shadow-lg border-0"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Localização</h3>
                        <p className="text-sm text-gray-600">São Paulo, SP</p>
                      </div>
                    </div>
                  }
                  contentClassName="space-y-4"
                >
                  <Input
                    id="address-desktop"
                    label="Endereço completo"
                    placeholder="Ex: Rua das Flores, 123, Vila Mariana"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </Card>

                {/* Monthly Bill Card */}
                <Card 
                  className="shadow-lg border-0"
                  header={
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">Conta de Energia</h3>
                        <p className="text-sm text-gray-600">Valor médio mensal</p>
                      </div>
                    </div>
                  }
                  contentClassName="space-y-4"
                >
                  <div className="relative">
                   
                    <Input
                      id="monthlyBill-desktop"
                      label="Valor da conta mensal (R$)"
                      type="number"
                      placeholder="350,00"
                      value={monthlyBill}
                      onChange={(e) => setMonthlyBill(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </Card>
              </div>

              <div className="mt-8 text-center">
                <Button 
                  onClick={handleSubmit}
                  disabled={!address.trim() || !monthlyBill || parseFloat(monthlyBill) <= 0}
                  variant="default"
                  size="lg"
                >
                  Calcular Potencial Solar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SolarForm;
