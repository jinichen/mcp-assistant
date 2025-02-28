"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export type ModelType = "gemini-pro" | "gpt-3.5-turbo" | "deepseek-r1" | "nvidia-ai"

export interface ModelSelectorProps {
  model: ModelType
  onChange: (model: ModelType) => void
}

const models = [
  {
    value: "gemini-pro",
    label: "Gemini 2.0 Pro",
    description: "Google's most capable model for text generation",
  },
  {
    value: "gpt-3.5-turbo",
    label: "GPT-3.5 Turbo",
    description: "OpenAI's fast and efficient model",
  },
  {
    value: "deepseek-r1",
    label: "DeepSeek R1",
    description: "DeepSeek AI's advanced language model",
  },
  {
    value: "nvidia-ai",
    label: "deepseek-ai/deepseek-r1",
    description: "NVIDIA AI Endpoints model",
  },
]

export function ModelSelector({ model, onChange }: ModelSelectorProps) {
  return (
    <Select value={model} onValueChange={(value) => onChange(value as ModelType)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select a model" />
      </SelectTrigger>
      <SelectContent>
        {models.map((model) => (
          <SelectItem key={model.value} value={model.value}>
            <div className="flex flex-col">
              <span className="font-medium">{model.label}</span>
              <span className="text-xs text-muted-foreground">
                {model.description}
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
} 