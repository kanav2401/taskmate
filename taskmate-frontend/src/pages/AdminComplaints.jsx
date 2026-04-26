import { useEffect, useState } from "react";
import { getComplaints, deleteComplaint } from "../api/api";
import { ShieldAlert, Trash2, ArrowRight } from "lucide-react";

export default function AdminComplaints(){
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    loadComplaints();
  },[]);

  const loadComplaints = async()=>{
    setLoading(true);
    try {
      const data = await getComplaints();
      setComplaints(Array.isArray(data)?data:[]);
    } catch(err) {
      console.error("Failed to load complaints");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async(id)=>{
    if(!window.confirm("Resolve and delete this complaint?")) return;
    await deleteComplaint(id);
    loadComplaints();
  };

  return(
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-destructive/10 flex items-center justify-center text-destructive"><ShieldAlert className="w-6 h-6"/></div>
            <div>
                <h1 className="text-3xl font-bold text-foreground border-none m-0 shadow-none">Complaints Panel</h1>
                <p className="text-muted-foreground">Review and manage user disputes</p>
            </div>
        </div>

        <div className="glass-card rounded-[2rem] border-none overflow-hidden p-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-secondary/50 border-b border-white/5">
                  <th className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Complainant</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Against</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Task Context</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider min-w-[300px]">Message</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider">Date</th>
                  <th className="p-4 font-semibold text-muted-foreground text-sm uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-muted-foreground">Loading complaints...</td>
                  </tr>
                ) : complaints.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-16 text-center text-muted-foreground">
                       <ShieldAlert className="w-12 h-12 mx-auto mb-4 opacity-20" />
                       No complaints found. All good!
                    </td>
                  </tr>
                ) : complaints.map(c=>(
                  <tr key={c._id} className="border-b border-white/5 hover:bg-secondary/30 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-foreground mb-1">{c.complainBy?.name || "-"}</div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">{c.complainBy?.role}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-foreground mb-1">{c.complainAgainst?.name || "-"}</div>
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">{c.complainAgainst?.role}</span>
                    </td>
                    <td className="p-4 text-sm font-medium text-foreground max-w-[200px] truncate">
                      {c.task?.title || "-"}
                    </td>
                    <td className="p-4 text-sm text-foreground/80 max-w-[300px]">
                      {c.message}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground whitespace-nowrap">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={()=>handleDelete(c._id)}
                        className="inline-flex items-center justify-center p-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors border-none"
                        title="Delete Complaint"
                      >
                        <Trash2 className="w-5 h-5"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}