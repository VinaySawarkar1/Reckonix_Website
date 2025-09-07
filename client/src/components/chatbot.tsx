import React, { useState, useRef, useEffect } from "react";

// Rule-based chatbot system - no external APIs needed
const RULES = {
  // Greetings and basic responses
  greetings: {
    patterns: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    responses: [
      "Hello! Welcome to Reckonix. How can I assist you today?",
      "Hi there! I'm here to help with Reckonix products and services.",
      "Hello! Welcome to Reckonix. What can I help you with?"
    ]
  },
  
  // Product information
  products: {
    patterns: ['product', 'calibration', 'testing', 'measuring', 'equipment', 'instruments'],
    responses: [
      "Reckonix offers a wide range of calibration, testing, and measuring equipment. We have products for metrology systems, pressure calibration, temperature calibration, and more. Would you like to know about a specific category?",
      "Our product line includes precision instruments for industrial calibration, testing equipment, and measuring systems. What type of equipment are you looking for?"
    ]
  },
  
  // Metrology systems
  metrology: {
    patterns: ['metrology', 'vmm', 'vision', 'measuring machine', 'coordinate'],
    responses: [
      "Reckonix offers advanced VMM (Vision Measuring Machines) and metrology systems. Our VMM ULTRA series provides high-precision measurements with accuracy up to 2.5+L/200. Would you like to know more about our metrology solutions?",
      "We have VMM PRO and VMM ULTRA series for precision metrology applications. These systems offer advanced measurement capabilities for quality control and inspection."
    ]
  },
  
  // Calibration services
  calibration: {
    patterns: ['calibration service', 'calibrate', 'certification', 'traceability'],
    responses: [
      "Reckonix provides comprehensive calibration services with NABL accreditation. We offer on-site and laboratory calibration for various instruments. Our services include pressure, temperature, dimensional, and electrical calibration.",
      "We offer calibration services with full traceability to national standards. Our NABL accredited laboratory ensures accurate and reliable calibration results."
    ]
  },
  
  // Contact and sales
  contact: {
    patterns: ['contact', 'sales', 'quote', 'price', 'buy', 'purchase', 'inquiry'],
    responses: [
      "I'd be happy to connect you with our sales team. Could you please provide your name, company, and what you're looking for?",
      "For sales inquiries and quotes, I'll need some information. What's your name and company? Also, what specific products or services are you interested in?"
    ]
  },
  
  // Support and technical
  support: {
    patterns: ['support', 'help', 'technical', 'problem', 'issue', 'maintenance'],
    responses: [
      "For technical support and maintenance, please contact our support team. Could you provide your contact details and describe the issue you're experiencing?",
      "I can help connect you with our technical support team. Please share your name, company, and a brief description of the technical issue."
    ]
  },
  
  // Company information
  company: {
    patterns: ['company', 'about', 'reckonix', 'location', 'office', 'address'],
    responses: [
      "Reckonix is a leading provider of calibration, testing, and measuring systems in India. We specialize in precision instruments and offer comprehensive solutions for quality control and metrology applications.",
      "We're headquartered in India and serve customers across various industries including automotive, aerospace, manufacturing, and more. Our focus is on precision and reliability in all our products and services."
    ]
  },
  
  // Industries served
  industries: {
    patterns: ['industry', 'automotive', 'aerospace', 'manufacturing', 'pharmaceutical', 'oil and gas'],
    responses: [
      "Reckonix serves multiple industries including automotive, aerospace, manufacturing, pharmaceutical, oil & gas, and more. Our precision instruments are designed to meet the demanding requirements of these sectors.",
      "We work with various industries that require high-precision measurements and reliable calibration services. Our solutions are tailored to meet industry-specific needs and standards."
    ]
  },
  
  // Default response
  default: {
    patterns: [],
    responses: [
      "I'm here to help with Reckonix products and services. Could you please rephrase your question or let me know what specific information you need?",
      "I'm not sure I understood that. Could you tell me more about what you're looking for regarding Reckonix products or services?"
    ]
  }
};

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

function ChatbotHeader({ onMinimize, onClose, minimized, messageCount }: { onMinimize: () => void, onClose: () => void, minimized: boolean, messageCount: number }) {
  return (
    <div className="bg-[#800000] text-white px-4 py-3 rounded-t-2xl font-bold text-lg flex items-center justify-between shadow-md flex-shrink-0">
      <span className="flex items-center gap-2">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><ellipse cx="12" cy="15" rx="6" ry="3" fill="#800000"/><circle cx="9" cy="10" r="1.5" fill="#800000"/><circle cx="15" cy="10" r="1.5" fill="#800000"/></svg>
        Reckonix AI Assistant
        {minimized && messageCount > 0 && (
          <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 ml-2 animate-pulse">
            {messageCount}
          </span>
        )}
      </span>
      <div className="flex items-center gap-2">
        <button 
          className="text-white hover:text-gray-200 text-xl font-bold focus:outline-none p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors" 
          onClick={onMinimize}
          aria-label={minimized ? "Expand chat" : "Minimize chat"}
          title={minimized ? "Expand chat" : "Minimize chat"}
        >
          {minimized ? (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
              <path d="M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <button 
          className="text-white hover:text-gray-200 text-2xl font-bold focus:outline-none p-1 rounded hover:bg-white hover:bg-opacity-20 transition-colors" 
          onClick={onClose}
          aria-label="Close chat"
          title="Close chat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

// Rule-based response function
function getBotResponse(userMessage: string, conversationState: any): string {
  const message = userMessage.toLowerCase().trim();
  
  // Check if user is providing contact information
  if (conversationState.askingForContact) {
    if (message.includes('@') || message.includes('phone') || message.includes('company')) {
      conversationState.askingForContact = false;
      conversationState.contactInfo = true;
      return "Thank you for providing your information! Our team will contact you within 24 hours. Is there anything else I can help you with regarding Reckonix products or services?";
    }
  }
  
  // Check for greetings first
  if (RULES.greetings.patterns.some(pattern => message.includes(pattern))) {
    return RULES.greetings.responses[Math.floor(Math.random() * RULES.greetings.responses.length)];
  }
  
  // Check for product inquiries
  if (RULES.products.patterns.some(pattern => message.includes(pattern))) {
    return RULES.products.responses[Math.floor(Math.random() * RULES.products.responses.length)];
  }
  
  // Check for metrology specific queries
  if (RULES.metrology.patterns.some(pattern => message.includes(pattern))) {
    return RULES.metrology.responses[Math.floor(Math.random() * RULES.metrology.responses.length)];
  }
  
  // Check for calibration services
  if (RULES.calibration.patterns.some(pattern => message.includes(pattern))) {
    return RULES.calibration.responses[Math.floor(Math.random() * RULES.calibration.responses.length)];
  }
  
  // Check for contact/sales inquiries
  if (RULES.contact.patterns.some(pattern => message.includes(pattern))) {
    conversationState.askingForContact = true;
    return RULES.contact.responses[Math.floor(Math.random() * RULES.contact.responses.length)];
  }
  
  // Check for support inquiries
  if (RULES.support.patterns.some(pattern => message.includes(pattern))) {
    conversationState.askingForContact = true;
    return RULES.support.responses[Math.floor(Math.random() * RULES.support.responses.length)];
  }
  
  // Check for company information
  if (RULES.company.patterns.some(pattern => message.includes(pattern))) {
    return RULES.company.responses[Math.floor(Math.random() * RULES.company.responses.length)];
  }
  
  // Check for industry information
  if (RULES.industries.patterns.some(pattern => message.includes(pattern))) {
    return RULES.industries.responses[Math.floor(Math.random() * RULES.industries.responses.length)];
  }
  
  // Default response
  return RULES.default.responses[Math.floor(Math.random() * RULES.default.responses.length)];
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [askedName, setAskedName] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationState, setConversationState] = useState({
    askingForContact: false,
    contactInfo: false
  });

  // Show welcome message on first open
  useEffect(() => {
    if (open && !askedName) {
      setMessages([
        { role: "assistant", content: "Welcome to Reckonix! I'm your AI assistant, here to help with information about our calibration, testing, and measuring systems." },
        { role: "assistant", content: "How can I assist you today? You can ask me about our products, services, or company information." }
      ]);
      setAskedName(true);
    }
  }, [open, askedName]);

  // Handle minimize/expand
  const handleMinimize = () => {
    setMinimized(!minimized);
  };

  // Handle close
  const handleClose = () => {
    setOpen(false);
    setMinimized(false);
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const userMessage = input.trim();
    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);
    setInput("");
    
    // Get bot response using rule-based system
    const botResponse = getBotResponse(userMessage, conversationState);
    setConversationState({...conversationState}); // Update state
    
    // Add bot response
    setTimeout(() => {
      setMessages([...newMessages, { role: "assistant", content: botResponse }]);
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }, 500); // Small delay to simulate typing
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
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="26" height="26" className="text-white" aria-hidden="true">
            <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.149-.672.15-.197.296-.767.966-.94 1.164-.173.198-.347.223-.644.074-1.749-.875-2.897-1.562-4.064-3.537-.307-.527.307-.489.874-1.63.097-.198.048-.371-.024-.52-.074-.149-.672-1.612-.921-2.207-.242-.579-.487-.5-.672-.51-.173-.01-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.29.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.516-5.263c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.85 0 012.893 6.994c-.003 5.45-4.437 9.884-9.879 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.85 11.85 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.892a11.82 11.82 0 00-3.483-8.414" />
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

  // Responsive height - adjust for minimized state
  const chatWindowStyle = {
    overflow: 'hidden',
    maxHeight: minimized ? 'auto' : 'calc(100vh - 120px)',
    minHeight: minimized ? 'auto' : '350px',
    height: minimized ? 'auto' : (window.innerWidth < 600 ? '60vh' : '450px'),
    width: window.innerWidth < 600 ? '90vw' : '400px',
    maxWidth: '95vw',
  };

  return (
    <div
      className="fixed right-6 z-50"
      style={{
        bottom: '24px',
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
        {/* Header */}
        <ChatbotHeader 
          onMinimize={handleMinimize} 
          onClose={handleClose} 
          minimized={minimized}
          messageCount={messages.length}
        />
        
        {/* Chat area - only show when not minimized */}
        {!minimized && (
          <div className="flex-1 flex flex-col" style={{background: 'transparent', borderBottom: '1px solid #e5e7eb', minHeight: 0}}>
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{maxHeight: '350px', minHeight: '120px', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.03)'}}>
              {messages.map((msg, i) => (
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
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <form onSubmit={sendMessage} className="flex items-center gap-2 border-t border-gray-200 px-3 py-3 bg-white flex-shrink-0" style={{minHeight: '56px', borderRadius: '0 0 0 0'}}>
              <button type="button" className="text-gray-400 hover:text-gray-600 p-1" tabIndex={-1} title="Emoji (not implemented)"><span role="img" aria-label="emoji">😊</span></button>
              <input
                className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#800000] text-base bg-[#fafafa]"
                type="text"
                placeholder="Type a message ..."
                value={input}
                onChange={e => setInput(e.target.value)}
                style={{minWidth: 0}}
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-[#800000] text-white font-semibold hover:bg-[#6b0000] transition flex items-center justify-center"
                disabled={!input.trim()}
                style={{minWidth: 44, minHeight: 44}}
              >
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
} 
