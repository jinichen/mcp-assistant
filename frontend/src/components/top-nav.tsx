"use client"

import { Button } from "@/components/ui/button"
import {
  IconMenu2,
} from "@tabler/icons-react"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"
import { ModelSelector, type ModelType } from "./model-selector"

interface TopNavProps {
  model: ModelType
  onModelChange: (model: ModelType) => void
  onNewChat?: () => void
}

export function TopNav({ model, onModelChange, onNewChat }: TopNavProps) {
  return (
    <div className="fixed top-0 right-0 left-64 flex h-16 items-center justify-between px-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50 shadow-sm">
      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <IconMenu2 className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Title and Model Selector */}
      <div className="flex items-center justify-between min-w-0 flex-1 mx-4">
        <h1 className="text-lg font-semibold truncate">Current Conversation</h1>
        <div className="pr-2">
          <ModelSelector model={model} onChange={onModelChange} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
      </div>
    </div>
  )
} 