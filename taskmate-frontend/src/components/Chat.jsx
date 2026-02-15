import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { getChatMessages, sendChatMessage } from "../api/api";

const socket = io("http://localhost:5000", {
  withCredentials: true,
});

export default function Chat({ taskId, user }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

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
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async () => {
    const data = await getChatMessages(taskId);
    setMessages(data);
  };

  const handleSend = async () => {
    if (!text.trim()) return;

    const messageData = {
      taskId,
      text,
    };

    socket.emit("sendMessage", messageData);
    await sendChatMessage(messageData);

    setText(""); // 🔥 CLEAR INPUT AFTER SEND
  };

  return (
    <div className="chat-box">
      <div className="chat-header">
        <h3>Task Chat</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.sender === user.id
                ? "chat-message own"
                : "chat-message"
            }
          >
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
