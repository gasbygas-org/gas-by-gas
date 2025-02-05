// src/components/Hero.jsx
import { m } from 'framer-motion';
import { Truck, Clock, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const features = [
    { 
      icon: <Truck className="w-6 h-6" />, 
      title: 'Fast Delivery', 
      desc: 'Same-day gas delivery to your location',
      color: 'from-blue-500 to-cyan-400'
    },
    { 
      icon: <Clock className="w-6 h-6" />, 
      title: 'Real-time Tracking', 
      desc: 'Track your gas delivery status live',
      color: 'from-purple-500 to-pink-400'
    },
    { 
      icon: <Shield className="w-6 h-6" />, 
      title: 'Secure Service', 
      desc: 'Safe and secure gas handling',
      color: 'from-green-500 to-emerald-400'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        {/* Primary gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 animate-gradient" />
        
        {/* Radial overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(147,51,234,0.15),transparent_50%)]" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20" />
        
        {/* Noise texture */}
        <div className="absolute inset-0 opacity-50 mix-blend-soft-light">
          <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/5 to-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="container relative z-10 px-4 py-24 mx-auto md:py-32">
        <m.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Hero Content */}
          <m.div 
            variants={itemVariants}
            className="mb-16 space-y-8 text-center"
          >
            <h1 className="text-4xl font-bold md:text-6xl lg:text-7xl">
              <span className="text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text">
                GasByGas
              </span>
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-300 md:text-xl">
              Seamless gas delivery with real-time tracking. Your trusted energy partner.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/request">
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-full gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-blue-500/25 hover:shadow-blue-500/40 sm:w-auto group"
                >
                  Request Gas Now
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </m.button>
              </Link>
              <Link to="/dashboard">
                <m.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full px-8 py-4 font-semibold text-gray-300 transition-all duration-300 border border-gray-700 bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:bg-gray-800/70 sm:w-auto"
                >
                  Track Delivery
                </m.button>
              </Link>
            </div>
          </m.div>

          {/* Features Grid */}
          <m.div 
            variants={containerVariants}
            className="grid gap-6 md:grid-cols-3 md:gap-8"
          >
            {features.map((feature, index) => (
              <m.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-8 transition-all duration-300 border shadow-2xl backdrop-blur-xl bg-gray-800/30 rounded-3xl border-gray-700/50 hover:shadow-2xl"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${feature.color} p-4 flex items-center justify-center text-white mb-6 shadow-lg`}>
                  {feature.icon}
                </div>
                <h3 className="mb-3 text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-400">
                  {feature.desc}
                </p>
              </m.div>
            ))}
          </m.div>

          {/* Stats Section */}
          <m.div 
            variants={containerVariants}
            className="grid grid-cols-2 gap-6 mt-20 text-center md:grid-cols-4"
          >
            {[
              { value: '10K+', label: 'Active Users' },
              { value: '24/7', label: 'Support' },
              { value: '99%', label: 'Success Rate' },
              { value: '30min', label: 'Avg. Delivery' }
            ].map((stat, index) => (
              <m.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="p-6 transition-all duration-300 border shadow-2xl backdrop-blur-xl bg-gray-800/30 rounded-3xl border-gray-700/50 hover:shadow-2xl"
              >
                <h4 className="text-2xl font-bold text-transparent md:text-3xl bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text">
                  {stat.value}
                </h4>
                <p className="text-sm text-gray-400 md:text-base">{stat.label}</p>
              </m.div>
            ))}
          </m.div>
        </m.div>
      </div>

      {/* Bottom fade effect */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent" />
    </div>
  );
};

export default Hero;
