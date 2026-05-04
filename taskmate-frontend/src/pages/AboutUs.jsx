import { Users, Target, Shield, Zap } from "lucide-react";

export default function AboutUs() {
  return (
    <div className="min-h-screen py-24 bg-background">
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="text-center mb-20 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
             Our Story
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground border-none">
            The Student-First <br className="hidden md:block"/> Freelancing Revolution
          </h1>
          <p className="text-xl text-muted-foreground mx-auto max-w-2xl leading-relaxed">
            TaskMate was born from a simple idea: students need a safe, ethical, and structured way to collaborate, offer skills, and get academic or creative help.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-24">
          <div className="glass-card p-10 rounded-[2rem] bg-gradient-to-br from-primary/5 to-transparent border border-primary/10">
            <div className="w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
              <Target className="w-7 h-7 text-primary"/>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground border-none">Our Mission</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To empower students globally by creating a seamless, transparent platform where peer-to-peer collaboration and task execution is secure, fair, and mutually beneficial.
            </p>
          </div>

          <div className="glass-card p-10 rounded-[2rem] bg-gradient-to-br from-blue-500/5 to-transparent border border-blue-500/10">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/20 flex items-center justify-center mb-6">
              <Shield className="w-7 h-7 text-blue-500"/>
            </div>
            <h3 className="text-2xl font-bold mb-4 text-foreground border-none">Our Vision</h3>
            <p className="text-muted-foreground leading-relaxed text-lg">
              To build the world's most trusted, engaging, and dynamic task economy specifically tailored to the fast-paced lives of university students and ambitious youth.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground border-none">Our Core Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Shield className="w-6 h-6"/>, title: "Trust", desc: "Every transaction is secured in escrow." },
              { icon: <Zap className="w-6 h-6"/>, title: "Growth", desc: "We encourage continuous learning." },
              { icon: <Users className="w-6 h-6"/>, title: "Community", desc: "Built by students, for students." },
              { icon: <Target className="w-6 h-6"/>, title: "Innovation", desc: "Modern tech for modern problems." }
            ].map((val, i) => (
              <div key={i} className="glass-card p-8 rounded-2xl text-center group hover:-translate-y-2 transition-transform duration-300">
                <div className="w-12 h-12 rounded-full brand-gradient mx-auto flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform">
                  {val.icon}
                </div>
                <h4 className="text-xl font-bold text-foreground mb-3">{val.title}</h4>
                <p className="text-muted-foreground text-sm">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
