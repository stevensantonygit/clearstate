"use client"

export default function AIAgentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AI Property Assistant</h1>
              <p className="text-gray-600">Get instant help with property searches and real estate advice</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-500">Online</span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
          <iframe
            src="https://www.chatbase.co/chatbot-iframe/BRiqYavzL7tnZ1YyMEgQR"
            width="100%"
            style={{ 
              height: '100%', 
              minHeight: '700px',
              border: 'none'
            }}
            frameBorder="0"
            title="AI Property Assistant"
          />
        </div>
      </div>

      {/* Features Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">🏠 Property Search</h3>
            <p className="text-sm text-gray-600">
              Find properties based on your specific requirements and budget
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">📊 Market Insights</h3>
            <p className="text-sm text-gray-600">
              Get the latest market trends and property valuations
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border">
            <h3 className="font-semibold text-gray-900 mb-2">💡 Expert Advice</h3>
            <p className="text-sm text-gray-600">
              Receive personalized recommendations from our AI assistant
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}