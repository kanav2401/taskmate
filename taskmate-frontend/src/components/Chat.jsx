import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import {
  getChatMessages,
  sendChatMessage,
  uploadChatFile,
} from "../api/api";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default function Chat({ taskId, user, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    socket.emit("joinRoom", taskId);

    socket.on("receiveMessage", (data) => {
      if (data.taskId === taskId) {
        setMessages((prev) => [...prev, data]);
      }
    });

    loadMessages();

    return () => socket.off("receiveMessage");
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadMessages = async () => {
    const data = await getChatMessages(taskId);
    if (Array.isArray(data)) setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageData = { taskId, text };

    socket.emit("sendMessage", messageData);
    await sendChatMessage(messageData);

    setText("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadRes = await uploadChatFile(file);

    const messageData = {
      taskId,
      text: "",
      fileUrl: uploadRes.fileUrl,
    };

    socket.emit("sendMessage", messageData);
    await sendChatMessage(messageData);
  };

  const formatTime = (date) =>
    new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <div className="chat-modal-overlay">
      <div className="chat-modal">
        <div className="chat-header">
          <h3>Task Chat</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, index) => {
            const isOwn =
              msg.sender?.toString() === user.id?.toString();

            return (
              <div
                key={index}
                className={
                  isOwn
                    ? "chat-message-wrapper own"
                    : "chat-message-wrapper"
                }
              >
                <div
                  className={
                    isOwn
                      ? "chat-message own"
                      : "chat-message"
                  }
                >
                  {msg.text && (
                    <div className="chat-text">{msg.text}</div>
                  )}

                  {msg.fileUrl && (
                    <>
                      {msg.fileUrl.match(/\.(jpeg|jpg|png|gif)$/i) ? (
                        <img
                          src={msg.fileUrl}
                          alt="file"
                          className="chat-image"
                        />
                      ) : (
                        <a
                          href={msg.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          📎 Download File
                        </a>
                      )}
                    </>
                  )}

                  <div className="chat-meta">
                    <small>{formatTime(msg.createdAt)}</small>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <div className="chat-input">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message..."
          />

          <input
            type="file"
            onChange={handleFileUpload}
          />

          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}
