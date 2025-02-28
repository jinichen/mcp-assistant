from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from sqlalchemy import select

from app.core.database import get_db
from app.models.chat import Conversation
from app.schemas.conversation import (
    ConversationCreate,
    ConversationResponse,
    MessageResponse
)
from app.services.conversation import ConversationService

router = APIRouter()

@router.post("/", response_model=ConversationResponse)
async def create_conversation(
    conversation: ConversationCreate,
    db: AsyncSession = Depends(get_db)
):
    conversation_service = ConversationService(db)
    return await conversation_service.create_conversation(conversation)

@router.get("/", response_model=List[ConversationResponse])
async def list_conversations(
    db: AsyncSession = Depends(get_db)
):
    conversation_service = ConversationService(db)
    return await conversation_service.list_conversations()

@router.get("/{conversation_id}", response_model=ConversationResponse)
async def get_conversation(
    conversation_id: int,
    db: AsyncSession = Depends(get_db)
):
    conversation_service = ConversationService(db)
    conversation = await conversation_service.get_conversation(conversation_id)
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return conversation

@router.get("/{conversation_id}/messages", response_model=List[MessageResponse])
async def get_conversation_messages(
    conversation_id: int,
    db: AsyncSession = Depends(get_db)
):
    conversation_service = ConversationService(db)
    messages = await conversation_service.get_conversation_messages(conversation_id)
    if not messages:
        raise HTTPException(status_code=404, detail="Conversation not found")
    return messages

@router.post("/", response_model=ConversationResponse)
async def create_conversation_old(
    conversation: ConversationCreate,
    db: AsyncSession = Depends(get_db),
) -> ConversationResponse:
    db_conversation = Conversation(
        title=conversation.title or "New Conversation",
    )
    db.add(db_conversation)
    await db.commit()
    await db.refresh(db_conversation)
    return db_conversation

@router.get("/", response_model=List[ConversationResponse])
async def list_conversations_old(
    db: AsyncSession = Depends(get_db),
) -> List[ConversationResponse]:
    result = await db.execute(
        select(Conversation).order_by(Conversation.updated_at.desc())
    )
    conversations = result.scalars().all()
    return conversations 