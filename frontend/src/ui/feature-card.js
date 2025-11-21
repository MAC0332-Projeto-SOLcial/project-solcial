const FeatureCard = ({ icon: Icon, iconBg = "bg-green-100", iconColor = "text-green-600", title, description, className = "" }) => {
  return (
    <div className={`flex flex-col items-center md:items-start ${className}`}>
      <div className={`w-12 h-12 ${iconBg} rounded-lg flex items-center justify-center mb-3`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 text-center md:text-left">
        {description}
      </p>
    </div>
  );
};

export { FeatureCard };

