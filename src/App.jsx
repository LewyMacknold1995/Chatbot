import SmartChatbot from './components/SmartChatbot'

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Your Website Content</h1>
      <p>This is your main website content. The chatbot will appear in the bottom-right corner.</p>
      
      <SmartChatbot 
        companyName="Demo Company"
        primaryColor="#2563eb"
        welcomeMessage="👋 Hi there! How can I help you today?"
      />
    </div>
  )
}

export default App