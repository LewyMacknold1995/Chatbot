import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

// Main component with default props for customization
const SmartChatbot = ({
  companyName = 'Your Company',
  primaryColor = '#2563eb',
  welcomeMessage = 'Hello! How can I help you today?'
}) => {
  // State management
  const [isOpen, setIsOpen] = useState(false);          // Controls chat window visibility
  const [messages, setMessages] = useState([]);         // Stores chat messages
  const [userInput, setUserInput] = useState('');       // Current user input
  const [customerEmail, setCustomerEmail] = useState(''); // Stores customer email
  const [showEmailPrompt, setShowEmailPrompt] = useState(false); // Controls email form visibility

  // Initialize chat with welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          content: welcomeMessage,
          type: 'bot',
          timestamp: new Date().toISOString()
        }
      ]);
    }
  }, [isOpen, welcomeMessage]);

  // Basic response logic - This will be enhanced later
  const getAutomaticResponse = (input) => {
    const message = input.toLowerCase();
    
    // Simple pattern matching for responses
    if (message.includes('pricing') || message.includes('cost')) {
      return "Our pricing starts at $49/month. Would you like more details?";
    }
    if (message.includes('help') || message.includes('support')) {
      return "I'll be happy to help. Could you describe your issue?";
    }
    if (message.includes('contact') || message.includes('speak')) {
      return "I can help connect you with our team. Could you share your email?";
    }
    
    return "Thank you for your message. How can I assist you further?";
  };

  // Handle sending messages
  const handleSendMessage = () => {
    if (!userInput.trim()) return;

    // Create new message object
    const newMessage = {
      content: userInput,
      type: 'user',
      timestamp: new Date().toISOString()
    };

    // Add user message to chat
    setMessages(prev => [...prev, newMessage]);

    // Clear input field
    setUserInput('');

    // Simulate bot response with delay
    setTimeout(() => {
      const response = getAutomaticResponse(userInput);
      
      setMessages(prev => [...prev, {
        content: response,
        type: 'bot',
        timestamp: new Date().toISOString()
      }]);

      // Check if we should ask for email
      if (shouldCollectEmail(userInput)) {
        setShowEmailPrompt(true);
      }
    }, 1000);
  };

  // Check if we should collect email based on user input
  const shouldCollectEmail = (message) => {
    const triggerWords = ['contact', 'email', 'talk', 'call', 'more info'];
    return triggerWords.some(word => message.toLowerCase().includes(word));
  };

  // Handle email form submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (customerEmail) {
      // Add confirmation message
      setMessages(prev => [...prev, {
        content: `Thanks! We'll contact you at ${customerEmail} soon.`,
        type: 'bot',
        timestamp: new Date().toISOString()
      }]);
      
      // In a real implementation, you would:
      // 1. Save to database
      // 2. Send notification email
      // 3. Integrate with CRM
      console.log('Customer email collected:', customerEmail);
      
      setShowEmailPrompt(false);
      setCustomerEmail('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full p-4 text-white shadow-lg hover:shadow-xl transition-all"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 h-96 bg-white rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div 
            className="p-4 rounded-t-lg flex justify-between items-center text-white"
            style={{ backgroundColor: primaryColor }}
          >
            <span className="font-semibold">{companyName}</span>
            <button 
              onClick={() => setIsOpen(false)}
              className="hover:text-gray-200 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user' 
                      ? 'text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}
                  style={{ 
                    backgroundColor: message.type === 'user' ? primaryColor : undefined 
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
          </div>

          {/* Email Collection Form */}
          {showEmailPrompt && (
            <form onSubmit={handleEmailSubmit} className="p-4 border-t">
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-2 border rounded mb-2"
                required
              />
              <button 
                type="submit"
                className="w-full p-2 text-white rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                Submit
              </button>
            </form>
          )}

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 text-white rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartChatbot;