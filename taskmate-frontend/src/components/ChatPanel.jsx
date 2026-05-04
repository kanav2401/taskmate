import { useEffect, useState, useRef } from "react";
import {
  getChatMessages,
  sendChatMessage,
  uploadChatFile,
  API_URL,
} from "../api/api";
import { X, Send, Paperclip, File, MessageSquare } from "lucide-react";

export default function ChatPanel({ taskId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [sending, setSending] = useState(false);
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
    const res = await fetch(`${API_URL}/auth/me`, {
      credentials: "include",
    });
    const data = await res.json();
    setUserId(data.id);
  };

  const loadChats = async () => {
    const data = await getChatMessages(taskId);
    if (Array.isArray(data)) setMessages(data);
  };

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!text.trim() && !file) return;

    setSending(true);
    let fileUrl = null;

    try {
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
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center sm:justify-end sm:items-stretch bg-background/80 backdrop-blur-sm sm:pr-4 sm:py-4 animate-in fade-in duration-200">

      <div className="absolute inset-0 sm:hidden" onClick={onClose} />

      <div className="relative w-full h-full sm:w-[400px] sm:h-auto sm:max-h-[calc(100vh-2rem)] flex flex-col bg-background sm:rounded-[2rem] border border-border shadow-2xl overflow-hidden animate-in slide-in-from-right-4 sm:slide-in-from-right-12 duration-300">

        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-border bg-secondary/30 shrink-0">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl brand-gradient flex items-center justify-center text-white shadow-lg shadow-primary/20"><MessageSquare className="w-5 h-5"/></div>
             <div>
                 <h3 className="font-bold text-foreground m-0 border-none shadow-none leading-none mb-1">Task Chat</h3>
                 <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                    <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
                    Active Session
                 </p>
             </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border-none"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar bg-card/30">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
                <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center mb-4 text-muted-foreground/50">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <p className="text-foreground font-medium mb-1">Start the conversation</p>
                <p className="text-sm text-muted-foreground">Send a message or attachment to communicate about this task.</p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isMine = msg.sender?._id === userId;
              const showName = index === 0 || messages[index - 1].sender?._id !== msg.sender?._id;

              return (
                <div key={msg._id} className={`flex flex-col ${isMine ? "items-end" : "items-start"}`}>
                  {showName && !isMine && (
                    <span className="text-xs font-semibold text-muted-foreground mb-1 ml-1">{msg.sender?.name}</span>
                  )}
                  {showName && isMine && (
                    <span className="text-xs font-semibold text-primary mb-1 mr-1">You</span>
                  )}

                  <div className={`relative max-w-[85%] rounded-2xl p-3.5 shadow-sm group ${isMine ? "bg-primary text-primary-foreground rounded-tr-sm" : "bg-secondary text-foreground rounded-tl-sm border border-white/5"}`}>

                    {msg.text && (
                      <div className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                        {msg.text}
                      </div>
                    )}

                    {msg.fileUrl && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={`flex items-center gap-2 text-sm font-medium p-3 rounded-xl mt-2 transition-colors border ${isMine ? 'bg-black/10 hover:bg-black/20 border-white/10 text-white' : 'bg-background hover:bg-background/80 border-border'}`}
                      >
                        <File className="w-4 h-4 shrink-0" />
                        <span className="truncate">View Attachment</span>
                      </a>
                    )}

                    <span className={`text-[9px] font-medium absolute -bottom-5 opacity-0 group-hover:opacity-100 transition-opacity ${isMine ? "right-1 text-muted-foreground" : "left-1 text-muted-foreground"}`}>
                        {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={bottomRef} className="h-6"></div>
        </div>

        {file && (
            <div className="px-4 py-2 border-t border-border bg-secondary/30 flex items-center justify-between">
                <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 bg-background rounded border border-border shrink-0"><File className="w-3 h-3 text-primary" /></div>
                    <span className="text-xs text-foreground font-medium truncate">{file.name}</span>
                </div>
                <button onClick={() => setFile(null)} className="p-1 rounded bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-none transition-colors ml-2 shrink-0">
                    <X className="w-3 h-3" />
                </button>
            </div>
        )}

        <div className="p-3 border-t border-border bg-background shrink-0">
          <form onSubmit={handleSend} className="flex items-end gap-2 relative bg-secondary/50 rounded-[1.5rem] p-1.5 border border-border focus-within:border-primary/50 focus-within:bg-secondary transition-colors shadow-sm">

            <label className="shrink-0 p-2.5 rounded-xl text-muted-foreground hover:bg-background hover:text-foreground cursor-pointer transition-colors m-0.5">
               <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
               <Paperclip className="w-5 h-5" />
            </label>

            <textarea
              placeholder="Type a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend(e);
                  }
              }}
              rows={Math.min(Math.max(text.split('\n').length, 1), 4)}
              className="flex-1 max-h-32 bg-transparent text-foreground placeholder:text-muted-foreground/50 border-none outline-none resize-none py-3 px-1 text-sm leading-relaxed custom-scrollbar"
            />

            <button 
                type="submit" 
                disabled={sending || (!text.trim() && !file)}
                className="shrink-0 w-10 h-10 rounded-full brand-gradient text-white flex items-center justify-center hover:shadow-lg hover:shadow-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed m-0.5 border-none"
            >
              {sending ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <Send className="w-4 h-4 ml-0.5" />}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
