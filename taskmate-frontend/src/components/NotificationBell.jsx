import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getUser } from "../utils/auth";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default function NotificationBell() {
  const user = getUser();
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

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

  /* ================= FETCH NOTIFICATIONS ================= */
  const loadNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notifications",
        {
          method: "GET",
          credentials: "include", // ✅ VERY IMPORTANT
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

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
  const markRead = async (id) => {
    try {
      await fetch(
        `http://localhost:5000/api/notifications/${id}/read`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("❌ Mark read error:", err);
    }
  };

  if (!user) return null;

  return (
    <div className="notif-wrapper">
      {/* 🔔 BELL */}
      <div className="notif-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </div>

      {/* 📦 PANEL */}
      {open && (
        <div className="notif-panel">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                className={`notif-item ${n.isRead ? "" : "unread"}`}
                onClick={() => markRead(n._id)}
              >
                <strong>{n.title}</strong>
                <p>{n.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}