import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const faqs = [
  {
    category: "General",
    questions: [
      { q: "What is TaskMate?", a: "TaskMate is an ethical student freelancing platform that connects students needing help with verified volunteers offering their skills." },
      { q: "Is TaskMate free to use?", a: "Signing up and browsing tasks is 100% free. Payments are securely held in escrow only when a task is awarded, and TaskMate takes a small standard platform fee to maintain servers." },
    ]
  },
  {
    category: "For Clients",
    questions: [
      { q: "How do I post a task?", a: "Click on 'Post a Task' from your dashboard or homepage. Fill out the requirements, deadline, and your budget, then publish it for volunteers to see." },
      { q: "What happens if a volunteer misses the deadline?", a: "TaskMate uses a robust deadline management system. If a volunteer fails to deliver on time without prior communication, you are eligible for a full refund." },
      { q: "How are payments handled?", a: "When you award a task, the budget is held securely in escrow. It is only released to the volunteer once you review and approve the completed work." }
    ]
  },
  {
    category: "For Volunteers",
    questions: [
      { q: "How do I start earning?", a: "Register as a volunteer, complete your profile, and start browsing available tasks. When you find one that matches your skillset, submit an application detailing why you're the best fit." },
      { q: "How do I get paid?", a: "Once the client approves your submitted work, the escrowed funds are instantly released to your TaskMate wallet. You can withdraw them to your bank account anytime." }
    ]
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState({});

  const toggleItem = (categoryId, index) => {
    const key = `${categoryId}-${index}`;
    setOpenItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
             Support Center
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-4 border-none">Frequently Asked Questions</h1>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about TaskMate. Can't find the answer? <Link to="/contact" className="text-primary hover:underline">Contact our support team.</Link>
          </p>
        </div>

        <div className="space-y-12">
          {faqs.map((group, categoryId) => (
            <div key={categoryId} className="space-y-6">
              <h2 className="text-2xl font-semibold text-foreground border-b border-white/10 pb-2">{group.category}</h2>
              <div className="space-y-4">
                {group.questions.map((item, index) => {
                  const key = `${categoryId}-${index}`;
                  const isOpen = openItems[key];

                  return (
                    <div 
                      key={index} 
                      className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'ring-1 ring-primary/30 bg-white/10' : ''}`}
                    >
                      <button 
                        onClick={() => toggleItem(categoryId, index)}
                        className="w-full px-6 py-5 text-left flex items-center justify-between focus:outline-none"
                      >
                        <span className="text-lg font-medium text-foreground pr-8">{item.q}</span>
                        <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>

                      <div 
                        className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}
                      >
                        <div className="px-6 pb-6 text-muted-foreground leading-relaxed border-t border-white/5 pt-4 mt-2">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
