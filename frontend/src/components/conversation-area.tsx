"use client"

import { useEffect, useRef, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { IconSend } from "@tabler/icons-react"
import { cn } from "@/lib/utils"
import { type ModelType } from "./model-selector"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
}

interface ConversationAreaProps {
  model: ModelType
  onNewChat?: () => void
}

export function ConversationArea({ model, onNewChat }: ConversationAreaProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<number | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const tempMessageRef = useRef<Message | null>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 监听新对话事件
  useEffect(() => {
    const handleNewChat = () => {
      startNewChat()
    }
    window.addEventListener("new-chat", handleNewChat)
    return () => window.removeEventListener("new-chat", handleNewChat)
  }, [])

  // 监听对话选择事件
  useEffect(() => {
    const handleSelectConversation = async (event: Event) => {
      const customEvent = event as CustomEvent<{ conversationId: number }>
      const { conversationId } = customEvent.detail
      try {
        // 先验证对话是否存在
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations/${conversationId}`)
        if (!response.ok) {
          if (response.status === 404) {
            console.error("Selected conversation not found")
            // 加载最近的对话列表
            const listResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations`)
            if (listResponse.ok) {
              const conversations = await listResponse.json()
              if (conversations.length > 0) {
                // 如果有其他对话，选择第一个
                setConversationId(conversations[0].id)
              } else {
                // 如果没有对话，创建新对话
                await startNewChat()
              }
            }
            return
          }
          throw new Error("Failed to verify conversation")
        }
        setConversationId(conversationId)
      } catch (error) {
        console.error("Error handling conversation selection:", error)
        // 出错时创建新对话
        await startNewChat()
      }
    }

    window.addEventListener("select-conversation", handleSelectConversation)
    return () => window.removeEventListener("select-conversation", handleSelectConversation)
  }, [])

  // 加载最近的对话
  useEffect(() => {
    const loadRecentConversation = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations`)
        if (!response.ok) {
          throw new Error("Failed to load conversations")
        }
        
        const conversations = await response.json()
        console.log("Loaded conversations:", conversations)
        
        if (conversations.length > 0) {
          // 验证最新对话是否存在
          const latestConversation = conversations[0]
          const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations/${latestConversation.id}`)
          if (verifyResponse.ok) {
            setConversationId(latestConversation.id)
          } else {
            // 如果最新对话不存在，创建新对话
            await startNewChat()
          }
        } else {
          await startNewChat()
        }
      } catch (error) {
        console.error("Error loading recent conversation:", error)
        await startNewChat()
      }
    }

    if (!conversationId) {
      loadRecentConversation()
    }
  }, [])

  const startNewChat = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations`, {
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
      setConversationId(data.id)
      setMessages([])
      tempMessageRef.current = null
    } catch (error) {
      console.error("Error creating new chat:", error)
      // 如果创建失败，清除状态
      setConversationId(null)
      setMessages([])
      tempMessageRef.current = null
    }
  }

  // 当 conversationId 变化时加载消息
  useEffect(() => {
    if (conversationId) {
      // 添加一个小延迟确保服务器端的数据已经准备好
      const timer = setTimeout(() => {
        loadMessages(conversationId)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [conversationId])

  const loadMessages = async (convId: number) => {
    try {
      console.log("Loading messages for conversation:", convId)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/conversations/${convId}/messages`)
      
      if (!response.ok) {
        if (response.status === 404) {
          // 404 可能意味着消息列表为空，这不是错误
          console.log("No messages found for conversation:", convId)
          setMessages([])
          return
        }
        console.error("Failed to load messages:", await response.text())
        return
      }
      
      const data = await response.json()
      console.log("Loaded messages:", data)
      
      // Keep only the most recent 15 messages
      const formattedMessages: Message[] = (Array.isArray(data) ? data : []).slice(-15).map((msg: any) => ({
        id: msg.id.toString(),
        role: msg.role,
        content: msg.content,
      }))
      
      console.log("Formatted messages:", formattedMessages)
      
      // 如果有临时消息，保留它
      if (tempMessageRef.current) {
        formattedMessages.push(tempMessageRef.current)
      }
      
      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
      // 出错时设置为空消息列表
      setMessages([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage = input.trim()
    setInput("")
    
    // Add user message to the messages state
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage
    }
    setMessages(prev => [...prev, newUserMessage])

    try {
      // Start streaming response
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          message: userMessage,
          model: model,
          stream: true, // Enable streaming
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // Add an empty AI message that will be updated during streaming
      const tempAiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: ""
      }
      setMessages(prev => [...prev, tempAiMessage])

      const reader = response.body?.getReader()
      if (!reader) throw new Error("No reader available")

      let accumulatedContent = ""
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        // Convert the chunk to text and append it directly
        const chunk = new TextDecoder().decode(value)
        accumulatedContent += chunk
        
        // Update the AI message with accumulated content
        setMessages(prev => {
          const newMessages = [...prev]
          const lastMessage = newMessages[newMessages.length - 1]
          if (lastMessage.role === "assistant") {
            lastMessage.content = accumulatedContent
          }
          return newMessages
        })
      }
    } catch (error) {
      console.error("Error sending message:", error)
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== newUserMessage.id))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="flex-1 flex flex-col h-screen pt-16">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => {
          const parts = message.role === 'assistant' 
            ? message.content.split(/(<think>[\s\S]*?<\/think>)/).filter(Boolean)
            : [message.content]
          
          return (
            <div
              key={message.id}
              className={cn(
                "flex gap-2 max-w-[80%]",
                message.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <Avatar className="flex-shrink-0">
                <AvatarFallback className={cn(
                  "text-sm font-medium",
                  message.role === "assistant" 
                    ? "bg-blue-100 text-blue-700"
                    : "bg-purple-100 text-purple-700"
                )}>
                  {message.role === "assistant" ? "AI" : "ME"}
                </AvatarFallback>
              </Avatar>
              <div
                className={cn(
                  "rounded-lg p-3 shadow-sm",
                  message.role === "user"
                    ? "bg-[hsl(var(--message-user-bg))] text-[hsl(var(--message-user-fg))]"
                    : "bg-[hsl(var(--message-ai-bg))] text-[hsl(var(--message-ai-fg))]"
                )}
              >
                {parts.map((part, index) => {
                  if (part.startsWith('<think>') && part.endsWith('</think>')) {
                    const content = part.replace(/<\/?think>/g, '').trim()
                    return content ? (
                      <div key={index} className="text-[hsl(var(--message-ai-think))] whitespace-pre-line mb-2 text-sm">
                        {content}
                      </div>
                    ) : null
                  }
                  const trimmedContent = part.trim()
                  return trimmedContent ? (
                    <div key={index} className="whitespace-pre-line leading-relaxed">
                      {trimmedContent}
                    </div>
                  ) : null
                })}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gradient-to-t from-background/80 to-background/40 backdrop-blur-sm">
        <div className="flex gap-2 items-end max-w-5xl mx-auto w-full">
          <Textarea
            ref={textareaRef}
            placeholder="Type your message..."
            className="min-h-[60px] max-h-[200px] overflow-y-auto resize-none rounded-xl bg-background/95 border border-gray-200 dark:border-gray-800 focus-visible:ring-1 focus-visible:ring-blue-500/50 shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button 
            size="icon" 
            className="h-[60px] w-[60px] rounded-xl bg-[hsl(var(--message-user-bg))] hover:bg-[hsl(var(--message-user-bg))] hover:opacity-90 transition-opacity shadow-[0_2px_8px_rgba(0,0,0,0.08)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.16)]"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <IconSend className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  )
} 