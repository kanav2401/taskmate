import { useState } from "react";
import { registerUser } from "../api/api";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Mail, Lock, User, Briefcase, Loader2 } from "lucide-react";
import logoImage from "../assets/logo1.jpg.png";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: "", role: "client",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await registerUser(form);
      if (res.message) {
        setMessage(res.message);
        setSuccess(true);
        setTimeout(() => navigate('/login'), 2000); 
      } else {
        setMessage("Registration failed. Please try again.");
      }
    } catch (error) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">

      <div className="hidden lg:flex w-1/2 relative bg-background border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 via-background to-purple-600/20 z-0" />

        <div className="absolute top-0 left-0 w-full h-full z-10 opacity-30">
          <div className="absolute top-[30%] left-[20%] w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-[10%] right-[20%] w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="relative z-20 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2 w-fit hover:scale-105 transition-transform">
            <img src={logoImage} alt="TaskMate Logo" className="h-10 w-auto object-contain rounded-xl shadow-xl" />
            <span className="text-2xl font-bold tracking-tight text-foreground">TaskMate</span>
          </Link>

          <div className="mb-20">
            <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Start your journey <br/> with us <span className="brand-text-gradient">today.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Create a free account to get help with your tasks or offer your skills to peers.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex -space-x-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-background bg-secondary flex items-center justify-center opacity-${100 - (i*10)}`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm" />
                  </div>
                ))}
             </div>
             <p className="text-sm font-medium text-muted-foreground">Trusted by students worldwide</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative z-10">

        <div className="absolute top-8 left-8 lg:hidden">
          <Link to="/" className="flex items-center gap-2 w-fit">
            <img src={logoImage} alt="TaskMate Logo" className="h-8 w-auto object-contain rounded-lg shadow-lg" />
            <span className="text-xl font-bold tracking-tight text-foreground">TaskMate</span>
          </Link>
        </div>

        <div className="w-full max-w-md space-y-8">

          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Create an account</h2>
            <p className="text-muted-foreground">Enter your details below to get started</p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${success ? 'bg-primary/10 border-primary/20 text-primary' : 'bg-destructive/10 border-destructive/20 text-destructive'}`}>
              <div className={`w-2 h-2 rounded-full ${success ? 'bg-primary' : 'bg-destructive'} animate-pulse`} />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div className="space-y-4">

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none border-none">
                    <User className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all border-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 border-none">
                <label className="text-sm font-medium text-foreground">Email</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <div className="relative border-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all border-none"
                    minLength="6"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 border-none">
                <label className="text-sm font-medium text-foreground">I want to...</label>
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => setForm({...form, role: 'client'})}
                    className={`flex items-center justify-center gap-2 py-3 border-none rounded-xl border text-sm font-medium transition-all ${form.role === 'client' ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'}`}
                  >
                    <Briefcase className="w-4 h-4"/> Post Tasks
                  </button>
                  <button 
                    type="button"
                    onClick={() => setForm({...form, role: 'volunteer'})}
                    className={`flex items-center justify-center gap-2 py-3 border-none rounded-xl border text-sm font-medium transition-all ${form.role === 'volunteer' ? 'bg-primary/10 border-primary text-primary shadow-sm' : 'bg-secondary/50 border-border text-muted-foreground hover:bg-secondary'}`}
                  >
                    <User className="w-4 h-4"/> Earning Tasks
                  </button>
                </div>
              </div>

            </div>

            <button
              type="submit"
              disabled={isLoading || success}
              className="w-full brand-gradient border-none text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0 mt-6"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</>
              ) : success ? (
                "Account Created! Redirecting..."
              ) : (
                <>Sign up <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

          </form>

          <p className="text-center text-sm text-muted-foreground border-none">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary hover:underline transition-all">
              Sign in
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
