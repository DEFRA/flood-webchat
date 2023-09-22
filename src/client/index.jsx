import React from 'react'
import { createRoot } from 'react-dom/client'
import { StartChatButton } from './components/start-chat-button.jsx'
export function init (container) {
  const root = createRoot(container)
  root.render(<StartChatButton />)
}
