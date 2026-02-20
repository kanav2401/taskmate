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

  useEffect(() => {
    if (!user) return;

    // 🔥 REGISTER USER SOCKET
    socket.emit("registerUser", user.id);

    loadNotifications();

    socket.on("newNotification", (data) => {
      console.log("🔥 NOTIFICATION RECEIVED:", data);
      setNotifications((prev) => [data, ...prev]);
    });

    return () => socket.off("newNotification");
  }, []);

  const loadNotifications = async () => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/notifications",
        { credentials: "include" }
      );
      const data = await res.json();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Notification load error");
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markRead = async (id) => {
    await fetch(
      `http://localhost:5000/api/notifications/${id}/read`,
      {
        method: "PUT",
        credentials: "include",
      }
    );

    setNotifications((prev) =>
      prev.map((n) =>
        n._id === id ? { ...n, isRead: true } : n
      )
    );
  };

  if (!user) return null;

  return (
    <div className="notif-wrapper">
      <div className="notif-bell" onClick={() => setOpen(!open)}>
        🔔
        {unreadCount > 0 && (
          <span className="notif-badge">{unreadCount}</span>
        )}
      </div>

      {open && (
        <div className="notif-panel">
          {notifications.length === 0 ? (
            <p>No notifications</p>
          ) : (
            notifications.map((n, index) => (
              <div
                key={index}
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