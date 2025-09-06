'use client'

import { useNotification } from '../contexts/NotificationContext'

const Notifications = () => {
  const { notifications, removeNotification } = useNotification()

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm w-full bg-white rounded-lg shadow-lg border-l-4 transform transition-all duration-300 ease-in-out animate-slide-in ${
            notification.type === 'success' ? 'border-green-500' :
            notification.type === 'error' ? 'border-red-500' :
            notification.type === 'warning' ? 'border-yellow-500' :
            'border-blue-500'
          }`}
        >
          <div className="flex items-center p-4">
            <div className="flex-shrink-0">
              {notification.type === 'success' && (
                <div className="w-5 h-5 text-green-500">
                  ✅
                </div>
              )}
              {notification.type === 'error' && (
                <div className="w-5 h-5 text-red-500">
                  ❌
                </div>
              )}
              {notification.type === 'warning' && (
                <div className="w-5 h-5 text-yellow-500">
                  ⚠️
                </div>
              )}
              {notification.type === 'info' && (
                <div className="w-5 h-5 text-blue-500">
                  ℹ️
                </div>
              )}
            </div>
            <div className="ml-3 flex-grow">
              <p className="text-sm font-medium text-gray-900">
                {notification.message}
              </p>
            </div>
            <div className="ml-4 flex-shrink-0 flex">
              <button
                onClick={() => removeNotification(notification.id)}
                className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150"
              >
                <span className="sr-only">Close</span>
                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Notifications