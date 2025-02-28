from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator, Optional
from langchain_core.runnables import RunnableSequence

from app.models.chat import Message, Conversation
from app.schemas.chat import ChatRequest
from app.schemas.conversation import MessageCreate

class ChatService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def stream_chat(
        self,
        llm_chain: RunnableSequence,
        message: str,
        conversation_id: Optional[int] = None,
    ) -> AsyncGenerator[str, None]:
        # Save user message
        if conversation_id:
            user_message = MessageCreate(
                conversation_id=conversation_id,
                role="user",
                content=message,
                model=llm_chain.model_name if hasattr(llm_chain, "model_name") else "unknown",
            )
            await self._save_message(user_message)

        # Stream response from LLM
        response_content = ""
        is_first_chunk = True
        async for chunk in llm_chain.astream({"input": message}):
            token = str(chunk.content) if hasattr(chunk, "content") else str(chunk)
            
            # Add double newline before the first chunk
            if is_first_chunk and token.strip():
                response_content += "\n\n"
                yield "\n\n"
                is_first_chunk = False
            
            response_content += token
            yield token

        # Save assistant message if conversation exists
        if conversation_id:
            assistant_message = MessageCreate(
                conversation_id=conversation_id,
                role="assistant",
                content=response_content,
                model=llm_chain.model_name if hasattr(llm_chain, "model_name") else "unknown",
            )
            await self._save_message(assistant_message)

    async def _save_message(self, message: MessageCreate) -> Message:
        db_message = Message(
            conversation_id=message.conversation_id,
            role=message.role,
            content=message.content,
            model=message.model,
        )
        self.db.add(db_message)
        await self.db.commit()
        await self.db.refresh(db_message)
        return db_message 