import React, { useState, useRef, useEffect } from "react";

const API_URL = "https://openrouter.ai/api/v1/chat/completions";
const API_KEY = "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";
// Switch to a more reliable model for testing
const MODEL = "openai/gpt-3.5-turbo";

const SYSTEM_PROMPT = `You are Reckonix AI Assistant, an expert on Reckonix Calibration, Testing, and Measuring Systems. Only answer questions related to Reckonix, its products, services, and support. If a user asks about sales, support, or has a query, always ask for their name, email, phone, company, and their specific query. Politely decline to answer questions not related to Reckonix. If the user provides contact info, acknowledge and thank them, and let them know a representative will follow up.`;

const BOT_ICON = (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#800000] text-white font-bold text-lg shadow-md">
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#800000"/><ellipse cx="12" cy="15" rx="6" ry="3" fill="#fff"/><circle cx="9" cy="10" r="1.5" fill="#fff"/><circle cx="15" cy="10" r="1.5" fill="#fff"/></svg>
  </div>
);
const USER_ICON = (
  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-300 text-gray-700 font-bold text-lg shadow-md">
    <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" fill="#a3a3a3"/><ellipse cx="12" cy="17" rx="7" ry="4" fill="#a3a3a3"/></svg>
  </div>
);

function ChatbotHeader() {
  return (
    <div className="bg-[#800000] text-white px-4 py-3 rounded-t-2xl font-bold text-lg flex items-center justify-between shadow-md">
      <span className="flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><ellipse cx="12" cy="15" rx="6" ry="3" fill="#800000"/><circle cx="9" cy="10" r="1.5" fill="#800000"/><circle cx="15" cy="10" r="1.5" fill="#800000"/></svg>
        Reckonix AI Chatbot
      </span>
      <button className="text-white hover:text-gray-200 text-2xl font-bold ml-2 focus:outline-none" id="close-chatbot-btn" aria-label="Close chat">×</button>
    </div>
  );
}

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: "system", content: SYSTEM_PROMPT }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [askedName, setAskedName] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [errorMsg, setErrorMsg] = useState("");

  // Show welcome and ask name on first open
  useEffect(() => {
    if (open && !askedName) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "Welcome to Reckonix! We're here to assist you." },
        { role: "assistant", content: "First, can we have your name please?" }
      ]);
      setAskedName(true);
    }
  }, [open, askedName]);

  // Always attach close handler to header button
  useEffect(() => {
    if (open) {
      const btn = document.getElementById("close-chatbot-btn");
      if (btn) btn.onclick = () => setOpen(false);
    }
  }, [open]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!input.trim()) return;
    if (!API_KEY) {
      setErrorMsg("API key is missing. Please set your OpenRouter API key.");
      return;
    }
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: newMessages.filter(m => m.role !== "system"),
          max_tokens: 512,
        }),
      });
      const data = await response.json();
      let aiMessage = "";
      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        aiMessage = data.choices[0].message.content.trim();
      } else if (data.error && data.error.message) {
        console.error("AI Error:", data.error);
        setErrorMsg("AI Error: " + (data.error.message || "Unknown error. Please try again later."));
        aiMessage = "Sorry, our AI service is temporarily unavailable. Please try again later.";
      } else {
        setErrorMsg("Unknown error from AI service. Please try again later.");
        aiMessage = "Sorry, I couldn't get a response from the AI.";
      }
      setMessages([...newMessages, { role: "assistant", content: aiMessage }]);
    } catch (err) {
      console.error("Network/Fetch Error:", err);
      setErrorMsg("Network error: " + (err instanceof Error ? err.message : String(err)));
      setMessages([...newMessages, { role: "assistant", content: "Sorry, there was a network error. Please try again later." }]);
    }
    setLoading(false);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  // Floating chat button
  if (!open) {
    return (
      <>
        {/* WhatsApp floating button (above chatbot) */}
        <a
          href="https://wa.me/919175240313"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-24 right-6 z-50 w-14 h-14 rounded-full bg-green-500 shadow-2xl flex items-center justify-center hover:bg-green-600 transition focus:outline-none"
          aria-label="Chat on WhatsApp"
          style={{ boxShadow: '0 4px 24px rgba(16,185,129,0.25)' }}
        >
          {/* Crisp WhatsApp glyph */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" className="text-white" aria-hidden="true">
            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.197.296-.767.966-.94 1.164-.173.198-.347.223-.644.074-1.749-.875-2.897-1.562-4.064-3.537-.307-.527.307-.489.874-1.63.097-.198.048-.371-.024-.52-.074-.149-.672-1.612-.921-2.207-.242-.579-.487-.5-.672-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.516-5.263c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.879 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.85 11.85 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.892a11.82 11.82 0 00-3.483-8.414" />
          </svg>
        </a>

        {/* Chatbot floating button */}
        <button
          className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#800000] shadow-2xl flex items-center justify-center hover:bg-[#a83232] transition focus:outline-none"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          style={{boxShadow: '0 4px 24px rgba(128,0,0,0.18)', maxWidth: '95vw', top: 'auto'}}
        >
          <svg width="36" height="36" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><path d="M7 10h10M7 14h6" stroke="#800000" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </>
    );
  }

  // Responsive height
  const chatWindowStyle = {
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 100px)',
    minHeight: '350px',
    height: window.innerWidth < 600 ? '60vh' : '500px',
    width: window.innerWidth < 600 ? '90vw' : '400px',
    maxWidth: '95vw',
  };

  return (
    <div
      className="fixed right-6 z-50"
      style={{
        margin: '8px',
        bottom: '24px',
        top: '80px',
        maxHeight: 'calc(100vh - 100px)',
        maxWidth: '95vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }}
    >
      <div
        className="max-w-[95vw] bg-gradient-to-br from-[#fff] via-[#f8eaea] to-[#f3f3f3] border border-gray-200 rounded-2xl shadow-2xl flex flex-col"
        style={chatWindowStyle}
      >
        {/* Header (always render) */}
        <ChatbotHeader />
        {/* Error message */}
        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 text-sm text-center">{errorMsg}</div>
        )}
        {/* Chat area */}
        <div className="flex-1 flex flex-col" style={{background: 'transparent', borderBottom: '1px solid #e5e7eb'}}>
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{maxHeight: '420px', minHeight: '120px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)'}}>
            {messages.filter(m => m.role !== "system").map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end`}>
                {msg.role === "assistant" && <div className="mr-2">{BOT_ICON}</div>}
                <div
                  className={`rounded-2xl px-4 py-2 text-base shadow-sm ${msg.role === "user" ? "bg-[#800000] text-white rounded-br-md" : "bg-white text-gray-900 rounded-bl-md border border-gray-200"}`}
                  style={{
                    maxWidth: '75%',
                    wordBreak: 'break-word',
                    whiteSpace: 'pre-line',
                    overflowWrap: 'break-word',
                    overflowX: 'hidden',
                    marginBottom: 2,
                    fontSize: '1rem',
                    letterSpacing: '0.01em',
                  }}
                >
                  {msg.content}
                </div>
                {msg.role === "user" && <div className="ml-2">{USER_ICON}</div>}
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div>{BOT_ICON}</div>
                <div className="rounded-2xl px-4 py-2 bg-white text-gray-900 border border-gray-200 shadow-sm animate-pulse" style={{fontSize: '1rem', maxWidth: '60%'}}>Typing…</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input area */}
          <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-gray-200 px-3 py-3 bg-white" style={{minHeight: '56px', borderRadius: '0 0 0 0'}}>
            <button type="button" className="text-gray-400 hover:text-gray-600 p-1" tabIndex={-1} title="Emoji (not implemented)"><span role="img" aria-label="emoji">😊</span></button>
            <input
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800000] text-base bg-[#fafafa]"
              type="text"
              placeholder="Type a message ..."
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              style={{minWidth: 0}}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#800000] text-white font-semibold hover:bg-[#6b0000] transition flex items-center justify-center"
              disabled={loading || !input.trim()}
              style={{minWidth: 44, minHeight: 44}}
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 