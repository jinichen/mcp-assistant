from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional

from app.models.chat import Conversation, Message
from app.schemas.conversation import ConversationCreate

class ConversationService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def create_conversation(self, conversation: ConversationCreate) -> Conversation:
        db_conversation = Conversation(title=conversation.title)
        self.db.add(db_conversation)
        await self.db.commit()
        await self.db.refresh(db_conversation)
        return db_conversation

    async def get_conversation(self, conversation_id: int) -> Optional[Conversation]:
        result = await self.db.execute(
            select(Conversation).where(Conversation.id == conversation_id)
        )
        return result.scalar_one_or_none()

    async def list_conversations(self) -> List[Conversation]:
        result = await self.db.execute(
            select(Conversation).order_by(Conversation.updated_at.desc())
        )
        return result.scalars().all()

    async def get_conversation_messages(self, conversation_id: int) -> List[Message]:
        result = await self.db.execute(
            select(Message)
            .where(Message.conversation_id == conversation_id)
            .order_by(Message.created_at)
        )
        return result.scalars().all() 