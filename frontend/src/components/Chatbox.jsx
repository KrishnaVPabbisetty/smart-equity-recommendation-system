import { useState } from "react";
import { Send } from "lucide-react";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `Hello! I'm your AI investment assistant. I can help you with:\n• Stock analysis and recommendations\n• Market trends and insights\n• Investment strategies\n• Portfolio optimization\n• Risk assessment`,
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);

    // Fake AI reply for demo
    const fakeReply = {
      sender: "ai",
      text: "Thanks for your message. (Imagine this is a real AI response!)",
    };
    setTimeout(() => {
      setMessages((prev) => [...prev, fakeReply]);
    }, 1000);

    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="bg-white shadow rounded-xl p-4 flex flex-col justify-between h-full min-h-[400px]">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-gray-800">AI Investment Assistant</h3>
        {/* <button onClick={handleClear} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
          🗑 Clear Chat
        </button> */}
      </div>

      <div className="flex-1 overflow-y-scroll space-y-3 mb-4 pr-2">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`rounded-xl px-4 py-2 max-w-[80%] whitespace-pre-line ${
              msg.sender === "ai"
                ? "bg-gray-100 text-gray-800 self-start"
                : "bg-blue-500 text-white self-end ml-auto"
            }`}
          >
            {msg.sender === "ai" && <div className="text-xs mb-1 font-semibold">AI Assistant</div>}
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex items-center border rounded-full px-4 py-2">
        <input
          type="text"
          placeholder="Ask about stocks, market trends, or..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none bg-transparent"
        />
        <button onClick={handleSend} className="text-blue-500 hover:text-blue-700">
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
