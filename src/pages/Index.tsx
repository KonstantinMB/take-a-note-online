import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, ArrowRight, Linkedin } from "lucide-react";
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
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
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
      scale: 1.03,
      boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
      transition: { type: "spring", damping: 10 }
    }
  };

  return (
    <div className="min-h-screen">
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight"
            variants={itemVariants}
          >
            Capture your thoughts, organize your life
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            A beautifully simple way to keep notes and manage your tasks in one place.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/notes">
                <FileText className="mr-2 h-5 w-5" />
                Start with notes
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6">
              <Link to="/todo">
                <CheckSquare className="mr-2 h-5 w-5" />
                Organize tasks
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>
      
      <motion.section 
        className="py-16 px-4 bg-gray-50"
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
            transition={{ duration: 0.5 }}
          >
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
              href="https://www.linkedin.com/in/your-profile-url" 
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
      
      <motion.section 
        className="py-16 px-4"
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
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin your journey to a more organized digital life today.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button asChild size="lg" className="rounded-full px-6">
              <Link to="/notes">
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Index;
