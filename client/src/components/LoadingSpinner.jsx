// components/LoadingSpinner.jsx
const LoadingSpinner = ({ size = 'default' }) => {
    const sizes = {
      small: 'w-4 h-4',
      default: 'w-6 h-6',
      large: 'w-8 h-8'
    };
  
    return (
      <div className={`relative ${sizes[size]}`}>
        <div className="absolute inset-0 border-2 border-t-blue-400 border-r-blue-400 
          border-b-transparent border-l-transparent rounded-full animate-spin" />
        <div className="absolute inset-0 border-2 border-t-purple-400 border-r-transparent 
          border-b-transparent border-l-transparent rounded-full animate-spin-slow" />
        <div className="absolute inset-0 border-2 border-t-transparent border-r-transparent 
          border-b-blue-400 border-l-purple-400 rounded-full animate-pulse opacity-50" />
      </div>
    );
  };
  
  export default LoadingSpinner;
  