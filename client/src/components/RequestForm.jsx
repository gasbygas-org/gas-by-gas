// src/components/RequestForm.jsx
import { useState } from 'react';
import { m } from 'framer-motion';
import { 
  User, Phone, Mail, Gas, MapPin, 
  Calendar, Clock, AlertCircle, CheckCircle, Loader2 
} from 'lucide-react';

const RequestForm = () => {
  const [formData, setFormData] = useState({
    nic: '',
    phone: '',
    email: '',
    gasType: '',
    outlet: '',
    deliveryDate: '',
    deliveryTime: '',
    quantity: '1',
    address: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      console.log('Form submitted:', formData);
    } catch {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      // Reset form after 3 seconds on success
      if (submitStatus === 'success') {
        setTimeout(() => {
          setSubmitStatus(null);
          setFormData({
            nic: '',
            phone: '',
            email: '',
            gasType: '',
            outlet: '',
            deliveryDate: '',
            deliveryTime: '',
            quantity: '1',
            address: ''
          });
        }, 3000);
      }
    }
  };

  const inputClasses = "w-full bg-gray-800/50 border border-gray-700/50 rounded-xl p-3 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300 text-gray-200 placeholder-gray-500";
  const labelClasses = "block text-sm font-medium text-gray-300 mb-2";

  const formFields = [
    { name: 'nic', label: 'NIC', type: 'text', icon: <User className="w-5 h-5" />, placeholder: 'Enter your NIC' },
    { name: 'phone', label: 'Phone', type: 'tel', icon: <Phone className="w-5 h-5" />, placeholder: 'Enter your phone number' },
    { name: 'email', label: 'Email', type: 'email', icon: <Mail className="w-5 h-5" />, placeholder: 'Enter your email' },
    { name: 'address', label: 'Delivery Address', type: 'text', icon: <MapPin className="w-5 h-5" />, placeholder: 'Enter delivery address' },
    { name: 'deliveryDate', label: 'Delivery Date', type: 'date', icon: <Calendar className="w-5 h-5" /> },
    { name: 'deliveryTime', label: 'Preferred Time', type: 'time', icon: <Clock className="w-5 h-5" /> }
  ];

  return (
    <m.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center px-4 py-12"
    >
      <m.form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl p-8 bg-gray-900/50 backdrop-blur-xl rounded-3xl border border-gray-800/50 shadow-xl space-y-8"
      >
        {/* Form Header */}
        <div className="text-center mb-8">
          <m.h2 
            className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2"
          >
            Request Gas Delivery
          </m.h2>
          <p className="text-gray-400">Fill in the details below to place your order</p>
        </div>

        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {formFields.map((field) => (
            <div key={field.name} className="relative">
              <label htmlFor={field.name} className={labelClasses}>
                {field.label}
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-gray-400">
                  {field.icon}
                </span>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className={inputClasses}
                  placeholder={field.placeholder}
                  required
                />
              </div>
            </div>
          ))}

          {/* Gas Type Select */}
          <div className="relative">
            <label htmlFor="gasType" className={labelClasses}>Gas Type</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <Gas className="w-5 h-5" />
              </span>
              <select
                id="gasType"
                name="gasType"
                value={formData.gasType}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                <option value="">Select Type</option>
                <option value="Domestic">Domestic</option>
                <option value="Industrial">Industrial</option>
                <option value="Commercial">Commercial</option>
              </select>
            </div>
          </div>

          {/* Quantity Select */}
          <div className="relative">
            <label htmlFor="quantity" className={labelClasses}>Quantity</label>
            <div className="relative">
              <span className="absolute left-3 top-3.5 text-gray-400">
                <Gas className="w-5 h-5" />
              </span>
              <select
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className={inputClasses}
                required
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num} Unit{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <m.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-4 rounded-xl font-semibold text-white shadow-lg flex items-center justify-center gap-2 transition-all duration-300
            ${isSubmitting ? 'bg-gray-600' : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:shadow-blue-500/25'}`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing...
            </>
          ) : submitStatus === 'success' ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Request Submitted!
            </>
          ) : submitStatus === 'error' ? (
            <>
              <AlertCircle className="w-5 h-5" />
              Error Submitting
            </>
          ) : (
            'Submit Request'
          )}
        </m.button>

        {/* Status Message */}
        {submitStatus && (
          <m.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-center p-4 rounded-xl ${
              submitStatus === 'success' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-red-500/20 text-red-400'
            }`}
          >
            {submitStatus === 'success' 
              ? 'Your request has been submitted successfully!' 
              : 'There was an error submitting your request. Please try again.'}
          </m.div>
        )}
      </m.form>
    </m.div>
  );
};

export default RequestForm;
