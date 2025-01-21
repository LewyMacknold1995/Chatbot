import SmartChatbot from './components/SmartChatbot'

function App() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Smart Support Demo</h1>
      <p className="mb-4">This is a demo page showing the chatbot integration. The chatbot appears in the bottom-right corner.</p>
      
      <div className="max-w-2xl">
        <h2 className="text-xl font-bold mb-2">Features Demonstrated:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Real-time chat interface</li>
          <li>Smart email collection</li>
          <li>Automated responses</li>
          <li>Backend integration</li>
          <li>Conversation storage</li>
        </ul>
      </div>

      <SmartChatbot 
        companyName="Demo Company"
        primaryColor="#2563eb"
        welcomeMessage="👋 Hi there! How can I help you today?"
      />
    </div>
  )
}

export default App