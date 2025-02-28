from fastapi import APIRouter
from app.api.v1 import chat, conversations

api_router = APIRouter()

api_router.include_router(chat.router, prefix="/v1/chat", tags=["chat"])
api_router.include_router(conversations.router, prefix="/v1/conversations", tags=["conversations"]) 