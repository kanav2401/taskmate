import { useEffect, useState, useRef } from "react";
import { getUser } from "../utils/auth";
import { Bell, Check } from "lucide-react";
import { API_URL } from "../api/api";
import socket from "../utils/socket";

export default function NotificationBell() {
  const user = getUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  /* ================= LOAD ================= */
  useEffect(() => {
    if (!user?.id) return;

    // 🔥 register user for realtime notifications
    socket.emit("registerUser", user.id);

    // 🔥 load existing notifications
    loadNotifications();

    // 🔥 realtime listener
    socket.on("newNotification", (data) => {
      console.log("🔥 NOTIFICATION RECEIVED:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("newNotification");
  }, [user?.id]);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ================= FETCH NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const res = await fetch(`${API_URL}/notifications`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        console.error("❌ Notification fetch failed:", res.status);
        return;
      }

      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Notification error:", err);
    }
  };

  /* ================= UNREAD COUNT ================= */
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ================= MARK READ ================= */
  const markRead = async (id, e) => {
    if (e) e.stopPropagation();
    try {
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("❌ Mark read error:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 🔔 BELL */}
      <button 
        onClick={() => setOpen(!open)}
        className={`relative p-2 rounded-full transition-colors flex items-center justify-center border-none ${open ? 'bg-secondary text-primary' : 'hover:bg-secondary/50 text-muted-foreground hover:text-foreground'}`}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0.5 right-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-red-500 font-bold text-white text-[10px] shadow-[0_0_0_2px_hsl(var(--background))] border-none">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 📦 PANEL */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-background/95 backdrop-blur-xl border border-border shadow-2xl rounded-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 flex flex-col max-h-[85vh]">
          
          <div className="p-4 border-b border-white/5 flex items-center justify-between bg-secondary/30 shrink-0">
             <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg brand-gradient flex items-center justify-center text-white"><Bell className="w-4 h-4"/></div>
                <h3 className="font-bold text-foreground border-none m-0 shadow-none">Notifications</h3>
             </div>
             {unreadCount > 0 && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">{unreadCount} New</span>
             )}
          </div>

          <div className="overflow-y-auto overflow-x-hidden flex-1 p-2 space-y-1 custom-scrollbar">
            {notifications.length === 0 ? (
              <div className="text-center py-12 px-4">
                  <Bell className="w-12 h-12 mx-auto text-muted-foreground opacity-20 mb-3" />
                  <p className="text-foreground font-medium">You're all caught up!</p>
                  <p className="text-sm text-muted-foreground">No new notifications right now.</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  onClick={() => { if(!n.isRead) markRead(n._id); }}
                  className={`relative p-4 rounded-xl transition-colors cursor-pointer group flex items-start gap-4 ${n.isRead ? "hover:bg-secondary/40 opacity-70" : "bg-primary/5 hover:bg-primary/10"}`}
                >
                  <div className={`mt-1 flex-shrink-0 w-2 h-2 rounded-full ${n.isRead ? 'bg-transparent' : 'brand-gradient shadow-[0_0_8px_rgba(37,99,235,0.5)]'}`} />
                  <div className="flex-1 pr-6 min-w-0">
                      <strong className={`block text-sm mb-1 truncate ${n.isRead ? 'text-foreground' : 'text-primary'}`}>{n.title}</strong>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">{n.message}</p>
                      <span className="text-[10px] text-muted-foreground opacity-70 block mt-2 uppercase font-bold tracking-wider">
                          {new Date(n.createdAt).toLocaleDateString(undefined, {month: 'short', day: 'numeric', hour: '2-digit', minute:'2-digit'})}
                      </span>
                  </div>
                  {!n.isRead && (
                    <button 
                        onClick={(e) => markRead(n._id, e)}
                        className="absolute right-4 top-4 p-1 rounded-md text-muted-foreground hover:bg-background hover:text-foreground opacity-0 group-hover:opacity-100 fill-mode-forwards transition-all border-none"
                        title="Mark as read"
                    >
                        <Check className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
          
          <div className="p-2 border-t border-white/5 bg-secondary/10 shrink-0">
             <button onClick={() => setOpen(false)} className="w-full py-2 rounded-xl text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors border-none">
                 Close
             </button>
          </div>
        </div>
      )}
    </div>
  );
}