
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, ArrowRight, Sparkles, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const Index = () => {
  const [activeSection, setActiveSection] = useState(0);

  // Interactive animation for sections
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          entry.target.classList.remove('opacity-0');
          
          // Get the section index from data attribute
          const sectionIndex = parseInt(entry.target.getAttribute('data-section-index') || '0');
          setActiveSection(sectionIndex);
        }
      });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-section').forEach((section, index) => {
      section.classList.add('opacity-0');
      section.setAttribute('data-section-index', index.toString());
      observer.observe(section);
    });
    
    return () => observer.disconnect();
  }, []);

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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const featureCards = [
    {
      icon: <FileText className="h-6 w-6 text-primary" />,
      emoji: "📝",
      title: "Simple Notes",
      description: "Create, edit, and organize your notes with a clean and intuitive interface."
    },
    {
      icon: <CheckSquare className="h-6 w-6 text-primary" />,
      emoji: "✅",
      title: "Task Management",
      description: "Stay organized with a simple to-do list to track your tasks and priorities."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      emoji: "🔒",
      title: "Secure & Private",
      description: "Your data is stored securely and never shared with third parties."
    }
  ];

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Hero section */}
      <motion.section 
        className="py-20 px-4 relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-transparent -z-10" />
        
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block mb-4 px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-medium">
              ✨ Organize your digital life ✨
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-700 to-blue-500">
              Capture your thoughts, organize your life
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              A beautifully simple way to keep notes and manage your tasks in one place. 
              Start today and feel the difference! 🚀
            </p>
          </motion.div>
          
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Button asChild size="lg" className="rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              <Link to="/notes">
                <FileText className="mr-2 h-5 w-5" />
                Start with notes
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-6 border-2 hover:bg-gray-50">
              <Link to="/todo">
                <CheckSquare className="mr-2 h-5 w-5" />
                Organize tasks
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
      
      {/* Features section */}
      <section className="py-16 px-4 bg-gray-50 relative">
        <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-white to-transparent -z-0" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block mb-3 px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium">
                🛠️ Powerful Features
              </span>
              <h2 className="text-3xl font-bold mb-4">Everything you need, nothing you don't</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                A minimalist note-taking experience designed to help you focus and be productive.
              </p>
            </motion.div>
          </div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {featureCards.map((feature, index) => (
              <motion.div 
                key={index}
                className="animate-section bg-white p-6 rounded-xl shadow-soft border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                variants={itemVariants}
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mr-3">
                    {feature.icon}
                  </div>
                  <span className="text-2xl">{feature.emoji}</span>
                </div>
                <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Testimonial section */}
      <motion.section 
        className="py-16 px-4 bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block mb-3 px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium">
            💙 Made with love
          </span>
          <h2 className="text-3xl font-bold mb-8">Organize your thoughts, simplify your life</h2>
          
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl border border-purple-100 shadow-soft">
            <p className="text-lg italic text-gray-700 mb-6">
              "This app has completely transformed how I organize my daily tasks and important notes. 
              The clean interface makes it a joy to use every day!"
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold mr-3">
                A
              </div>
              <div className="text-left">
                <p className="font-medium">Alex Chen</p>
                <p className="text-sm text-gray-500">Product Designer</p>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* CTA section */}
      <motion.section 
        className="py-16 px-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Begin your journey to a more organized digital life today. It's free! ✨
            </p>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Button asChild size="lg" className="rounded-full px-8 py-6 bg-white text-purple-600 hover:bg-gray-100 shadow-lg">
              <Link to="/auth">
                Get started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Index;
