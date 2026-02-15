from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# 문서(Swagger) 경로 설정 (선택사항이나 테스트에 유용)
app = FastAPI(docs_url="/api/docs", openapi_url="/api/openapi.json")

#CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/hello")
def read_root():
    return {"message": "ㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋㅋ? 네. 🚀"}