# app/schemas.py

from pydantic import BaseModel
from typing import List, Optional

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    query: str
    context: Optional[List[ChatMessage]] = []
    userId: Optional[str] = None
