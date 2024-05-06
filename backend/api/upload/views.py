import os
import shutil
from llama_index.core import (
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)
from fastapi import APIRouter, File, UploadFile

router = APIRouter(
    prefix='/upload'
)

@router.post('/')
async def create_upload_file(file: UploadFile=File(...)):
    try:
        print(file)
        folder_path = "C:/Users/wongs/Desktop/summarizer/backend/api/files"
        for filename in os.listdir(folder_path):
            filepath = os.path.join(folder_path, filename)
            if os.path.isfile(filepath) or os.path.islink(filepath):
                os.unlink(filepath)
    except Exception as e:
        print(f"Error: {e}")
    finally:
        file_path = f"C:/Users/wongs/Desktop/summarizer/backend/api/files/{file.filename}"
        with open(file_path, "w+b") as file_object:
            shutil.copyfileobj(file.file, file_object)

        documents = SimpleDirectoryReader("C:/Users/wongs/Desktop/summarizer/backend/api/files").load_data()
        index = VectorStoreIndex.from_documents(documents)
        PERSIST_DIR = f"C:/Users/wongs/Desktop/summarizer/backend/api/storage/{file.filename}"
        index.storage_context.persist(persist_dir=PERSIST_DIR)

        return {
                "filename": {file.filename},
                "filepath": {file_path}
        }