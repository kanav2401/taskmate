import { Link, useNavigate } from "react-router-dom";
import { isLoggedIn, removeUser, getUser } from "../utils/auth";
import NotificationBell from "./NotificationBell";
import { useEffect, useState } from "react";
import socket from "../utils/socket";
import { BASE_URL } from "../api/api";
import { Menu, X, LayoutDashboard, Search, LogOut, ShieldCheck, UserCircle, Briefcase } from "lucide-react";
import logoImage from "../assets/logo1.jpg.png";

export default function Navbar() {
  const navigate = useNavigate();
  const user = getUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  /* ===============================
     REGISTER USER FOR NOTIFICATIONS
  =============================== */

  useEffect(() => {
    if (user?._id) {
      socket.emit("registerUser", user._id);
    }
  }, [user]);

  /* ===============================
     LOGOUT
  =============================== */

  const handleLogout = async () => {
    await fetch(`${BASE_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    removeUser();
    navigate("/");
    window.location.reload();
  };

  /* ===============================
     UI
  =============================== */

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/10 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 transition-transform hover:scale-105">
              <img src={logoImage} alt="TaskMate Logo" className="h-9 w-auto object-contain rounded-md shadow-lg" />
              <span className="text-2xl font-bold tracking-tight text-foreground hidden sm:block">TaskMate</span>
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex flex-1 items-center justify-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            
            {/* VOLUNTEER LINKS */}
            {isLoggedIn() && user?.role === "volunteer" && (
              <>
                <Link to="/browse" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"><Search className="w-4 h-4"/> Browse Tasks</Link>
                <Link to="/volunteer-dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
              </>
            )}

            {/* CLIENT LINKS */}
            {isLoggedIn() && user?.role === "client" && (
              <Link to="/client-dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"><LayoutDashboard className="w-4 h-4"/> Dashboard</Link>
            )}

            {/* ADMIN LINK */}
            {isLoggedIn() && user?.role === "admin" && (
              <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4"/> Admin
              </Link>
            )}
          </div>

          {/* RIGHT SIDE (AUTH & NOTIFICATIONS) */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn() && <NotificationBell />}
            
            {!isLoggedIn() ? (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2">Log in</Link>
                <Link to="/register" className="text-sm font-medium brand-gradient text-white px-4 py-2 rounded-full shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all">Get Started</Link>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/wallet" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2 px-2 py-1 bg-white/5 rounded-md border border-white/5">
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                    <UserCircle className="w-4 h-4 text-primary" />
                  </div>
                  <span className="hidden lg:block truncate max-w-[100px]">{user?.name || 'Profile'}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors"
                  aria-label="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <div className="flex md:hidden items-center gap-4">
            {isLoggedIn() && <NotificationBell />}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-background/95 backdrop-blur-xl absolute top-16 left-0 w-full shadow-2xl animate-accordion-down">
          <div className="flex flex-col space-y-4 p-6">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground">Home</Link>
            
            {isLoggedIn() && user?.role === "volunteer" && (
              <>
                <Link to="/browse" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground flex items-center gap-2"><Search className="w-5 h-5 text-primary"/> Browse Tasks</Link>
                <Link to="/volunteer-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-primary"/> Dashboard</Link>
              </>
            )}

            {isLoggedIn() && user?.role === "client" && (
              <Link to="/client-dashboard" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground flex items-center gap-2"><LayoutDashboard className="w-5 h-5 text-primary"/> Dashboard</Link>
            )}

            {isLoggedIn() && user?.role === "admin" && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-primary flex items-center gap-2"><ShieldCheck className="w-5 h-5"/> Admin Panel</Link>
            )}

            <div className="h-px w-full bg-white/10 my-2" />

            {!isLoggedIn() ? (
              <div className="flex flex-col gap-3">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground">Log in</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="text-center text-lg font-medium brand-gradient text-white px-4 py-3 rounded-xl">Get Started</Link>
              </div>
            ) : (
               <div className="flex flex-col gap-4">
                 <Link to="/wallet" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-foreground flex items-center gap-2">
                   <UserCircle className="w-5 h-5 text-primary" /> My Profile / Wallet
                 </Link>
                 <button 
                  onClick={handleLogout}
                  className="text-left text-lg font-medium text-destructive flex items-center gap-2"
                 >
                  <LogOut className="w-5 h-5" /> Logout
                </button>
               </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}