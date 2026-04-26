import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import RatingDisplay from "../components/RatingDisplay";
import { User, Mail, Star, ArrowLeft, ShieldCheck, Award } from "lucide-react";

export default function VolunteerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [volunteer, setVolunteer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVolunteer();
  }, [id]);

  const fetchVolunteer = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/${id}`, { credentials: "include" });
      const data = await res.json();
      setVolunteer(data);
    } catch (err) {
      console.error("Failed to load volunteer");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
      <div className="min-h-screen pt-32 pb-12 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
  );

  if (!volunteer) return (
      <div className="min-h-screen pt-32 pb-12 flex justify-center items-center">
          <div className="glass-card p-10 rounded-3xl text-center border-destructive/20">
              <h2 className="text-2xl font-bold text-foreground mb-2">User Not Found</h2>
              <button onClick={() => navigate(-1)} className="mt-6 brand-gradient text-white px-6 py-2 rounded-xl">Go Back</button>
          </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-background pt-24 pb-12 px-4 flex items-start justify-center">
      <div className="w-full max-w-2xl">
        
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-6 group border-none bg-transparent">
           <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
        </button>

        <div className="glass-card rounded-[2rem] p-8 md:p-12 relative overflow-hidden border-none shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8 border-b border-border pb-8 mb-8">
                <div className="w-32 h-32 rounded-3xl bg-secondary flex items-center justify-center border border-border shrink-0 shadow-inner relative">
                    <span className="text-5xl font-bold text-primary uppercase">{volunteer.name?.charAt(0)}</span>
                    <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-1.5 rounded-full border-4 border-background"><ShieldCheck className="w-4 h-4"/></div>
                </div>
                <div className="text-center md:text-left">
                    <h1 className="text-3xl font-extrabold text-foreground mb-2 shadow-none border-none m-0">{volunteer.name}</h1>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-4">
                        <Award className="w-3.5 h-3.5" /> Volunteer
                    </div>
                    <div className="flex items-center justify-center md:justify-start gap-2 text-muted-foreground text-sm">
                        <Mail className="w-4 h-4" /> {volunteer.email}
                    </div>
                </div>
            </div>

            <div className="relative z-10 bg-secondary/50 rounded-2xl p-6 border border-white/5">
                <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <h3 className="text-lg font-bold text-foreground shadow-none border-none m-0">Performance Rating</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-4xl font-extrabold text-foreground mb-1">
                            {volunteer.averageRating?.toFixed(1) || "0.0"} <span className="text-lg text-muted-foreground font-medium">/ 5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Based on {volunteer.totalRatings || 0} client reviews</p>
                    </div>
                    {/* Reuse existing component, but might need style tweaks if it relies on old CSS */}
                    <div className="text-3xl tracking-widest text-amber-500">
                        <RatingDisplay rating={volunteer.averageRating} count={volunteer.totalRatings} />
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}