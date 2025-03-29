
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, ArrowRight, Linkedin, Sparkles, Clock, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Index = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-section').forEach(section => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 12 }
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 15px 35px rgba(0,0,0,0.1)",
      transition: { type: "spring", damping: 8 }
    }
  };

  const backgroundBlur = {
    backgroundImage: "radial-gradient(circle at 50% 0%, rgba(155, 135, 245, 0.1), transparent 60%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none"
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div style={backgroundBlur} />

      {/* Floating elements */}
      <motion.div 
        className="hidden lg:block absolute top-40 -left-16 w-32 h-32 rounded-full bg-gradient-to-r from-indigo-100 to-blue-100 mix-blend-multiply opacity-70"
        animate={{ 
          y: [0, 15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <motion.div 
        className="hidden lg:block absolute bottom-40 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-indigo-50 to-purple-100 mix-blend-multiply opacity-60"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, -5, 0]
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />

      {/* Hero Section */}
      <motion.section 
        className="py-24 px-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block mb-4"
          >
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1 rounded-full inline-block">
              <div className="bg-white dark:bg-gray-900 rounded-full px-4 py-1 flex items-center">
                <Sparkles className="w-4 h-4 text-indigo-500 mr-2" />
                <span className="text-sm font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Simple but powerful
                </span>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl sm:text-6xl font-bold mb-6 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Capture your thoughts,<br />organize your life
          </motion.h1>

          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            A beautifully simple way to keep notes and manage your tasks in one place.
            Focus on what matters with our distraction-free experience.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg">
                <Link to="/notes">
                  <FileText className="mr-2 h-5 w-5" />
                  Start with notes
                </Link>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-lg border-2">
                <Link to="/todo">
                  <CheckSquare className="mr-2 h-5 w-5" />
                  Organize tasks
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Features Section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-white to-gray-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-block mb-3">
              <span className="text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full px-4 py-1.5">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Everything you need, nothing you don't</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A minimalist note-taking experience designed to help you focus on capturing ideas and staying organized.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {/* Feature 1 */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 relative overflow-hidden"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-50 to-transparent rounded-bl-full opacity-70"></div>
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Simple Notes</h3>
              <p className="text-gray-600">
                Create, edit, and organize your notes with a clean and intuitive interface that keeps you focused.
              </p>
            </motion.div>
            
            {/* Feature 2 */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 relative overflow-hidden"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-50 to-transparent rounded-bl-full opacity-70"></div>
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <CheckSquare className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Task Management</h3>
              <p className="text-gray-600">
                Stay organized with a simple to-do list that helps you track your tasks and priorities effectively.
              </p>
            </motion.div>
            
            {/* Feature 3 */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 relative overflow-hidden"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-50 to-transparent rounded-bl-full opacity-70"></div>
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Clock className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Save Time</h3>
              <p className="text-gray-600">
                Quick and responsive interface lets you capture thoughts instantly without interrupting your workflow.
              </p>
            </motion.div>
            
            {/* Feature 4 */}
            <motion.div 
              className="bg-white p-8 rounded-xl shadow-soft border border-gray-100 relative overflow-hidden md:col-span-3 lg:col-span-1 lg:col-start-2"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-green-50 to-transparent rounded-bl-full opacity-70"></div>
              <div className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6">
                <Shield className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is stored securely and never shared with third parties, giving you peace of mind.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Call to Action */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            delay: 0.2 
          }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Begin your journey to a more organized digital life today with our simple yet powerful tool.
          </p>

          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Link to="/notes">
                Get started now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8.41l2.54 2.53a1 1 0 01-1.42 1.42l-3.54-3.54a1 1 0 010-1.41l3.54-3.54a1 1 0 111.42 1.42L13 10.58V16a1 1 0 11-2 0V9a1 1 0 112 0v2.59z" />
            </svg>
            <span>No credit card required</span>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Connect Section */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-indigo-50 to-blue-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              I'm always interested in new opportunities and collaborations.
              Feel free to reach out to me on LinkedIn.
            </p>
          </motion.div>
          
          <motion.div 
            className="flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <motion.a 
              href="https://www.linkedin.com/in/kbor/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-[#0077B5] hover:bg-[#0069a2] text-white px-6 py-3 rounded-lg shadow-md transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="h-6 w-6" />
              <span className="font-medium">Connect on LinkedIn</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
