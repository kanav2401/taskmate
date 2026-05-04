import { useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getUser } from "../utils/auth";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { 
  ArrowRight, ShieldCheck, Zap, Users, Star,
  CheckCircle2, Clock, Wallet
} from "lucide-react";
import bgVideo from "../assets/video.mp4.mp4";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const user = getUser();

  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-element",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
      );

      gsap.fromTo(
        ".feature-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
          }
        }
      );

      gsap.fromTo(
        ".step-card",
        { x: -50, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: howItWorksRef.current,
            start: "top 75%",
          }
        }
      );

      gsap.fromTo(
        ctaRef.current,
        { scale: 0.95, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
          }
        }
      );
    });

    return () => ctx.revert(); 
  }, []);

  const handleFindVolunteer = () => {
    if (!user) return navigate("/register?role=client");
    user.role === "client" ? navigate("/post-task") : navigate("/browse");
  };

  const handleWorkVolunteer = () => {
    if (!user) return navigate("/register?role=volunteer");
    user.role === "volunteer" ? navigate("/browse") : navigate("/client-dashboard");
  };

  return (
    <div className="flex flex-col min-h-screen">

      <section ref={heroRef} className="relative w-full h-[60vh] flex items-center justify-center overflow-hidden bg-background">
        <div className="absolute inset-0 w-full h-full z-0">
          <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background z-10" />
          <video 
            autoPlay 
            loop 
            muted 
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={bgVideo} type="video/mp4" />
          </video>
        </div>
      </section>

      <section ref={heroTextRef} className="w-full py-16 bg-background relative z-20 text-center border-b border-white/5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hero-element">
            <span className="flex h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-muted-foreground">The premier student freelancing platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 hero-element text-foreground">
            Connect. Collaborate. <br className="hidden md:block" />
            <span className="brand-text-gradient">Complete.</span>
          </h1>

          <p className="mt-4 text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 hero-element">
            TaskMate is the ethical bridge connecting ambitious students and talented volunteers through a secure, deadline-driven ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 hero-element">
            <button 
              onClick={handleFindVolunteer}
              className="w-full sm:w-auto px-8 py-4 rounded-full brand-gradient text-white font-semibold text-lg shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              Post a Task <ArrowRight className="w-5 h-5" />
            </button>
            <button 
              onClick={handleWorkVolunteer}
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              Become a Volunteer
            </button>
          </div>
        </div>
      </section>

      <section className="py-12 border-y border-white/5 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: "Active Users", value: "10k+" },
              { label: "Completed Tasks", value: "45k+" },
              { label: "Average Rating", value: "4.9/5" },
              { label: "Secure Payments", value: "100%" },
            ].map((stat, i) => (
              <div key={i} className="space-y-2">
                <h3 className="text-4xl font-bold brand-text-gradient">{stat.value}</h3>
                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={featuresRef} className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6 text-foreground">
              Why Choose TaskMate?
            </h2>
            <p className="text-lg text-muted-foreground">
              Built specifically for students, offering a fair, transparent, and structured environment for academic and creative collaborations.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <ShieldCheck className="w-8 h-8 text-primary" />,
                title: "Transparent & Secure",
                desc: "Clear upfront budgets and secure milestone tracking. No hidden fees or surprises."
              },
              {
                icon: <Clock className="w-8 h-8 text-primary" />,
                title: "Deadline Accountability",
                desc: "Strict deadline management ensures your tasks are always completed on time, every time."
              },
              {
                icon: <Users className="w-8 h-8 text-primary" />,
                title: "Role-Based Ecosystem",
                desc: "Dedicated interfaces for both clients and volunteers, optimized for your specific workflow."
              }
            ].map((feature, i) => (
              <div key={i} className="feature-card glass-card p-8 rounded-2xl flex flex-col items-start hover:-translate-y-2 transition-transform duration-300">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} className="py-24 bg-secondary/30 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                How TaskMate Works
              </h2>
              <p className="text-lg text-muted-foreground">
                A streamlined process designed to get your tasks done efficiently while ensuring quality and reliability.
              </p>

              <div className="pt-8 space-y-8">
                {[
                  { title: "Post a Task", desc: "Define your requirements, set a fair budget, and establish a deadline.", icon: <CheckCircle2 className="w-6 h-6 text-primary"/> },
                  { title: "Connect with Volunteers", desc: "Review applications from verified student volunteers and pick the best fit.", icon: <Users className="w-6 h-6 text-primary"/> },
                  { title: "Collaborate & Complete", desc: "Use our built-in tools to communicate, review work, and finalize the payment.", icon: <Zap className="w-6 h-6 text-primary"/> }
                ].map((step, i) => (
                  <div key={i} className="step-card flex gap-6 items-start">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full border border-primary/30 flex items-center justify-center bg-background relative z-10">
                      {step.icon}
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold mb-2 text-foreground">{step.title}</h4>
                      <p className="text-muted-foreground">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/2 w-full step-card">
              <div className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden glass-card p-2">
                <div className="w-full h-full bg-background rounded-xl overflow-hidden relative">
                   <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                   <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />

                   <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl bg-background/80 backdrop-blur-md border border-white/10 flex items-center gap-4">
                     <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                       <Wallet className="w-5 h-5 text-primary"/>
                     </div>
                     <div>
                       <p className="text-sm font-medium text-foreground">Task Completed!</p>
                       <p className="text-xs text-muted-foreground">Payment secured in escrow</p>
                     </div>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div ref={ctaRef} className="max-w-4xl mx-auto text-center glass-card p-12 md:p-20 rounded-[3rem] relative overflow-hidden">
            <div className="absolute inset-0 brand-gradient opacity-10" />
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-6 relative z-10">
              Ready to elevate your <br/> academic journey?
            </h2>
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto relative z-10">
              Join thousands of students on TaskMate today. Whether you need help or want to offer your skills, your community is waiting.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
              <Link to="/register" className="px-8 py-4 rounded-full brand-gradient text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all">
                Get Started for Free
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
