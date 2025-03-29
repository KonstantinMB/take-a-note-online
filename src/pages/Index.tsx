
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

  const backgroundBlur: React.CSSProperties = {
    backgroundImage: "radial-gradient(circle at 50% 0%, rgba(155, 135, 245, 0.1), transparent 60%)",
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    zIndex: -1,
    pointerEvents: "none" as const
  };

  // Text animation variants
  const textRevealVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 50, delay: 0.2 }
    }
  };

  const headingCharVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.05, duration: 0.5 }
    })
  };

  // Split heading text into characters for animation
  const headingText1 = "Capture your thoughts,";
  const headingText2 = "organize your life";
  const headingChars1 = headingText1.split("");
  const headingChars2 = headingText2.split("");

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

      <motion.div
        className="hidden lg:block absolute top-60 right-16 w-24 h-24 rounded-full bg-gradient-to-r from-blue-50 to-green-50 mix-blend-multiply opacity-80"
        animate={{
          x: [0, 15, 0],
          y: [0, -10, 0]
        }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
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

          <div className="mb-6 overflow-hidden">
            <motion.h1 className="text-4xl sm:text-6xl font-bold tracking-tight relative inline-block">
              <span className="sr-only">{headingText1}</span>
              <span aria-hidden="true" className="block">
                {headingChars1.map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i}
                    variants={headingCharVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
              <span aria-hidden="true" className="block mt-2">
                {headingChars2.map((char, i) => (
                  <motion.span
                    key={i}
                    custom={i + 5}
                    variants={headingCharVariants}
                    initial="hidden"
                    animate="visible"
                    className="inline-block bg-gradient-to-r from-gray-900 via-purple-800 to-gray-900 bg-clip-text text-transparent"
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </span>
            </motion.h1>
          </div>

          <motion.p 
            className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto"
            variants={textRevealVariants}
            initial="hidden"
            animate="visible"
          >
            A beautifully simple way to keep notes and manage your tasks in one place.
            Focus on what matters with our distraction-free experience.
          </motion.p>

          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={itemVariants}
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
              variants={itemVariants}
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
            <motion.div 
              className="inline-block mb-3"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <span className="text-sm font-medium bg-indigo-50 text-indigo-700 rounded-full px-4 py-1.5">Features</span>
            </motion.div>
            <motion.h2 
              className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              viewport={{ once: true }}
            >
              Everything you need, nothing you don't
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.7 }}
              viewport={{ once: true }}
            >
              A minimalist note-taking experience designed to help you focus on capturing ideas and staying organized.
            </motion.p>
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
              <motion.div 
                className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <FileText className="h-7 w-7 text-primary" />
              </motion.div>
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
              <motion.div 
                className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <CheckSquare className="h-7 w-7 text-primary" />
              </motion.div>
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
              <motion.div 
                className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Clock className="h-7 w-7 text-primary" />
              </motion.div>
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
              <motion.div 
                className="w-14 h-14 bg-primary/5 rounded-full flex items-center justify-center mb-6"
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Shield className="h-7 w-7 text-primary" />
              </motion.div>
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
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Ready to get started?
          </motion.h2>
          <motion.p 
            className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Begin your journey to a more organized digital life today with our simple yet powerful tool.
          </motion.p>

          <motion.div
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
          >
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-lg shadow-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
              <Link to="/notes">
                Get started now
                <motion.div
                  animate={{
                    x: [0, 4, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    repeatType: "loop",
                  }}
                >
                  <ArrowRight className="ml-2 h-5 w-5" />
                </motion.div>
              </Link>
            </Button>
          </motion.div>

          <motion.div 
            className="mt-8 text-sm text-gray-500 flex items-center justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.svg 
              className="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 24 24"
              animate={{ rotate: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zm0-2a8 8 0 100-16 8 8 0 000 16zm1-8.41l2.54 2.53a1 1 0 01-1.42 1.42l-3.54-3.54a1 1 0 010-1.41l3.54-3.54a1 1 0 111.42 1.42L13 10.58V16a1 1 0 11-2 0V9a1 1 0 112 0v2.59z" />
            </motion.svg>
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
            <motion.h2 
              className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Let's Connect
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              I'm always interested in new opportunities and collaborations.
              Feel free to reach out to me on LinkedIn.
            </motion.p>
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
              whileHover={{ scale: 1.05, boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)" }}
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
