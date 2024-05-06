from pydantic import BaseModel

class Query(BaseModel):
    document: str
    body: str