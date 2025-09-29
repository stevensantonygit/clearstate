"use client"

import dynamic from 'next/dynamic';

// Dynamically import Spline for client-side rendering
const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading 3D Scene...</p>
      </div>
    </div>
  )
});

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

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
          
          {/* Left Column - Spline 3D Scene */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative w-full h-full min-h-[600px]">
              <Spline
                scene="https://prod.spline.design/CouJ9d5VTMtxIb3h/scene.splinecode"
              />
            </div>
          </div>

          {/* Right Column - AI Chat */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50">
              <h2 className="text-lg font-semibold text-gray-900">AI Chat Assistant</h2>
              <p className="text-sm text-gray-600">Ask me anything about properties</p>
            </div>
            <iframe
              src="https://www.chatbase.co/chatbot-iframe/BRiqYavzL7tnZ1YyMEgQR"
              width="100%"
              style={{ 
                height: 'calc(100% - 80px)', 
                minHeight: '500px',
                border: 'none'
              }}
              frameBorder="0"
              title="AI Property Assistant"
            />
          </div>

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