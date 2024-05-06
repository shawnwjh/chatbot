import api.chat.views
import api.upload.views
import uvicorn
import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()

OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')

app.include_router(api.chat.views.router)
app.include_router(api.upload.views.router)

@app.get('/')
def home():
    return {
        'message': 'home page'
    }

if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)