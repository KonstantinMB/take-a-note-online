
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, ArrowRight, Linkedin, Sparkles, Rocket, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Index = () => {
  // Improved intersection observer setup for smoother animations
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0');
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -100px 0px" });
    
    document.querySelectorAll('.animate-section').forEach(section => {
      section.classList.add('opacity-0');
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

  // Enhanced animation variants for smoother transitions
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 80, damping: 17 }
    }
  };

  const featureCardVariants = {
    hidden: { opacity: 0, scale: 0.92 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { type: "spring", damping: 12 }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
      transition: { type: "spring", damping: 10 }
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Hero Section with Enhanced Animations - Fixed positioning */}
      <motion.section 
        className="py-16 md:py-24 px-4 relative bg-gradient-to-b from-white to-gray-50 min-h-[80vh] flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
      >
        <motion.div 
          className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          {Array.from({ length: 40 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary"
              style={{
                width: Math.random() * 60 + 10,
                height: Math.random() * 60 + 10,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [0, 1],
                y: [0, Math.random() * 30 - 15],
                opacity: [0, 0.6, 0], 
              }}
              transition={{ 
                duration: Math.random() * 8 + 6,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10 w-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center px-3 py-1 mb-6 rounded-full text-sm font-medium bg-primary/5 text-primary border border-primary/10"
            variants={itemVariants}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            <span>Streamline your productivity</span>
          </motion.div>
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"
            variants={itemVariants}
          >
            Capture your thoughts, organize your life
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            A beautifully simple way to keep notes and manage your tasks in one place.
            Focus on what matters most to you.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button asChild size="lg" className="rounded-full px-6 shadow-md">
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
              <Button asChild variant="outline" size="lg" className="rounded-full px-6 shadow-sm">
                <Link to="/todo">
                  <CheckSquare className="mr-2 h-5 w-5" />
                  Organize tasks
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Features Section with Better Card Effects */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="inline-flex items-center px-3 py-1 mb-4 rounded-full text-sm font-medium bg-primary/5 text-primary border border-primary/10"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Target className="w-4 h-4 mr-2" />
              <span>Core Features</span>
            </motion.div>
            <h2 className="text-3xl font-bold mb-4">Everything you need, nothing you don't</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A minimalist note-taking experience designed to help you focus.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-soft border border-gray-100"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Simple Notes</h3>
              <p className="text-gray-600">
                Create, edit, and organize your notes with a clean and intuitive interface.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-soft border border-gray-100"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Task Management</h3>
              <p className="text-gray-600">
                Stay organized with a simple to-do list to track your tasks and priorities.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-xl shadow-soft border border-gray-100"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is stored securely and never shared with third parties.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* CTA Section with Improved Style */}
      <motion.section 
        className="py-24 px-4 bg-gradient-to-r from-gray-50 to-gray-100"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ 
            type: "spring", 
            stiffness: 50, 
            delay: 0.2 
          }}
        >
          <motion.div 
            className="inline-flex items-center px-3 py-1 mb-6 rounded-full text-sm font-medium bg-primary/5 text-primary border border-primary/10"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Rocket className="w-4 h-4 mr-2" />
            <span>Get Started Today</span>
          </motion.div>
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin your journey to a more organized digital life today.
            Sign up now and transform how you manage your notes and tasks.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-md">
              <Link to="/notes">
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Connect Section with Enhanced Visuals */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-white to-indigo-50 relative"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: 0.03, zIndex: 0 }}
        >
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-primary rounded-full"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                borderRadius: "50%",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div 
            className="text-center mb-10"
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
