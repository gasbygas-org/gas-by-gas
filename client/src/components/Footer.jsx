// src/components/Footer.jsx
import { m } from 'framer-motion';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#', label: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#', label: 'Instagram' },
  ];

  const contactInfo = [
    { icon: <Phone size={20} />, text: '+1 234 567 890' },
    { icon: <Mail size={20} />, text: 'contact@gasbygas.com' },
    { icon: <MapPin size={20} />, text: 'No. 69, Pedlar St, Galle Fort, Sri Lanka.' },
  ];

  return (
    <m.footer 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-800/50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <m.h3 
              whileHover={{ scale: 1.05 }}
              className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
            >
              GasByGas
            </m.h3>
            <p className="text-gray-400 text-sm">
              Delivering quality gas solutions to your doorstep with safety and reliability.
            </p>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo.map((item, index) => (
                <m.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  className="flex items-center space-x-3 text-gray-400 hover:text-white transition-colors duration-300"
                >
                  <span className="text-blue-400">{item.icon}</span>
                  <span className="text-sm">{item.text}</span>
                </m.li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <m.a
                  key={index}
                  href={link.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 rounded-lg bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/50 transition-colors duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </m.a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <m.div 
          className="mt-8 pt-6 border-t border-gray-800/50 text-center"
        >
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} GasByGas. All rights reserved. Made with ❤️ by{' කලු මල්ලි'} at Galle Fort
          </p>
        </m.div>
      </div>
    </m.footer>
  );
};

export default Footer;
