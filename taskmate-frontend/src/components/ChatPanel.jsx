import { useEffect, useState, useRef } from "react";
import {
  getChatMessages,
  sendChatMessage,
  uploadChatFile,
} from "../api/api";

export default function ChatPanel({ taskId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const bottomRef = useRef();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (taskId) loadChats();
  }, [taskId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchUser = async () => {
    const res = await fetch("http://localhost:5000/api/auth/me", {
      credentials: "include",
    });
    const data = await res.json();
    setUserId(data.id);
  };

  const loadChats = async () => {
    const data = await getChatMessages(taskId);
    if (Array.isArray(data)) setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    let fileUrl = null;

    if (file) {
      const uploadRes = await uploadChatFile(file);
      fileUrl = uploadRes.fileUrl;
    }

    await sendChatMessage({
      taskId,
      text,
      fileUrl,
    });

    setText("");
    setFile(null);
    loadChats();
  };

  return (
    <div className="chat-overlay">
      <div className="chat-container">

        <div className="chat-header">
          <h3>Task Chat</h3>
          <button onClick={onClose}>✖</button>
        </div>

        <div className="chat-body">
          {messages.map((msg) => {
            const isMine = msg.sender?._id === userId;

            return (
              <div
                key={msg._id}
                className={`chat-row ${isMine ? "mine" : "other"}`}
              >
                <div className="chat-bubble">
                  <div className="chat-name">
                    {msg.sender?.name}
                  </div>

                  {msg.text && (
                    <div className="chat-text">
                      {msg.text}
                    </div>
                  )}

                  {msg.fileUrl && (
                    <a
                      href={msg.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="chat-file"
                    >
                      📎 View Attachment
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={bottomRef}></div>
        </div>

        <div className="chat-footer">
          <input
            type="text"
            placeholder="Type message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleSend}>Send</button>
        </div>

      </div>
    </div>
  );
}