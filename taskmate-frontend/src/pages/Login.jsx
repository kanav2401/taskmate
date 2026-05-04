import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api/api";
import { setUser } from "../utils/auth";
import { ArrowRight, Mail, Lock, Loader2 } from "lucide-react";
import logoImage from "../assets/logo1.jpg.png";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      const res = await loginUser(form);
      if (res.user) {

        setUser(res.user);

        if (res.user.role === "admin") navigate("/admin");
        else if (res.user.role === "client") navigate("/client-dashboard");
        else navigate("/volunteer-dashboard");

        window.location.reload();
      } else {
        setMessage(res.message || "Login failed");
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">

      <div className="hidden lg:flex w-1/2 relative bg-background border-r border-white/5 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-blue-500/20 z-0" />

        <div className="absolute top-0 left-0 w-full h-full z-10 opacity-30">
          <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-primary rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
          <div className="absolute bottom-[20%] right-[10%] w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-20 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-2 w-fit hover:scale-105 transition-transform">
            <img src={logoImage} alt="TaskMate Logo" className="h-10 w-auto object-contain rounded-xl shadow-xl" />
            <span className="text-2xl font-bold tracking-tight text-foreground">TaskMate</span>
          </Link>

          <div className="mb-20">
            <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight tracking-tight">
              Welcome back to <br/> your <span className="brand-text-gradient">workspace.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-md">
              Log in to manage your tasks, connect with peers, and track your progress securely.
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="flex -space-x-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-12 h-12 rounded-full border-2 border-background bg-secondary flex items-center justify-center opacity-${100 - (i*10)}`}>
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm" />
                  </div>
                ))}
             </div>
             <p className="text-sm font-medium text-muted-foreground">Join 10k+ active users</p>
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
            <h2 className="text-3xl font-bold tracking-tight text-foreground">Sign in</h2>
            <p className="text-muted-foreground">Enter your email and password below to access your account</p>
          </div>

          {message && (
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="space-y-4">
              <div className="space-y-2">
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
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium text-foreground">Password</label>
                  <a href="#" className="text-sm font-medium text-primary hover:underline">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full brand-gradient text-white py-3.5 rounded-xl font-medium flex justify-center items-center gap-2 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Signing in...</>
              ) : (
                <>Sign in <ArrowRight className="w-5 h-5" /></>
              )}
            </button>

          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-primary hover:underline transition-all">
              Sign up
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}
