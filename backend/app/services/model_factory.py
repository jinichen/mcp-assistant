from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnableSequence
from langchain_deepseek import ChatDeepSeek
from langchain_nvidia_ai_endpoints import ChatNVIDIA
from langsmith import Client

from app.core.config import settings

# Initialize LangSmith client
client = Client(
    api_key=settings.LANGCHAIN_API_KEY,
    api_url=settings.LANGCHAIN_ENDPOINT,
)

DEFAULT_PROMPT = PromptTemplate.from_template(
    "You are a helpful AI assistant. {input}"
)

def get_llm_chain(model_name: str) -> RunnableSequence:
    if model_name == "gemini-pro":
        llm = ChatGoogleGenerativeAI(
            model="gemini-pro",
            google_api_key=settings.GOOGLE_API_KEY,
            temperature=0.7,
            streaming=True,
        )
    elif model_name == "gpt-3.5-turbo":
        llm = ChatOpenAI(
            model_name="gpt-3.5-turbo",
            openai_api_key=settings.OPENAI_API_KEY,
            temperature=0.7,
            streaming=True,
        )
    elif model_name == "deepseek-r1":
        llm = ChatDeepSeek(
            model_name="deepseek-r1",
            api_key=settings.DEEPSEEK_API_KEY,
            temperature=0.7,
            streaming=True,
        )
    elif model_name == "nvidia-ai":
        llm = ChatNVIDIA(
            model="deepseek-ai/deepseek-r1",  # NVIDIA AI Endpoints model
            api_key=settings.NVIDIA_API_KEY,
            temperature=0.7,
            streaming=True,
        )
    else:
        raise ValueError(f"Unsupported model: {model_name}")

    return DEFAULT_PROMPT | llm 