import React, { useState, useRef, useEffect } from "react";

export default function AIAssistant() {
  const [messages, setMessages] = useState([
    {
      role: "system",
      content:
        "Hello! I'm your AI investment assistant. I can help you with:\n" +
        "• Stock analysis and recommendations\n" +
        "• Market trends and insights\n" +
        "• Investment strategies\n" +
        "• Portfolio optimization\n" +
        "• Risk assessment.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();
  const baseURL=import.meta.env.VITE_API_BASE_URL;

  // auto‑scroll on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const question = input.trim();
    if (!question) return;

    // append user message
    const userMsg = { role: "user", content: question };
    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${baseURL}/api/agent-chat/message`, {
        method: "POST",
        headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                 },
        body: JSON.stringify({
          history: newHistory,
          message:question,
        }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `HTTP ${res.status}`);
      }
      const { status, response } = await res.json();
      if (status !== "success") throw new Error(response);
      setMessages((m) => [...m, { role: "assistant", content: response }]);
    } catch (err) {
      console.error("Chat error:", err);
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "⚠️ Error: " + err.message },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[750px] overflow-hidden border rounded-lg">
      {/* Message area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`whitespace-pre-wrap ${
              m.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block p-2 rounded ${
                m.role === "user"
                  ? "bg-blue-200 text-black"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="p-3 border-t flex items-center">
        <textarea
          rows={1}
          className="flex-1 p-2 border rounded resize-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="ml-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          {loading ? "…" : "Send"}
        </button>
      </div>
    </div>
  );
}