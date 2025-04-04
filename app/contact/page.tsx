'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMapMarkerAlt, FaEnvelope, FaInfoCircle } from 'react-icons/fa';
import R2Image from '../components/R2Image';

interface FormData {
  name: string;
  email: string;
  message: string;
  agreement: boolean;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
    agreement: false
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      agreement: e.target.checked
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.message || !formData.agreement) {
      setIsError(true);
      return;
    }
    
    try {
      // Send data to our API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          agreement: formData.agreement
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Reset form and show success message
      setFormData({
        name: '',
        email: '',
        message: '',
        agreement: false
      });
      setIsError(false);
      setIsSubmitted(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsError(true);
    }
  };
  
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        duration: 0.5
      }
    },
    exit: { opacity: 0 }
  };
  
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
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const formElementVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  const mapVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const notificationVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { 
      opacity: 1, 
      y: 0, 
      height: 'auto',
      transition: { 
        duration: 0.3,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      height: 0,
      transition: { 
        duration: 0.2,
        ease: "easeIn"
      }
    }
  };

  return (
    <motion.div 
      className="min-h-screen"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      {/* Header Section with Blue Background */}
      <motion.section 
        className="bg-primary text-white py-12 flex items-center justify-center"
        variants={itemVariants}
      >
        <div className="container mx-auto px-4 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="hidden md:block mb-4"
          >
            <R2Image 
              path="ASCELOGO/ASCE.png"
              alt="SJSU ASCE Logo" 
              className="h-12 md:h-20 w-auto"
              height={80}
            />
          </motion.div>
          <motion.h1 
            className="text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Contact
          </motion.h1>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <a href="/" className="text-white hover:underline">Home</a>
            <span className="mx-2">/</span>
            <span>Contact</span>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Google Map Section */}
      <motion.section
        className="w-full"
        variants={mapVariants}
      >
        <div className="w-full h-[400px]">
          <iframe 
            title="SJSU Map Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3172.3325395957377!2d-121.88296492393588!3d37.33521073559038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808e2db1a4ac2e23%3A0xbdf1a6e633d79779!2sSan%20Jose%20State%20University!5e0!3m2!1sen!2sus!4v1708956720478!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </motion.section>

      {/* Contact Form Section */}
      <motion.section 
        className="bg-gray-100 py-12"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <motion.div
              variants={itemVariants}
              className="bg-white rounded-md shadow border border-gray-200 overflow-hidden"
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <motion.h2 
                  className="text-2xl font-bold text-gray-800 mb-2"
                  variants={itemVariants}
                >
                  We would love to hear from you.
                </motion.h2>
                <motion.p 
                  className="text-gray-600 mb-6"
                  variants={itemVariants}
                >
                  If you are interested in joining us or supporting us let us know!
                </motion.p>
                
                <AnimatePresence>
                  {isSubmitted && (
                    <motion.div 
                      className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <p>Thank you! Your submission has been received and added to our contact database.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <AnimatePresence>
                  {isError && (
                    <motion.div 
                      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
                      variants={notificationVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                    >
                      <p>Oops! Something went wrong while submitting the form. Please check all required fields or try again later.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <form onSubmit={handleSubmit}>
                  <motion.div 
                    className="mb-4"
                    variants={formElementVariants}
                  >
                    <label htmlFor="name" className="block text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Nahom Zemene"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="mb-4"
                    variants={formElementVariants}
                  >
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="sjsu@gmail.com"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </motion.div>
                  
                  <motion.div 
                    className="mb-6"
                    variants={formElementVariants}
                  >
                    <label htmlFor="message" className="block text-gray-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="I want to join Concrete Canoe!"
                      required
                    ></textarea>
                  </motion.div>
                  
                  <motion.div 
                    className="mb-6"
                    variants={formElementVariants}
                  >
                    <div className="flex items-start">
                      <input
                        type="checkbox"
                        id="agreement"
                        name="agreement"
                        checked={formData.agreement}
                        onChange={handleCheckboxChange}
                        className="mt-1 mr-2"
                        required
                      />
                      <label htmlFor="agreement" className="text-sm text-gray-600">
                        I understand the team at SJSU will be contacting me in regards to my submission
                      </label>
                    </div>
                  </motion.div>
                  
                  <motion.button
                    type="submit"
                    className="bg-primary text-white px-6 py-2 rounded-md font-medium hover:bg-primary-dark transition-colors"
                    variants={formElementVariants}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Submit
                  </motion.button>
                </form>
              </div>
            </motion.div>
            
            {/* Contact Information */}
            <motion.div
              variants={itemVariants}
              className="bg-primary text-white rounded-md overflow-hidden"
              whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-8">
                <motion.div 
                  className="mb-8"
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FaMapMarkerAlt className="h-5 w-5 mr-2" />
                    Address
                  </h3>
                  <div className="ml-7">
                    <p>ASCE Student Chapter-San Jose State University</p>
                    <p>Attn: CE Department</p>
                    <p>1 Washington Sq, San Jose, CA 95192</p>
                    <motion.a 
                      href="https://maps.google.com" 
                      className="text-yellow-300 hover:underline mt-2 inline-block"
                      whileHover={{ x: 3 }}
                      transition={{ duration: 0.2 }}
                    >
                      Get directions
                    </motion.a>
                  </div>
                </motion.div>
                
                <motion.div
                  variants={itemVariants}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <FaInfoCircle className="h-5 w-5 mr-2" />
                    Need Help?
                  </h3>
                  <div className="ml-7">
                    <p>We can assist you Monday-Friday, 10:00 am - 6:00 pm PST</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
} 