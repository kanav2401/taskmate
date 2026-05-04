import { Link } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";

export default function BlockedBanner() {
  return (
    <div className="bg-destructive/10 border-l-4 border-destructive text-destructive px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden">

      <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/10 rounded-full blur-[50px] pointer-events-none" />

      <div className="flex items-start sm:items-center gap-3 relative z-10">
        <div className="p-2 bg-destructive/10 rounded-full shrink-0 mt-0.5 sm:mt-0">
            <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
            <h4 className="font-bold text-sm mb-0.5">Account Temporarily Suspended</h4>
            <p className="text-sm opacity-90 leading-snug">
              Your account has been restricted due to a missed deadline or policy violation. Please contact support.
            </p>
        </div>
      </div>

      <Link
        to="/complaint"
        className="shrink-0 bg-destructive hover:bg-destructive/90 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-destructive/20 flex items-center gap-2 group relative z-10"
      >
        Request Review <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
