// src/pages/Home.jsx
import { m } from 'framer-motion';
import Hero from '../components/Hero';

const Home = () => {
  return (
    <m.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Hero />
      {/* Add more sections here as needed */}
    </m.div>
  );
};

export default Home;
