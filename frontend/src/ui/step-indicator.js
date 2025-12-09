const StepIndicator = ({ currentStep, totalSteps, className = "" }) => {
  return (
    <div className={`flex justify-center space-x-2 ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div
          key={step}
          className={`w-3 h-3 rounded-full transition-colors ${
            step <= currentStep ? 'bg-green-600' : 'bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
};

export { StepIndicator };

