
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, CheckSquare, ArrowRight, Linkedin, Rocket, Coffee, Sparkles, Heart, Star } from "lucide-react";
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
      {/* Hero section with gradient background */}
      <motion.section 
        className="py-24 px-4 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Decorative shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="absolute top-20 left-[10%] w-64 h-64 bg-pink-300/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.2, 0.3]
            }}
            transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
          />
          <motion.div 
            className="absolute bottom-20 right-[10%] w-72 h-72 bg-blue-300/20 rounded-full blur-3xl"
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.3, 0.2] 
            }}
            transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 1 }}
          />
        </div>

        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-block mb-4 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm"
            variants={itemVariants}
          >
            <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
              <Sparkles className="h-4 w-4" />
              Simple, yet powerful note-taking
            </span>
          </motion.div>
          
          <motion.h1 
            className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
            variants={itemVariants}
          >
            Capture your thoughts, organize your life
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            A beautifully simple way to keep notes and manage your tasks in one place, designed to help you stay focused and organized.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mb-12"
            variants={itemVariants}
          >
            <Button asChild size="lg" className="rounded-full px-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md">
              <Link to="/notes">
                <FileText className="mr-2 h-5 w-5" />
                Start with notes
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 border-2 hover:bg-gray-50/50">
              <Link to="/todo">
                <CheckSquare className="mr-2 h-5 w-5" />
                Organize tasks
              </Link>
            </Button>
          </motion.div>
          
          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
              alt="Person using the app" 
              className="w-full max-w-2xl rounded-2xl shadow-2xl"
            />
          </motion.div>
        </motion.div>
      </motion.section>
      
      {/* Features section with cards */}
      <motion.section 
        className="py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Everything you need, nothing you don't</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A minimalist note-taking experience designed to help you focus on what matters most.
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
              className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-soft border border-blue-100"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <FileText className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Simple Notes</h3>
              <p className="text-gray-600">
                Create, edit, and organize your notes with a clean and intuitive interface that keeps you focused.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-white to-purple-50 p-8 rounded-2xl shadow-soft border border-purple-100"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <CheckSquare className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Task Management</h3>
              <p className="text-gray-600">
                Stay organized with a simple to-do list that helps you track your tasks and celebrate completing them.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-white to-pink-50 p-8 rounded-2xl shadow-soft border border-pink-100"
              variants={featureCardVariants}
              whileHover="hover"
            >
              <div className="w-14 h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-6">
                <Star className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is stored securely and never shared with third parties, giving you peace of mind.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Testimonial section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div whileHover={{ scale: 1.1 }} className="inline-block mb-4">
              <Heart className="h-12 w-12 text-pink-500 mx-auto" />
            </motion.div>
            <h2 className="text-3xl font-bold mb-6">Why people love our app</h2>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "This app has transformed how I organize my thoughts. The clean interface keeps me focused and the task management is simple yet powerful."
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">JD</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">Jane Doe</h4>
                    <p className="text-sm text-gray-500">Product Designer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
                <p className="text-gray-700 mb-4">
                  "I've tried many note apps, but this one strikes the perfect balance between simplicity and functionality. The confetti when completing tasks is so satisfying!"
                </p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 font-semibold">JS</span>
                  </div>
                  <div className="ml-3">
                    <h4 className="font-medium text-gray-900">John Smith</h4>
                    <p className="text-sm text-gray-500">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.section>
      
      {/* LinkedIn connection section */}
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
            <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Let's Connect</h2>
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
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#0077B5] to-[#0069a2] text-white px-8 py-4 rounded-xl shadow-lg"
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}
              whileTap={{ scale: 0.95 }}
            >
              <Linkedin className="h-6 w-6" />
              <span className="font-medium">Connect on LinkedIn</span>
            </motion.a>
          </motion.div>
        </div>
      </motion.section>
      
      {/* CTA section */}
      <motion.section 
        className="py-20 px-4 bg-gradient-to-b from-white to-purple-50"
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
            className="inline-block mb-6"
            whileHover={{ rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <Rocket className="h-12 w-12 text-indigo-600 mx-auto" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin your journey to a more organized digital life today. It's free to start!
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button asChild size="lg" className="rounded-xl px-8 py-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg text-lg h-auto">
              <Link to="/notes">
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
          
          <motion.div 
            className="mt-12 flex items-center justify-center text-gray-500 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Coffee className="h-4 w-4 mr-2" />
            <p>Made with care for productivity enthusiasts</p>
          </motion.div>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Index;
