
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText, CheckSquare, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const Index = () => {
  // Interactive animation for sections
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

  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 tracking-tight">
            Capture your thoughts, organize your life
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            A beautifully simple way to keep notes and manage your tasks in one place.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
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
          </div>
        </div>
      </section>
      
      {/* Features section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Everything you need, nothing you don't</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A minimalist note-taking experience designed to help you focus.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="animate-section bg-white p-6 rounded-xl shadow-soft border border-gray-100">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Simple Notes</h3>
              <p className="text-gray-600">
                Create, edit, and organize your notes with a clean and intuitive interface.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="animate-section bg-white p-6 rounded-xl shadow-soft border border-gray-100">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <CheckSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Task Management</h3>
              <p className="text-gray-600">
                Stay organized with a simple to-do list to track your tasks and priorities.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="animate-section bg-white p-6 rounded-xl shadow-soft border border-gray-100">
              <div className="w-12 h-12 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-2">Secure & Private</h3>
              <p className="text-gray-600">
                Your data is stored securely and never shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Begin your journey to a more organized digital life today.
          </p>
          <Button asChild size="lg" className="rounded-full px-6">
            <Link to="/notes">
              Get started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
