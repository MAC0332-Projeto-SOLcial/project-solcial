import { useState } from 'react';
import { Mail, Phone, MessageSquare, Send, CheckCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import PageHeader from "./shared/PageHeader";

// Componente reutilizável para cards de informação de contato
const ContactInfoCard = ({ icon: Icon, iconBg, iconColor, title, content }) => (
  <Card className="shadow-md border-0">
    <div className="p-6 text-center">
      <div className={`w-12 h-12 ${iconBg} rounded-full flex items-center justify-center mx-auto mb-3`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600">{content}</p>
    </div>
  </Card>
);

const Contato = ({ onBack }) => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    telefone: "",
    assunto: "",
    mensagem: "",
    newsletter: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulação de envio (aqui você integraria com o backend)
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      // Resetar formulário após 3 segundos
      setTimeout(() => {
        setFormData({
          nome: "",
          email: "",
          telefone: "",
          assunto: "",
          mensagem: "",
          newsletter: false
        });
        setIsSubmitted(false);
      }, 3000);
    }, 1500);
  };

  const isFormValid = formData.nome.trim() && 
                      formData.email.trim() && 
                      formData.assunto.trim() && 
                      formData.mensagem.trim();

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
        <PageHeader onBack={onBack} />
        <div className="max-w-2xl mx-auto px-6 lg:px-8 py-12 lg:py-20">
          <Card className="shadow-xl border-0">
            <div className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                Mensagem Enviada com Sucesso!
              </h2>
              <p className="text-gray-600 mb-6">
                Obrigado pelo seu contato. Responderemos em breve!
              </p>
              <Button 
                onClick={onBack}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Voltar ao Início
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50">
      <PageHeader onBack={onBack} />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8 lg:py-12">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Entre em Contato
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Tem dúvidas sobre energia solar? Quer saber mais sobre o SOLcial? 
            Estamos aqui para ajudar! Envie sua mensagem e responderemos o mais breve possível.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <ContactInfoCard
            icon={Mail}
            iconBg="bg-green-100"
            iconColor="text-green-600"
            title="Email"
            content="contato@solcial.com.br"
          />
          <ContactInfoCard
            icon={Phone}
            iconBg="bg-yellow-100"
            iconColor="text-yellow-600"
            title="Telefone"
            content="(11) 9999-9999"
          />
          <ContactInfoCard
            icon={MessageSquare}
            iconBg="bg-blue-100"
            iconColor="text-blue-600"
            title="Horário"
            content="Seg - Sex: 9h às 18h"
          />
        </div>

        {/* Form Card */}
        <Card className="shadow-xl border-0">
          <div className="p-6 lg:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome e Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="nome"
                  name="nome"
                  label="Nome Completo *"
                  placeholder="Seu nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  label="Email *"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Telefone e Assunto */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  id="telefone"
                  name="telefone"
                  type="tel"
                  label="Telefone (opcional)"
                  placeholder="(11) 99999-9999"
                  value={formData.telefone}
                  onChange={handleChange}
                />
                <div className="space-y-2">
                  <Label htmlFor="assunto">
                    Assunto *
                  </Label>
                  <select
                    id="assunto"
                    name="assunto"
                    value={formData.assunto}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2"
                    required
                  >
                    <option value="">Selecione um assunto</option>
                    <option value="duvida">Dúvida sobre energia solar</option>
                    <option value="calculo">Dúvida sobre o cálculo</option>
                    <option value="parceria">Parceria</option>
                    <option value="sugestao">Sugestão ou feedback</option>
                    <option value="outro">Outro</option>
                  </select>
                </div>
              </div>

              {/* Mensagem */}
              <Textarea
                id="mensagem"
                name="mensagem"
                label="Mensagem *"
                rows="6"
                placeholder="Escreva sua mensagem aqui..."
                value={formData.mensagem}
                onChange={handleChange}
                required
              />

              {/* Newsletter Checkbox */}
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="newsletter"
                  name="newsletter"
                  checked={formData.newsletter}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <label htmlFor="newsletter" className="text-sm text-gray-700">
                  Desejo receber informações sobre energia solar e novidades do SOLcial por email
                </label>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-4">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                * Campos obrigatórios
              </p>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Contato;

