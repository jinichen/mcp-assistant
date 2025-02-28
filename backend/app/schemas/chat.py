from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    model: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    content: str
    model: str 