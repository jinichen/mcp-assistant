"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopNav } from "@/components/top-nav"
import { ConversationArea } from "@/components/conversation-area"
import type { ModelType } from "@/components/model-selector"

export default function Home() {
  const [model, setModel] = useState<ModelType>("gpt-3.5-turbo")

  const handleNewChat = () => {
    const event = new CustomEvent("new-chat")
    window.dispatchEvent(event)
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar className="w-64 hidden md:flex" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <TopNav
          model={model}
          onModelChange={setModel}
          onNewChat={handleNewChat}
        />
        <ConversationArea
          model={model}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  )
}
