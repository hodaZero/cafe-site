import { useState, useRef, useEffect } from "react";
import { askAI } from "../../pages/services/ai/aiAssistant";
import { useTheme } from "../../context/ThemeContext";

export default function AIChatWindow() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function sendMessage() {
    if (!input.trim()) return;

    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    setLoading(true);

    const reply = await askAI(input);

    setMessages((prev) => [...prev, { sender: "ai", text: reply }]);
    setLoading(false);
  }

  const bgMain = theme === "light" ? "bg-light-surface text-black" : "bg-dark-surface text-white";
  const inputBg = theme === "light" ? "bg-light-input border-light-inputBorder" : "bg-dark-input border-dark-inputBorder";
  const userBubble = theme === "light" ? "bg-light-primary text-white" : "bg-dark-primary text-white";
  const aiBubble = theme === "light" ? "bg-light-surface dark:bg-dark-surface border border-light-inputBorder" : "bg-dark-surface border border-dark-inputBorder";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white px-5 py-3 rounded-full shadow-xl z-50 hover:scale-105 transform transition"
      >
        AI
      </button>

      {open && (
        <div
          className={`fixed bottom-20 right-6 w-96 h-[500px] shadow-2xl rounded-2xl flex flex-col z-50 border ${bgMain} border-light-inputBorder dark:border-dark-inputBorder`}
        >
          {/* Header */}
          <div className="p-3 border-b border-light-inputBorder dark:border-dark-inputBorder font-semibold text-lg flex justify-between items-center">
            <span>AI Assistant</span>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-500 hover:text-red-500 transition"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <span
                  className={`inline-block max-w-[75%] px-4 py-2 rounded-2xl break-words ${msg.sender === "user" ? userBubble : aiBubble}`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && (
              <div className="text-gray-400 italic">AI is typing...</div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className={`p-3 flex gap-2 border-t border-light-inputBorder dark:border-dark-inputBorder ${inputBg} rounded-b-2xl`}>
            <input
              className={`flex-1 px-3 py-2 rounded-lg focus:outline-none ${theme === "light" ? "bg-white" : "bg-gray-700 text-white"}`}
              placeholder="Ask AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg text-white font-semibold hover:scale-105 transform transition"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
