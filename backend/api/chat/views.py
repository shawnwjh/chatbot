import logging
import sys
import os
from .schemas import Query
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
    load_index_from_storage,
)
from fastapi import APIRouter

router = APIRouter(
    prefix='/chat'
)

@router.post('/')
async def question(query: Query):
    logging.basicConfig(stream=sys.stdout, level=logging.INFO)
    logging.getLogger().addHandler(logging.StreamHandler(stream=sys.stdout))

    PERSIST_DIR = f"C:/Users/wongs/Desktop/summarizer/backend/api/storage/{query.document}"

    storage_context = StorageContext.from_defaults(persist_dir=PERSIST_DIR)
    index = load_index_from_storage(storage_context)

    chat_engine = index.as_chat_engine(chat_mode="condense_question", verbose=True)
    response = chat_engine.chat(query.body)

    return {"message": response}