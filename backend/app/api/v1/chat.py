from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession
from typing import AsyncGenerator

from app.core.database import get_db
from app.schemas.chat import ChatRequest
from app.services.chat import ChatService
from app.services.model_factory import get_llm_chain

router = APIRouter()

@router.post("/")
async def chat(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
) -> StreamingResponse:
    try:
        chat_service = ChatService(db)
        llm_chain = get_llm_chain(request.model)
        
        async def stream_response() -> AsyncGenerator[str, None]:
            async for token in chat_service.stream_chat(
                llm_chain=llm_chain,
                message=request.message,
                conversation_id=request.conversation_id,
            ):
                yield token

        return StreamingResponse(
            stream_response(),
            media_type="text/event-stream",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 