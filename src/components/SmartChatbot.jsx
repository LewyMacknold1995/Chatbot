import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

const SmartChatbot = ({
  companyName = 'Your Company',
  primaryColor = '#2563eb',
  welcomeMessage = 'Hello! How can I help you today?'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialise chat with welcome message
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

  // Save conversation to backend
  const saveConversation = async (message) => {
    try {
      const response = await fetch(`${API_URL}/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message)
      });
      
      if (!response.ok) {
        throw new Error('Failed to save conversation');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Save lead to backend
  const saveLead = async (email, conversation) => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          conversation: JSON.stringify(conversation)
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to save lead');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error saving lead:', error);
    }
  };

  // Get bot response
  const getAutomaticResponse = (input) => {
    const message = input.toLowerCase();
    
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

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setIsLoading(true);
    
    // Create user message
    const userMessage = {
      content: userInput,
      type: 'user',
      timestamp: new Date().toISOString()
    };

    // Add to UI and save to backend
    setMessages(prev => [...prev, userMessage]);
    await saveConversation(userMessage);
    setUserInput('');

    // Get and handle bot response
    setTimeout(async () => {
      const botResponse = {
        content: getAutomaticResponse(userMessage.content),
        type: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, botResponse]);
      await saveConversation(botResponse);

      if (shouldCollectEmail(userMessage.content)) {
        setShowEmailPrompt(true);
      }

      setIsLoading(false);
    }, 1000);
  };

  const shouldCollectEmail = (message) => {
    const triggerWords = ['contact', 'email', 'talk', 'call', 'more info'];
    return triggerWords.some(word => message.toLowerCase().includes(word));
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (customerEmail) {
      setIsLoading(true);

      // Save lead
      await saveLead(customerEmail, messages);

      // Add confirmation message
      const confirmationMessage = {
        content: `Thanks! We'll contact you at ${customerEmail} soon.`,
        type: 'bot',
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, confirmationMessage]);
      await saveConversation(confirmationMessage);
      
      setShowEmailPrompt(false);
      setCustomerEmail('');
      setIsLoading(false);
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
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 animate-pulse">
                  Typing...
                </div>
              </div>
            )}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                className="p-2 text-white rounded hover:opacity-90 transition-opacity"
                style={{ backgroundColor: primaryColor }}
                disabled={isLoading}
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