import { Link } from "react-router-dom";
import { Twitter, Instagram, Linkedin, Github } from "lucide-react";
import logoImage from "../assets/logo1.jpg.png";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          
          {/* BRAND */}
          <div className="md:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-3">
              <img src={logoImage} alt="TaskMate Logo" className="h-10 w-auto object-contain rounded-md shadow-lg" />
              TaskMate
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              A platform connecting students and volunteers for ethical academic help. Empowering collaboration and growth.
            </p>
          </div>

          {/* PLATFORM LINKS */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Platform</h3>
            <ul className="space-y-3">
              <li><Link to="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Tasks</Link></li>
              <li><Link to="/post-task" className="text-sm text-muted-foreground hover:text-primary transition-colors">Post Assignment</Link></li>
              <li><Link to="/register" className="text-sm text-muted-foreground hover:text-primary transition-colors">Become Volunteer</Link></li>
              <li><Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* SUPPORT */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex items-center gap-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all hover:-translate-y-1">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all hover:-translate-y-1">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all hover:-translate-y-1">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-muted-foreground hover:bg-primary/20 hover:text-primary transition-all hover:-translate-y-1">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground text-center md:text-left">
            © {new Date().getFullYear()} TaskMate. All rights reserved.
          </p>
          <div className="flex gap-6">
             <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy</Link>
             <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}