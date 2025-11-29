import { useState } from "react";
import { askAI } from "../../pages/services/ai/aiAssistant";

import { useTheme } from "../../context/ThemeContext";

export default function AIChatWindow() {
  const { theme } = useTheme();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const bgMain = theme === "light" ? "bg-white" : "bg-gray-800 text-white";

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-full shadow-lg z-50"
      >
        AI
      </button>

      {open && (
        <div className={`fixed bottom-20 right-6 w-80 h-96 shadow-lg rounded-xl p-4 flex flex-col z-50 ${bgMain}`}>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto border p-2 rounded mb-2">
            {messages.map((msg, idx) => (
              <div key={idx} className={`mb-2 ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    msg.sender === "user" ? "bg-blue-600 text-white" : "bg-gray-300 dark:bg-gray-700 dark:text-white"
                  }`}
                >
                  {msg.text}
                </span>
              </div>
            ))}
            {loading && <div className="text-gray-500">AI is typing...</div>}
          </div>

          {/* Input */}
          <div className="flex gap-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Ask AI..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="bg-green-600 text-white px-3 rounded" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
