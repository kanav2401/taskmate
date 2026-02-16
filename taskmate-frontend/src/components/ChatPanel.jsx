import { useEffect, useState } from "react";
import { getChatList } from "../api/api";

export default function ChatPanel({ onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const data = await getChatList();
    setChats(data);
  };

  return (
    <div className="chat-panel">
      <h3>Your Chats</h3>

      {chats.map((chat) => (
        <div
          key={chat.taskId}
          className="chat-list-item"
          onClick={() => onSelectChat(chat.taskId)}
        >
          <div className="chat-title">{chat.taskTitle}</div>
          <div className="chat-last-message">
            {chat.lastMessage}
          </div>
        </div>
      ))}
    </div>
  );
}
