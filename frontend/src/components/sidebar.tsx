"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  IconMessage2,
  IconShoppingBag,
  IconChevronDown,
  IconSettings,
  IconMessage,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Conversation {
  id: number
  title: string
  created_at: string
}

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const [chatOpen, setChatOpen] = useState(true)
  const [storeOpen, setStoreOpen] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations`)
        if (!response.ok) throw new Error('Failed to load conversations')
        const data = await response.json()
        // Keep only the most recent 10 conversations
        setConversations(data.slice(0, 10))
      } catch (error) {
        console.error('Error loading conversations:', error)
      }
    }
    loadConversations()
  }, [])

  const handleConversationClick = (conversation: Conversation) => {
    setSelectedId(conversation.id)
    // 触发一个自定义事件来通知 ConversationArea 加载选中的对话
    const event = new CustomEvent("select-conversation", {
      detail: { conversationId: conversation.id }
    })
    window.dispatchEvent(event)
  }

  const handleNewChat = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "New Conversation",
        }),
      })

      if (!response.ok) throw new Error("Failed to create conversation")

      const data = await response.json()
      setSelectedId(data.id)
      
      // 重新加载对话列表
      const listResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations/`)
      if (listResponse.ok) {
        const conversations = await listResponse.json()
        setConversations(conversations.slice(0, 15))
      }

      // 触发选择新对话的事件
      const event = new CustomEvent("select-conversation", {
        detail: { conversationId: data.id }
      })
      window.dispatchEvent(event)
    } catch (error) {
      console.error("Error creating new chat:", error)
    }
  }

  const handleDeleteConversation = async (e: React.MouseEvent, conversationId: number) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this conversation?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations/${conversationId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete conversation")

      // Remove the conversation from the local state
      setConversations(conversations.filter(c => c.id !== conversationId))

      // If the deleted conversation was selected, clear the selection
      if (selectedId === conversationId) {
        setSelectedId(null)
        // Trigger an event to clear the conversation area
        window.dispatchEvent(new CustomEvent("clear-conversation"))
      }
    } catch (error) {
      console.error("Error deleting conversation:", error)
    }
  }

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-sidebar/80 backdrop-blur-sm",
        className
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center">
        <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          ASA
        </div>
      </div>

      {/* Menu Items */}
      <div className="flex-1 space-y-2 p-4">
        <Collapsible open={chatOpen} onOpenChange={setChatOpen}>
          <CollapsibleTrigger asChild>
            <div className="flex items-center justify-between p-2 hover:bg-sidebar-foreground/5 rounded-md">
              <div className="flex items-center">
                <IconMessage2 className="mr-2 h-4 w-4 text-blue-500" />
                <span className="font-medium">CHAT</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="h-8 w-8 flex items-center justify-center hover:bg-sidebar-foreground/10 rounded-md cursor-pointer"
                  onClick={handleNewChat}
                >
                  <IconPlus className="h-4 w-4 text-blue-500" />
                </div>
                <IconChevronDown className={cn(
                  "h-4 w-4 text-muted-foreground transition-transform duration-200",
                  chatOpen && "transform rotate-180"
                )} />
              </div>
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 py-2">
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <Button
                  key={conversation.id}
                  variant={selectedId === conversation.id ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-between transition-colors group",
                    selectedId === conversation.id
                      ? "bg-sidebar-foreground/10 hover:bg-sidebar-foreground/15"
                      : "hover:bg-sidebar-foreground/5"
                  )}
                  onClick={() => handleConversationClick(conversation)}
                >
                  <div className="flex items-center">
                    <IconMessage className="mr-2 h-4 w-4 text-blue-500/80" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium">{conversation.title || "New Chat"}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(conversation.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <IconTrash
                    className="h-4 w-4 text-destructive opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={(e) => handleDeleteConversation(e, conversation.id)}
                  />
                </Button>
              ))}
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Collapsible open={storeOpen} onOpenChange={setStoreOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-between hover:bg-sidebar-foreground/5"
            >
              <div className="flex items-center">
                <IconShoppingBag className="mr-2 h-4 w-4 text-purple-500" />
                <span className="font-medium">MCP STORE</span>
              </div>
              <IconChevronDown className={cn(
                "h-4 w-4 text-muted-foreground transition-transform duration-200",
                storeOpen && "transform rotate-180"
              )} />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 py-2">
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-sm hover:bg-sidebar-foreground/5"
            >
              Browse MCPs
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start pl-8 text-sm hover:bg-sidebar-foreground/5"
            >
              My MCPs
            </Button>
          </CollapsibleContent>
        </Collapsible>
      </div>

      {/* Settings */}
      <div className="p-4 bg-gradient-to-t from-sidebar-foreground/5 to-transparent">
        <Button
          variant="ghost"
          className="w-full justify-start hover:bg-sidebar-foreground/5"
        >
          <IconSettings className="mr-2 h-4 w-4 text-gray-500" />
          <span className="font-medium">Settings</span>
        </Button>
      </div>
    </div>
  )
} 